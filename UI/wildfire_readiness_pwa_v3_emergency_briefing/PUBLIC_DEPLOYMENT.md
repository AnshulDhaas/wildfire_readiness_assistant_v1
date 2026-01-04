# Public Deployment Guide - Make Your UI Accessible to Everyone

This guide will help you deploy your Wildfire Readiness Assistant so anyone on the internet can use it.

## Overview

You need to deploy TWO things:
1. **Backend (API Server)** - Handles model predictions
2. **Frontend (Web App)** - The user interface

Both will get public URLs that anyone can access.

---

## Step 1: Prepare the Model File

First, ensure your model file is accessible. The backend needs `wildfire_readiness_rf_model.joblib`.

**Option A: Copy model to UI folder (Easiest)**
```bash
# From your project root
cp models/wildfire_readiness_rf_model.joblib UI/wildfire_readiness_pwa_v3_emergency_briefing/models/
```

Then update `api_server.py` line 24 to:
```python
MODEL_PATH = SCRIPT_DIR / "models" / "wildfire_readiness_rf_model.joblib"
```

**Option B: Keep relative path**
- Ensure the model is in `models/` folder relative to where you deploy
- The current path should work if you deploy from project root

---

## Step 2: Deploy Backend (Railway - Recommended)

Railway is free and easy. Follow these steps:

### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (easiest)

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
   - If your UI is in a separate repo, create one first
   - Or select your main repo and set the root directory

### 2.3 Configure Deployment
1. **If deploying from main repo:**
   - Click on your project
   - Go to Settings → Root Directory
   - Set to: `UI/wildfire_readiness_pwa_v3_emergency_briefing`
   - Save

2. **Add Environment Variables (if needed):**
   - Go to Variables tab
   - Add: `PORT=5000` (Railway auto-sets this, but you can specify)
   - Add: `FLASK_ENV=production`

3. **Deploy:**
   - Railway will auto-detect Python
   - It will run `pip install -r requirements.txt` automatically
   - Then start `api_server.py` (you have a Procfile, so it will use that)

### 2.4 Get Your Backend URL
1. After deployment, click on your service
2. Go to Settings → Domains
3. Railway gives you a URL like: `https://your-app-name.railway.app`
4. **Copy this URL** - you'll need it for the frontend

### 2.5 Test Backend
Open in browser: `https://your-app-name.railway.app/health`
Should see: `{"status": "healthy"}`

---

## Step 3: Deploy Frontend (Netlify - Recommended)

Netlify is free and perfect for static sites.

### 3.1 Create Netlify Account
1. Go to https://app.netlify.com
2. Sign up with GitHub

### 3.2 Create config.js
1. In `UI/wildfire_readiness_pwa_v3_emergency_briefing/` folder
2. Create file `config.js` (copy from `config.js.example`):
   ```javascript
   const CONFIG = {
     API_URL: "https://your-app-name.railway.app"  // Replace with YOUR Railway URL from Step 2
   };
   ```

### 3.3 Deploy to Netlify

**Option A: Drag & Drop (Fastest)**
1. Go to https://app.netlify.com/drop
2. Drag the entire `UI/wildfire_readiness_pwa_v3_emergency_briefing` folder
3. Wait for deployment
4. Netlify gives you a URL like: `https://random-name-123.netlify.app`

**Option B: Deploy from Git**
1. In Netlify, click "Add new site" → "Import an existing project"
2. Connect to GitHub
3. Select your repository
4. Build settings:
   - **Base directory:** `UI/wildfire_readiness_pwa_v3_emergency_briefing`
   - **Build command:** (leave empty - it's a static site)
   - **Publish directory:** `UI/wildfire_readiness_pwa_v3_emergency_briefing`
5. Click "Deploy site"

### 3.4 Get Your Frontend URL
1. After deployment, you'll see your site URL
2. It will be something like: `https://your-site-name.netlify.app`
3. **This is your public URL!** Share this with anyone.

### 3.5 Custom Domain (Optional)
1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (if you have one)

---

## Step 4: Test Everything

1. **Open your Netlify URL** in a browser
2. **Enter a ZIP code** (e.g., 95060 for Santa Cruz)
3. **Click "Run assessment"**
4. **Check browser console** (F12) - should see API calls to your Railway backend
5. **Verify predictions work** - you should see risk levels and explanations

---

## Alternative: Render (All-in-One)

If you prefer one platform for both:

### Deploy Backend on Render
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Name:** wildfire-readiness-api
   - **Environment:** Python 3
   - **Build Command:** `cd UI/wildfire_readiness_pwa_v3_emergency_briefing && pip install -r requirements.txt`
   - **Start Command:** `cd UI/wildfire_readiness_pwa_v3_emergency_briefing && python api_server.py`
   - **Root Directory:** `UI/wildfire_readiness_pwa_v3_emergency_briefing`
5. Deploy → Copy URL

### Deploy Frontend on Render
1. New → Static Site
2. Connect GitHub repo
3. Settings:
   - **Build Command:** (leave empty)
   - **Publish Directory:** `UI/wildfire_readiness_pwa_v3_emergency_briefing`
4. Create `config.js` with Render backend URL
5. Deploy

---

## Troubleshooting

### Backend Issues

**"Model file not found"**
- Ensure model file is in the correct location
- Check the path in `api_server.py`
- Upload model file to your repository

**"CORS error"**
- Backend already has CORS enabled
- If issues persist, check that backend URL in `config.js` matches exactly

**"Port already in use"**
- Railway/Render handle ports automatically
- Don't hardcode port 5000 in production

### Frontend Issues

**"Failed to fetch" or "Network error"**
- Check `config.js` has correct backend URL
- Ensure backend is deployed and running
- Check browser console for exact error

**"API calls going to localhost"**
- `config.js` not loading - check it exists in deployed folder
- Clear browser cache
- Check Netlify deployment logs

### General Issues

**Changes not showing up**
- Clear browser cache (Ctrl+Shift+R)
- Check deployment logs on Railway/Netlify
- Verify files are committed to Git (if using Git deployment)

---

## Cost

**All options above are FREE:**
- Railway: Free tier (500 hours/month)
- Netlify: Free tier (100GB bandwidth/month)
- Render: Free tier (750 hours/month)

Perfect for personal projects and demos!

---

## Security Notes

- Your backend URL is public (anyone can see it in browser console)
- This is fine for a demo/portfolio project
- For production, consider:
  - API rate limiting
  - Authentication (if needed)
  - Input validation (already in place)

---

## Next Steps

Once deployed:
1. ✅ Test with multiple ZIP codes
2. ✅ Share your Netlify URL with others
3. ✅ Add to your portfolio/resume
4. ✅ Monitor Railway/Netlify dashboards for usage

**Your app is now live and accessible to anyone on the internet!** 🎉

