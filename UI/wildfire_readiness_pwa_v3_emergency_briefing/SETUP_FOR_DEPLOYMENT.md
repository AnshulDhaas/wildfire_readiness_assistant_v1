# Quick Setup Before Public Deployment

Follow these steps to prepare your UI for public deployment.

## 1. Copy Model File to UI Folder

The backend needs the model file. Copy it to the UI folder:

```bash
# From your project root directory
mkdir -p UI/wildfire_readiness_pwa_v3_emergency_briefing/models
cp models/wildfire_readiness_rf_model.joblib UI/wildfire_readiness_pwa_v3_emergency_briefing/models/
```

**Or on Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path "UI\wildfire_readiness_pwa_v3_emergency_briefing\models"
Copy-Item "models\wildfire_readiness_rf_model.joblib" "UI\wildfire_readiness_pwa_v3_emergency_briefing\models\"
```

## 2. Verify Files Are Ready

Check that these files exist in `UI/wildfire_readiness_pwa_v3_emergency_briefing/`:
- ✅ `api_server.py`
- ✅ `requirements.txt`
- ✅ `Procfile`
- ✅ `index.html`
- ✅ `app.js`
- ✅ `styles.css`
- ✅ `sw.js`
- ✅ `models/wildfire_readiness_rf_model.joblib` (the model file)

## 3. Create config.js Template

The `config.js.example` file is already there. You'll create `config.js` after deploying the backend (see PUBLIC_DEPLOYMENT.md).

## 4. Test Locally First (Optional but Recommended)

```bash
# Terminal 1: Start backend
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
python api_server.py

# Terminal 2: Start frontend
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
python -m http.server 8080

# Open http://localhost:8080 in browser
# Enter ZIP code 95060 and test
```

If this works locally, deployment will work too!

## 5. Ready to Deploy!

Now follow the **PUBLIC_DEPLOYMENT.md** guide to deploy to Railway + Netlify.

---

## Quick Checklist

- [ ] Model file copied to `UI/.../models/` folder
- [ ] All files present in UI folder
- [ ] Tested locally (optional)
- [ ] Ready to follow PUBLIC_DEPLOYMENT.md

