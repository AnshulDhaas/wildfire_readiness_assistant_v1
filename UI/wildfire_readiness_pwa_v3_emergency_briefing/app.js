/* Wildfire Readiness Assistant - PWA (Emergency Briefing theme; no frameworks) */
/* Version: 3 - Scenario-based assessment (historical patterns, not real-time) + Test scenarios */
console.log("[APP] Loading app.js v3 - Scenario-based readiness assessment with test scenarios");


const FEATURE_HELP = {
  "Distance to fire (km)": "Minimum distance from your location to a historical fire perimeter in the analyzed year. Smaller distance means closer to past fire activity in that area.",
  "Wind (km/h)": "Maximum daily wind speed at 10m height. Higher wind can increase spread potential under dry conditions.",
  "Dryness (ET0 mm)": "Reference evapotranspiration (ET0). Higher values indicate drier conditions and higher fuel drying potential.",
  "Temp max (°C)": "Maximum daily temperature. Higher temperatures can contribute to drier fuels.",
  "Precip (mm)": "Total daily precipitation. More rain generally reduces short-term fire readiness."
};

function prettyFeatureRows(features){
  // map model feature keys -> user-friendly labels + values
  const mapping = [
    ["Distance to fire (km)", "DISTANCE_TO_FIRE_KM"],
    ["Wind (km/h)", "AWND"],
    ["Dryness (ET0 mm)", "EVAP"],
    ["Temp max (°C)", "TMAX"],
    ["Precip (mm)", "PRCP"],
  ];
  return mapping.map(([label, key])=>{
    const v = Number(features?.[key]);
    return { label, value: Number.isFinite(v) ? v.toFixed(2) : "—" };
  });
}
// API URL configuration - supports deployment via config.js or environment
let API_URL = "http://localhost:5000";  // Default for local development

// Try to load config.js if it exists (for deployment)
try {
  // This will be loaded via a script tag in index.html if config.js exists
  if (typeof CONFIG !== 'undefined' && CONFIG.API_URL) {
    API_URL = CONFIG.API_URL;
    console.log("[APP] Using API URL from config.js:", API_URL);
  }
} catch (e) {
  // config.js doesn't exist, use default
  console.log("[APP] Using default API URL (localhost:5000). Create config.js for deployment.");
}

const state = { route: "home", tiles: [], selected: null, zip: "", useAPI: true };
let $view = null;
let $btnEthics = null;

// Initialize DOM references when DOM is ready
function initDOMElements() {
  $view = document.getElementById("view");
  $btnEthics = document.getElementById("btnEthics");
  
  if (!$view) {
    console.error("Error: #view element not found in HTML");
  }
}

function clamp01(x){ return Math.max(0, Math.min(1, x)); }

// 3-level UI mapping (thresholds calibrated for Logistic Regression model)
function uiReadinessFromProb(p){
  if (p < 0.25) return { label: "Low", cls: "low", emoji: "🟢", subtitle: "Go about your day" };
  if (p < 0.45) return { label: "Moderate", cls: "mod", emoji: "🟡", subtitle: "Pack a go-bag, review your route" };
  return { label: "High", cls: "high", emoji: "🔴", subtitle: "Be ready to leave if advised" };
}

function confidenceLabel(p){
  if (p < 0.2 || p > 0.8) return "High";
  if (p < 0.35 || p > 0.65) return "Moderate";
  return "Low";
}

async function loadDemo(){
  // Initialize empty tiles - tiles will be created dynamically based on ZIP code input
  // Actual predictions come from the API/model
  state.tiles = [];
  state.selected = null;
  console.log("[UI] Ready for ZIP code input. Predictions will come from API/model.");
}

async function predictFromAPI(features){
  try {
    console.log("[API] Making prediction request with features:", features);
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log("[API] Prediction received from model:", result);
    return result;
  } catch (error) {
    console.error("[API] Prediction failed:", error);
    alert(`Error: Could not get prediction from model. Please ensure the API server is running at ${API_URL}\n\nError: ${error.message}`);
    throw error; // Don't fall back to demo data - force API usage
  }
}

