# 🚀 Deploy Your UI Publicly - Start Here!

**Goal:** Make your Wildfire Readiness Assistant accessible to anyone on the internet.

**Time:** ~15 minutes

**Cost:** FREE (using free tiers)

---

## 📋 What You'll Do

1. **Deploy Backend** (Railway) - Handles predictions
2. **Deploy Frontend** (Netlify) - The web interface
3. **Connect them** - Update config.js with backend URL
4. **Share your link** - Anyone can now use it!

---

## ⚡ Quick Start (3 Steps)

### Step 1: Prepare Model File

```powershell
# Run this in PowerShell from your project root
New-Item -ItemType Directory -Force -Path "UI\wildfire_readiness_pwa_v3_emergency_briefing\models"
Copy-Item "models\wildfire_readiness_rf_model.joblib" "UI\wildfire_readiness_pwa_v3_emergency_briefing\models\"
```

✅ Done! Model is now in the UI folder.

---

### Step 2: Deploy Backend (Railway)

1. **Go to:** https://railway.app
2. **Sign up** with GitHub (free)
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select your repo** (or create a new one for UI)
5. **Settings:**
   - Root Directory: `UI/wildfire_readiness_pwa_v3_emergency_briefing`
   - Railway auto-detects Python and deploys
6. **Wait 2-3 minutes** for deployment
7. **Copy your URL:** `https://your-app-name.railway.app`
   - Find it in: Project → Settings → Domains

✅ Backend is live! Test it: `https://your-app-name.railway.app/health`

---

### Step 3: Deploy Frontend (Netlify)

1. **Create config.js:**
   - In `UI/wildfire_readiness_pwa_v3_emergency_briefing/` folder
   - Create file `config.js`:
   ```javascript
   const CONFIG = {
     API_URL: "https://your-app-name.railway.app"  // Paste YOUR Railway URL here
   };
   ```

2. **Go to:** https://app.netlify.com
3. **Sign up** with GitHub (free)
4. **Drag & Drop:**
   - Go to: https://app.netlify.com/drop
   - Drag the entire `UI/wildfire_readiness_pwa_v3_emergency_briefing` folder
   - Wait 30 seconds
5. **Get your URL:** `https://random-name-123.netlify.app`

✅ Frontend is live! **This is your public URL - share it with anyone!**

---

## 🎉 You're Done!

**Your app is now public at:** `https://your-netlify-url.netlify.app`

### Test It:
1. Open your Netlify URL
2. Enter ZIP code: `95060`
3. Click "Run assessment"
4. Should see predictions!

---

## 📚 Need More Help?

- **Detailed guide:** See `PUBLIC_DEPLOYMENT.md`
- **Troubleshooting:** See `PUBLIC_DEPLOYMENT.md` → Troubleshooting section
- **Setup help:** See `SETUP_FOR_DEPLOYMENT.md`

---

## 🆘 Common Issues

**"Model file not found"**
→ Make sure you copied the model file in Step 1

**"Failed to fetch"**
→ Check that `config.js` has the correct Railway URL (with https://)

**"CORS error"**
→ Backend should handle this automatically, but check Railway logs

---

## 💡 Pro Tips

- **Custom domain:** Netlify lets you add your own domain (free)
- **Auto-deploy:** Connect to GitHub for automatic updates
- **Monitor:** Check Railway/Netlify dashboards for usage stats

**Your app is now accessible to the entire world! 🌍**

