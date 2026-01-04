const CACHE = "readiness-pwa-v3-v2"; // Updated cache version to force refresh
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./data/demo_tiles.json"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e)=>{
  const url = new URL(e.request.url);
  
  // Don't intercept favicon requests - let browser handle them naturally
  if (url.pathname.includes('favicon.ico')) {
    return; // Don't call e.respondWith, let the request pass through
  }
  
  // Skip service worker for API requests (port 5000, POST requests, or API endpoints)
  const isAPIRequest = 
    url.port === '5000' || 
    (url.hostname === 'localhost' && url.port === '5000') ||
    e.request.method !== 'GET' || 
    url.pathname.includes('/predict') || 
    url.pathname.includes('/health') ||
    url.pathname.includes('/tiles');
  
  if (isAPIRequest) {
    // Don't intercept API requests - let them pass through to network
    return; // Don't call e.respondWith, let the request pass through
  }
  
  // For static assets, use cache-first strategy
  e.respondWith(
    caches.match(e.request).then((cached)=>{
      if (cached) {
        return cached;
      }
      return fetch(e.request).then((res)=>{
        // Only cache successful GET responses that are basic (same-origin)
        if (e.request.method === 'GET' && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c=>{
            try {
              c.put(e.request, copy);
            } catch(err) {
              // Ignore cache put errors
            }
          });
        }
        return res;
      }).catch((err)=>{
        // If fetch fails and no cache, return a proper error response
        console.error('[SW] Fetch failed:', err);
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {'Content-Type': 'text/plain'}
        });
      });
    }).catch((err)=>{
      // Fallback if cache.match fails
      return new Response('Cache error', {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {'Content-Type': 'text/plain'}
      });
    })
  );
});