// Helper function to run test scenarios
async function runTestScenario(features, label) {
  const loadingMsg = document.createElement("div");
  loadingMsg.textContent = "Computing readiness assessment...";
  loadingMsg.style.cssText = "text-align: center; padding: 20px;";
  if ($view) {
    $view.innerHTML = loadingMsg.outerHTML;
  }
  
  try {
    // Create tile with test features
    state.selected = {
      tile_id: "TEST_SCENARIO",
      label: label,
      features: features
    };
    
    // Get prediction directly from API
    const apiResult = await predictFromAPI(features);
    
    // Update selected tile with API results
    state.selected.p_elevated = apiResult.p_elevated;
    state.selected.confidence = apiResult.confidence;
    state.selected.why = apiResult.why;
    state.selected.features = apiResult.features;
    
    setRoute("summary");
  } catch (error) {
    console.error("[TEST] Scenario test failed:", error);
    alert(`Test scenario failed: ${error.message}`);
    setRoute("location");
  }
}

function setRoute(route){
  state.route = route;
  render();
  document.querySelectorAll(".navbtn").forEach(b => b.classList.toggle("active", b.dataset.route === route));
}

function card(inner){ return `<section class="card">${inner}</section>`; }

function renderHome(){
  return [
    card(`
      <div class="h1">Readiness assessment</div>
      <p class="p">
        This app estimates the probability that <b>readiness should be elevated</b> for a location,
        based on historical fire patterns and weather conditions.
      </p>
      <div class="row">
        <button class="btn primary" id="goLocation">Run assessment</button>
        <button class="btn secondary" id="goSummary">Share summary</button>
      </div>
      <div class="hr"></div>
      <div class="small">
        Advisory readiness only • This tool does <b>not</b> issue evacuation orders or replace official emergency directives.
      </div>
    `),
    card(`
      <div class="h2">What you’ll see</div>
      <ul class="list">
        <li>Readiness level (Low / Moderate / High)</li>
        <li>Probability score and confidence</li>
        <li>Key inputs and plain-language “Why?”</li>
        <li>Action checklist tailored to readiness</li>
      </ul>
    `)
  ].join("");
}

function renderLocation(){
  return card(`
    <div class="h1">Location</div>
    <p class="p">Enter a California ZIP code to explore scenario-based readiness assessments. This tool uses historical patterns and representative conditions, not real-time prediction.</p>

    <div class="row">
      <div class="col">
        <label class="small">ZIP Code</label><br/>
        <input id="zipInput" placeholder="e.g., 95060" value="${state.zip}" style="width: 100%; padding: 8px; font-size: 16px;" />
        <div class="small" style="margin-top:6px;">Enter a California ZIP code to get your assessment.</div>
      </div>
    </div>

    <div class="hr"></div>

    <div class="row">
      <button class="btn primary" id="goSummary">Run assessment</button>
      <button class="btn" id="useGeo">Use my location</button>
    </div>

    <div class="hr"></div>

    <div class="h2" style="margin-top:12px;">Test Scenarios (for model verification)</div>
    <p class="small">Use these preset scenarios to verify the model responds correctly to different conditions:</p>
    
    <div class="row" style="margin-top:10px; gap: 8px;">
      <button class="btn" id="testHigh" style="background: #dc2626; color: white;">High Risk Test</button>
      <button class="btn" id="testModerate" style="background: #f59e0b; color: white;">Moderate Risk Test</button>
      <button class="btn" id="testLow" style="background: #10b981; color: white;">Low Risk Test</button>
    </div>
    
    <div class="small" style="margin-top:8px;">
      <strong>High:</strong> Distance 8km, Wind 22 km/h, EVAP 5mm, PRCP 0mm, Temp 34°C<br/>
      <strong>Moderate:</strong> Distance 45km, Wind 12 km/h, EVAP 3.5mm, PRCP 0mm, Temp 26°C<br/>
      <strong>Low:</strong> Distance 800km, Wind 8 km/h, EVAP 2mm, PRCP 4mm, Temp 20°C
    </div>

    <div class="hr"></div>

    <div class="h2" style="margin-top:12px;">Manual Input (for testing)</div>
    <p class="small">Enter values manually to test specific scenarios:</p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
      <div>
        <label class="small">Distance (km)</label>
        <input id="manualDistance" type="number" placeholder="e.g., 5" style="width: 100%; padding: 6px;" />
      </div>
      <div>
        <label class="small">Wind (km/h)</label>
        <input id="manualWind" type="number" placeholder="e.g., 35" style="width: 100%; padding: 6px;" />
      </div>
      <div>
        <label class="small">EVAP (mm)</label>
        <input id="manualEvap" type="number" placeholder="e.g., 7" style="width: 100%; padding: 6px;" />
      </div>
      <div>
        <label class="small">Precip (mm)</label>
        <input id="manualPrcp" type="number" placeholder="e.g., 0" style="width: 100%; padding: 6px;" />
      </div>
      <div>
        <label class="small">Temp Max (°C)</label>
        <input id="manualTemp" type="number" placeholder="e.g., 37.8" style="width: 100%; padding: 6px;" />
      </div>
    </div>
    
    <div class="row" style="margin-top:10px;">
      <button class="btn" id="testManual">Test Manual Input</button>
    </div>

    <div class="small" style="margin-top:10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
      <strong>Note:</strong> This is a scenario-based readiness assessment using historical patterns from the 2022 fire season. 
      It demonstrates how the model works with representative conditions, not real-time weather prediction.
    </div>
  `);
}

