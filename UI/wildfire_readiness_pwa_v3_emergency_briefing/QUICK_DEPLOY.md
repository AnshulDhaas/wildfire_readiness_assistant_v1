# Quick Deployment Guide

## Fastest Path: Railway (Backend) + Netlify (Frontend)

### 1. Deploy Backend (5 minutes)

**Option A: Railway CLI**
```bash
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option B: Railway Web UI**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository (or create a new one for UI)
4. Set root directory to `UI/wildfire_readiness_pwa_v3_emergency_briefing`
5. Railway auto-detects Python and runs `api_server.py`
6. Copy the deployed URL (e.g., `https://your-app.railway.app`)

### 2. Deploy Frontend (3 minutes)

1. **Create `config.js`** in the UI folder:
   ```javascript
   const CONFIG = {
     API_URL: "https://your-app.railway.app"  // Replace with your Railway URL
   };
   ```

2. **Deploy to Netlify:**
   - Go to https://app.netlify.com
   - Drag and drop the `UI/wildfire_readiness_pwa_v3_emergency_briefing` folder
   - Done! Netlify gives you a URL like `https://your-app.netlify.app`

### 3. Test

1. Open your Netlify URL
2. Enter a ZIP code (e.g., 95060)
3. Check browser console - should see API calls to your Railway backend

---

## Alternative: Render (Free Tier)

### Backend on Render

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo (or create new repo for UI)
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python api_server.py`
   - **Environment:** Python 3
5. Deploy → Copy URL

### Frontend on Netlify

Same as above - create `config.js` with Render URL.

---

## Important Notes

- **Model File:** Ensure `models/wildfire_readiness_rf_model.joblib` exists in the backend directory or is accessible
- **CORS:** Already configured in `api_server.py` to allow all origins
- **HTTPS:** Required for PWAs - Netlify/Vercel provide this automatically

---

## Troubleshooting

**Backend won't start:**
- Check that model file exists at expected path
- Check Railway/Render logs for errors
- Verify `requirements.txt` includes all dependencies

**Frontend can't reach backend:**
- Verify `config.js` has correct backend URL
- Check CORS settings in backend
- Ensure backend URL uses HTTPS (not HTTP) if frontend is HTTPS

**Model not found:**
- Upload model file to backend directory
- Or update `MODEL_PATH` in `api_server.py` to fetch from cloud storage

