# UI Deployment Guide

The Wildfire Readiness Assistant UI consists of:
- **Frontend**: Progressive Web App (PWA) - static HTML/CSS/JS
- **Backend**: Flask API server for model predictions

## Deployment Options

### Option 1: Simple PaaS Deployment (Recommended for Quick Setup)

**Backend (Flask API):**
- **Railway** (https://railway.app) - Free tier available
- **Render** (https://render.com) - Free tier available
- **Fly.io** (https://fly.io) - Free tier available

**Frontend (Static PWA):**
- **Netlify** (https://netlify.com) - Free tier
- **Vercel** (https://vercel.com) - Free tier
- **GitHub Pages** - Free

### Option 2: Separate Repositories (Recommended for Production)

1. Create a separate repository for the UI (e.g., `wildfire-readiness-ui`)
2. Deploy frontend and backend independently
3. Update API endpoint in `app.js` to point to deployed backend URL

---

## Step-by-Step: Railway + Netlify (Easiest)

### Deploy Backend (Railway)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create Railway project:**
   ```bash
   cd UI/wildfire_readiness_pwa_v3_emergency_briefing
   railway init
   ```

3. **Create `Procfile`** (in the UI folder):
   ```
   web: python api_server.py
   ```

4. **Update `api_server.py`** to use environment variable for port:
   ```python
   if __name__ == "__main__":
       port = int(os.environ.get("PORT", 5000))
       app.run(host="0.0.0.0", port=port)
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Note the backend URL** (e.g., `https://your-app.railway.app`)

### Deploy Frontend (Netlify)

1. **Update `app.js`** to use deployed backend URL:
   ```javascript
   const API_BASE = "https://your-app.railway.app"; // Replace with your Railway URL
   ```

2. **Deploy to Netlify:**
   - Go to https://app.netlify.com
   - Drag and drop the `UI/wildfire_readiness_pwa_v3_emergency_briefing` folder
   - Or connect to a Git repository

3. **Configure build settings** (if using Git):
   - Build command: (leave empty - static site)
   - Publish directory: `UI/wildfire_readiness_pwa_v3_emergency_briefing`

---

## Step-by-Step: Render (Alternative)

### Backend on Render

1. **Create a new Web Service** on Render
2. **Connect your repository** (or create a separate repo for UI)
3. **Settings:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python api_server.py`
   - Environment: Python 3
   - Add environment variable: `PORT=10000` (Render uses port 10000)

4. **Update `api_server.py`**:
   ```python
   if __name__ == "__main__":
       port = int(os.environ.get("PORT", 5000))
       app.run(host="0.0.0.0", port=port)
   ```

5. **Note the backend URL** (e.g., `https://your-app.onrender.com`)

### Frontend on Netlify/Vercel

1. **Create `config.js`** (copy from `config.js.example`):
   ```javascript
   const CONFIG = {
     API_URL: "https://your-backend.onrender.com"  // Your deployed backend URL
   };
   ```

2. **Deploy to Netlify/Vercel:**
   - Drag and drop the folder, or
   - Connect to Git repository
   - Build command: (leave empty - static site)
   - Publish directory: `.` (current directory)

---

## Environment Variables

### Backend (Railway/Render)
- `PORT`: Server port (usually auto-set by platform)
- `FLASK_ENV`: `production` (optional)

### Frontend
- Update `API_BASE` in `app.js` to your deployed backend URL

---

## CORS Configuration

The Flask backend already has CORS enabled. If you deploy to different domains, ensure:

```python
CORS(app, resources={r"/*": {"origins": ["https://your-frontend.netlify.app"]}})
```

Or allow all origins (for development):
```python
CORS(app)  # Already configured
```

---

## Model File Deployment

**Important:** The model file (`wildfire_readiness_rf_model.joblib`) must be accessible to the backend.

**Option 1:** Include in repository (if small enough)
- Add to UI repository
- Update `MODEL_PATH` in `api_server.py` to relative path

**Option 2:** Use cloud storage
- Upload to S3/Google Cloud Storage
- Download on server startup
- Update `api_server.py` to fetch from cloud storage

**Option 3:** Generate on deploy
- Run notebook export cell during deployment
- Save model to expected location

---

## Testing Deployment

1. **Test backend:**
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Test frontend:**
   - Open deployed frontend URL
   - Enter a ZIP code
   - Check browser console for API calls

---

## Troubleshooting

### Backend Issues
- **Model not found:** Ensure model file is in the correct location or uploaded to cloud storage
- **CORS errors:** Check CORS configuration matches frontend domain
- **Port issues:** Use `PORT` environment variable, not hardcoded 5000

### Frontend Issues
- **API calls failing:** Update `API_BASE` in `app.js` to correct backend URL
- **Service worker issues:** Clear browser cache and re-register service worker
- **HTTPS required:** PWAs require HTTPS in production (Netlify/Vercel provide this automatically)

---

## Quick Local Test Before Deploying

```bash
# Terminal 1: Start backend
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
python api_server.py

# Terminal 2: Start frontend server
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
python -m http.server 8080

# Open http://localhost:8080
```