function renderSummary(){
  const t = state.selected;
  if(!t) return card(`<div class="h1">No location selected</div><p class="p">Go to Location and enter a ZIP code.</p>`);

  const p = clamp01(Number(t.p_elevated || 0));
  const r = uiReadinessFromProb(p);
  const conf = t.confidence || confidenceLabel(p);
  
  // Display ZIP code if available, otherwise use tile label
  const locationLabel = state.zip ? `ZIP ${state.zip.trim().substring(0, 5)}` : (t.label || "Selected Location");
  const pct = Math.round(p*100);

  const bar = `<div class="bar"><div style="width:${pct}%"></div></div>`;

  const featureRows = Object.entries(t.features || {}).map(([k,v]) =>
    `<div class="kpi"><div class="small">${k}</div><div class="right"><strong>${Number(v).toFixed(2)}</strong><div class="small">&nbsp;</div></div></div>`
  ).join("");

  const whyList = (t.why || []).map(x => `<li>${escapeHtml(x)}</li>`).join("");

  return [
    card(`
      <div class="small">Location</div>
      <div class="h1" style="margin-top:4px;">${locationLabel}</div>

      <div class="readinessCard ${r.cls}" style="margin-top:10px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
          <div>
            <div class="badge ${r.cls}">${r.emoji} ${r.label}</div>
            <div class="readiness-subtitle" style="font-size:15px; font-weight:600; margin-top:6px; color:rgba(255,255,255,.92);">${r.subtitle}</div>
            <div style="font-size:40px; font-weight:900; margin-top:6px; letter-spacing:-0.8px;">${p.toFixed(3)}</div>
            <div class="small" style="color:rgba(255,255,255,.85); margin-top:2px;">Probability of elevated readiness</div>
          </div>
          <div style="text-align:right;">
            <div class="small" style="color:rgba(255,255,255,.85);">Confidence</div>
            <div style="font-size:18px; font-weight:850; margin-top:2px;">${conf}</div>
          </div>
        </div>

        <div style="margin-top:12px;">${bar}</div>
        <div class="small" style="color:rgba(255,255,255,.85); margin-top:8px;">
          Low &lt; 0.25 • Moderate 0.25–0.45 • High ≥ 0.45
        </div>

        <div class="hr" style="margin:16px 0; border-color:rgba(255,255,255,.2);"></div>
        
        <div class="row">
          <button class="btn on-dark" id="goWhy">Why?</button>
          <button class="btn on-dark" id="goActions">Actions checklist</button>
        </div>

        <div id="readinessWhySection" class="readinessWhyBody" style="display:none; margin-top:14px; padding-top:14px; border-top:1px solid rgba(255,255,255,.2);">
          <ul class="list" style="margin:0; padding-left:18px; color:rgba(255,255,255,.92);">${whyList}</ul>
          <div class="small" style="color:rgba(255,255,255,.82); margin-top:10px;">Plain-language explanation of the model's drivers. This is readiness guidance — always follow official alerts and directives.</div>
        </div>
      </div>

      <div class="small" style="margin-top:10px;">
        Advisory readiness only (not evacuation orders). This assessment uses scenario-based inputs from historical patterns, not real-time prediction.
      </div>
    `),
    card(`
      <div class="h2">Key inputs & rationale</div>
      <div class="summaryGrid" id="summaryGrid"></div>
    `)
  ].join("");
}

function renderActions(){
  const p = clamp01(Number(state.selected?.p_elevated || 0));
  const r = uiReadinessFromProb(p);

  const low = `<ul class="list">
    <li>Stay informed via local alerts and official sources.</li>
    <li>Review emergency contacts and basic supplies.</li>
    <li>Know where to find air quality and road updates.</li>
  </ul>`;

  const mod = `<ul class="list">
    <li>Review evacuation routes and meeting points (in case officials issue orders).</li>
    <li>Charge devices; keep your car fueled if possible.</li>
    <li>Prepare essentials (water, meds, IDs, pet supplies).</li>
    <li>Monitor official alerts (county fire, CAL FIRE, NWS).</li>
  </ul>`;

  const high = `<ul class="list">
    <li>Stage go-bags by the door; prep pets/leashes/carriers.</li>
    <li>Identify 2 routes and keep your vehicle ready (park facing out).</li>
    <li>Monitor official alerts continuously; be ready to leave early.</li>
    <li>Follow local emergency management instructions immediately.</li>
  </ul>`;

  const body = r.cls==="low" ? low : (r.cls==="mod" ? mod : high);

  return card(`
    <div class="h1">Actions checklist</div>
    <p class="p">Practical steps based on readiness level. This tool does not issue evacuation orders.</p>
    <div class="readinessCard ${r.cls}">
      <div class="badge ${r.cls}">${r.emoji} ${r.label}</div>
      <div class="readiness-subtitle" style="font-size:15px; font-weight:600; margin-top:6px; color:rgba(255,255,255,.92);">${r.subtitle}</div>
      <div style="margin-top:10px;">${body}</div>
    </div>
    <div class="hr"></div>
    <div class="small">Always follow official instructions from emergency management agencies.</div>
  `);
}

function renderEthics(){
  return card(`
    <div class="h1">Ethics & limits</div>
    <p class="p"><b>Readiness advisory</b> only. This tool supports situational awareness and preparedness.</p>
    <div class="hr"></div>
    <div class="h2">Limits of generalization</div>
    <ul class="list">
      <li>Validated for California regions (2022) and tiles explicitly analyzed.</li>
      <li>Outside those regions/seasons, outputs may be misleading without retraining/recalibration.</li>
    </ul>
    <div class="h2" style="margin-top:12px;">Tool purpose</div>
    <ul class="list">
      <li>Does not issue evacuation orders or replace official directives.</li>
      <li>Always follow county, CAL FIRE, and emergency management instructions.</li>
    </ul>
  `);
}

function escapeHtml(s){ return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function render(){
  if (!$view) {
    console.error("Cannot render: $view element is null");
    return;
  }
  
  let html = "";
  switch(state.route){
    case "home": html = renderHome(); break;
    case "location": html = renderLocation(); break;
    case "summary": html = renderSummary(); break;
    case "actions": html = renderActions(); break;
    case "ethics": html = renderEthics(); break;
    default: html = renderHome();
  }
  $view.innerHTML = html;

  if(state.route==="home"){
    document.getElementById("goLocation")?.addEventListener("click", () => setRoute("location"));
    document.getElementById("goSummary")?.addEventListener("click", () => setRoute("summary"));
  }

  if(state.route==="location"){
    // Helper function to get tile ID and city name from ZIP code
    function getTileFromZip(zip) {
      const zipNum = parseInt(zip);
      if (isNaN(zipNum)) return null;
      
      // Bay Area ZIP codes (94000-94999, 95000-95199, 95200-95299)
      if (zipNum >= 94000 && zipNum <= 95299) {
        // San Jose area (95100-95199)
        if (zipNum >= 95100 && zipNum <= 95199) {
          return { tileId: "CA_tile_07_2022", city: "San Jose" };
        }
        // Santa Cruz area (95060-95067, 95073)
        if ((zipNum >= 95060 && zipNum <= 95067) || zipNum === 95073) {
          return { tileId: "CA_tile_07_2022", city: "Santa Cruz" };
        }
        // Other Bay Area
        return { tileId: "CA_tile_07_2022", city: "Bay Area" };
      }
      // Inland Valley (90000-93999)
      if (zipNum >= 90000 && zipNum <= 93999) {
        return { tileId: "CA_tile_12_2022", city: "Inland Valley" };
      }
      // Default to Bay Area for other California ZIPs
      if (zipNum >= 90000 && zipNum <= 96199) {
        return { tileId: "CA_tile_07_2022", city: "California" };
      }
      return null;
    }
    
    document.getElementById("zipInput")?.addEventListener("input", (e)=> {
      state.zip = e.target.value;
      const zip = state.zip.trim();
      
      // Create tile dynamically from ZIP code
      if (zip.length >= 5) {
        const zipPrefix = zip.substring(0, 5);
        const tileInfo = getTileFromZip(zipPrefix);
        
        if (tileInfo) {
          // Create tile dynamically with default features (will be updated by API)
          state.selected = {
            tile_id: tileInfo.tileId,
            label: `${tileInfo.city} (ZIP ${zipPrefix})`,
            features: {
              TMAX: 25.0,
              AWND: 10.0,
              PRCP: 0.0,
              EVAP: 3.0,
              DISTANCE_TO_FIRE_KM: 50.0
            }
          };
        }
      }
    });
    document.getElementById("goSummary")?.addEventListener("click", async () => {
      // Require ZIP code to be entered
      if (!state.zip || state.zip.trim().length < 5) {
        alert("Please enter a valid ZIP code (5 digits).");
        return;
      }
      
      const zip = state.zip.trim().substring(0, 5);
      const zipNum = parseInt(zip);
      
      if (isNaN(zipNum)) {
        alert("Please enter a valid ZIP code.");
        return;
      }
      
      // Determine tile and city from ZIP code
      let tileId = "CA_tile_07_2022"; // Default to Bay Area
      let city = "Bay Area";
      
      if (zipNum >= 94000 && zipNum <= 95299) {
        tileId = "CA_tile_07_2022";
        if (zipNum >= 95100 && zipNum <= 95199) {
          city = "San Jose";
        } else if ((zipNum >= 95060 && zipNum <= 95067) || zipNum === 95073) {
          city = "Santa Cruz";
        } else {
          city = "Bay Area";
        }
      } else if (zipNum >= 90000 && zipNum <= 93999) {
        tileId = "CA_tile_12_2022";
        city = "Inland Valley";
      }
      
      // Show loading message
      const loadingMsg = document.createElement("div");
      loadingMsg.textContent = "Loading scenario-based assessment...";
      loadingMsg.style.cssText = "text-align: center; padding: 20px;";
      $view.innerHTML = loadingMsg.outerHTML;
      
      try {
        // Get scenario-based inputs (historical patterns, not real-time)
        const scenarioResponse = await fetch(`${API_URL}/scenario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ zip_code: zip })
        });
        
        if (!scenarioResponse.ok) {
          throw new Error(`Scenario API error: ${scenarioResponse.status}`);
        }
        
        const scenarioData = await scenarioResponse.json();
        console.log("[UI] Generated scenario:", scenarioData.scenario);
        console.log("[UI] Scenario inputs:", scenarioData);
        
        // Create tile with scenario-based data
        state.selected = {
          tile_id: tileId,
          label: `${city} (ZIP ${zip})`,
          scenario_description: scenarioData.scenario,
          features: {
            TMAX: scenarioData.TMAX || 25.0,
            AWND: scenarioData.AWND || 10.0,
            PRCP: scenarioData.PRCP || 0.0,
            EVAP: scenarioData.EVAP || 3.0,
            DISTANCE_TO_FIRE_KM: scenarioData.DISTANCE_TO_FIRE_KM || 50.0
          }
        };
        
        // Update loading message
        loadingMsg.textContent = "Computing readiness assessment...";
        
        // Get prediction with scenario-based data
        const apiResult = await predictFromAPI(state.selected.features);
        // Update selected tile with API results from the model
        state.selected.p_elevated = apiResult.p_elevated;
        state.selected.confidence = apiResult.confidence;
        state.selected.why = apiResult.why;
        state.selected.features = apiResult.features; // Use features from API response
        setRoute("summary");
      } catch (error) {
        // Error already shown in predictFromAPI
        setRoute("location"); // Go back to location selection
      }
    });
    document.getElementById("useGeo")?.addEventListener("click", useGeolocation);
    
    // High Risk — very close + bad weather
    document.getElementById("testHigh")?.addEventListener("click", async () => {
      await runTestScenario({
        DISTANCE_TO_FIRE_KM: 8.0,    // Under 10km threshold
        AWND: 22.0,                   // High wind
        EVAP: 5.0,                    // Dry
        PRCP: 0.0,                    // No rain
        TMAX: 34.0
      }, "High Risk Test Scenario");
    });

    // Moderate Risk — close but not critical
    document.getElementById("testModerate")?.addEventListener("click", async () => {
      await runTestScenario({
        DISTANCE_TO_FIRE_KM: 45.0,   // Under 50km but not extreme
        AWND: 12.0,                   // Moderate wind
        EVAP: 3.5,
        PRCP: 0.0,
        TMAX: 26.0
      }, "Moderate Risk Test Scenario");
    });

    // Low Risk — far away + favorable conditions
    document.getElementById("testLow")?.addEventListener("click", async () => {
      await runTestScenario({
        DISTANCE_TO_FIRE_KM: 800.0,  // Well beyond 50km
        AWND: 8.0,                    // Calm
        EVAP: 2.0,                    // Not dry
        PRCP: 4.0,                    // Some rain
        TMAX: 20.0
      }, "Low Risk Test Scenario");
    });
    
    // Manual input test
    document.getElementById("testManual")?.addEventListener("click", async () => {
      const distance = parseFloat(document.getElementById("manualDistance")?.value);
      const wind = parseFloat(document.getElementById("manualWind")?.value);
      const evap = parseFloat(document.getElementById("manualEvap")?.value);
      const prcp = parseFloat(document.getElementById("manualPrcp")?.value);
      const temp = parseFloat(document.getElementById("manualTemp")?.value);
      
      if (isNaN(distance) || isNaN(wind) || isNaN(evap) || isNaN(prcp) || isNaN(temp)) {
        alert("Please enter all values for manual testing.");
        return;
      }
      
      await runTestScenario({
        DISTANCE_TO_FIRE_KM: distance,
        AWND: wind,
        EVAP: evap,
        PRCP: prcp,
        TMAX: temp
      }, "Manual Test Input");
    });
  }

  if(state.route==="summary"){
    populateSummaryPanels();
    const whyButton = document.getElementById("goWhy");
    const whySection = document.getElementById("readinessWhySection");
    if(whyButton && whySection){
      whyButton.addEventListener("click", () => {
        const isHidden = whySection.style.display === "none";
        whySection.style.display = isHidden ? "block" : "none";
      });
    }
    document.getElementById("goActions")?.addEventListener("click", () => setRoute("actions"));
  }
  
  // Note: btnEthics is handled in DOMContentLoaded event listener below
}

async function useGeolocation(){
  if(!navigator.geolocation){ alert("Geolocation not supported."); return; }
  navigator.geolocation.getCurrentPosition((pos)=>{
    alert(`Got location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}\n(Location-based tile selection will be implemented.)`);
    setRoute("summary");
  }, (err)=> alert("Could not get location: " + err.message), { timeout:8000 });
}

async function registerSW(){
  if("serviceWorker" in navigator){
    try{ await navigator.serviceWorker.register("sw.js"); } catch(e){ console.warn("SW registration failed", e); }
  }
}

document.addEventListener("click", (e)=>{
  const btn = e.target.closest(".navbtn");
  if(btn) setRoute(btn.dataset.route);
});

// App initialization is now handled in DOMContentLoaded event listener above


function openEthicsModal(){
  const m = document.getElementById("ethicsModal");
  if(!m) return;
  m.setAttribute("aria-hidden","false");
  document.getElementById("closeEthics")?.focus();
}
function closeEthicsModal(){
  const m = document.getElementById("ethicsModal");
  if(!m) return;
  m.setAttribute("aria-hidden","true");
  document.getElementById("btnEthics")?.focus();
}

document.addEventListener("click", (e)=>{
  if(e.target?.dataset?.close){ closeEthicsModal(); }
});
document.addEventListener("keydown", (e)=>{
  const m = document.getElementById("ethicsModal");
  if(m && m.getAttribute("aria-hidden")==="false" && e.key==="Escape"){ closeEthicsModal(); }
});

function initApp() {
  // Initialize DOM element references
  initDOMElements();
  
  // Set up ethics modal handlers
  document.getElementById("btnEthics")?.addEventListener("click", openEthicsModal);
  document.getElementById("closeEthics")?.addEventListener("click", closeEthicsModal);
  document.getElementById("ackEthics")?.addEventListener("click", closeEthicsModal);
  
  // Open disclaimer modal when app loads
  openEthicsModal();
  
  // Initialize app
  (async function init(){
    await loadDemo();
    setRoute("home");
    await registerSW();
  })();
}

// Initialize when DOM is ready (or immediately if already loaded)
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  // DOM is already loaded
  initApp();
}


function populateSummaryPanels(){
  const t = state.selected;
  const grid = document.getElementById("summaryGrid");
  if(!t || !grid) return;

  const f = t.features || {};
  const rows = [
    { label: "Distance to fire (km)", value: fmt(f["DISTANCE_TO_FIRE_KM"]), micro: "Estimated distance to nearest historical fire perimeter (2022 data). Smaller = closer. Note: This is an approximation based on region."},
    { label: "Wind (km/h)", value: fmt(f["AWND"]), micro: "Max daily wind speed. Higher wind can increase spread potential under dry conditions."},
    { label: "Dryness (ET0 mm)", value: fmt(f["EVAP"]), micro: "Reference evapotranspiration (ET0). Higher values generally indicate drier conditions."},
    { label: "Temp max (°F)", value: fmt(cToF(f["TMAX"]), 1), micro: "Daily maximum temperature (converted from °C). Higher temps can dry fuels faster."},
    { label: "Precip (mm)", value: fmt(f["PRCP"]), micro: "Total daily precipitation. More rain generally reduces short‑term readiness."},
  ];

  const keyInputsHtml = rows.map(r=>`
    <div class="kv">
      <div>
        <div class="k">${r.label}</div>
        <div class="micro">${r.micro}</div>
      </div>
      <div class="v">${r.value}</div>
    </div>
  `).join("");

  const maps = (qq)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(qq)}`;

  grid.innerHTML = `
    <div class="panel">
      <div class="panelHead">Key inputs</div>
      <div class="panelBody">${keyInputsHtml}</div>
    </div>

    <div class="panel">
      <div class="panelHead">Nearby official resources</div>
      <div class="panelBody">
        <div class="small" style="margin-bottom:10px;">Quick links to official resources near you (opens Maps).</div>
        <div style="display:flex; flex-wrap:wrap; gap:10px;">
          <a class="linkbtn" href="${maps("evacuation shelter near me")}" target="_blank" rel="noopener">Evacuation shelters</a>
          <a class="linkbtn" href="${maps("fire station near me")}" target="_blank" rel="noopener">Fire stations</a>
          <a class="linkbtn" href="${maps("hospital near me")}" target="_blank" rel="noopener">Hospitals</a>
        </div>
      </div>
    </div>
  `;
}




// v3.5 helpers
function cToF(c){
  const n = Number(c);
  if(!Number.isFinite(n)) return NaN;
  return (n * 9/5) + 32;
}
function fmt(n, digits=2){
  const x = Number(n);
  return Number.isFinite(x) ? x.toFixed(digits) : "—";
}

document.querySelectorAll('.navbtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});
