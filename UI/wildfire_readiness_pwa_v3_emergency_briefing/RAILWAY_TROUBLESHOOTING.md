# Railway Build Plan Error - Troubleshooting

## Quick Fix Options

### Option 1: Use Railway Web UI Settings (Easiest)

1. **Go to Railway Dashboard** → Your Project → Your Service
2. **Settings Tab** → **Deploy**
3. **Set these manually:**
   - **Root Directory:** `UI/wildfire_readiness_pwa_v3_emergency_briefing`
   - **Start Command:** `gunicorn api_server:app --bind 0.0.0.0:$PORT`
   - **Build Command:** (leave empty, or set to `pip install -r requirements.txt`)

4. **Save and Redeploy**

### Option 2: Remove railway.json (If causing conflicts)

Railway should auto-detect from `Procfile`. If `railway.json` is causing issues:

1. Delete `railway.json` from the repo
2. Railway will use `Procfile` instead
3. Redeploy

### Option 3: Use nixpacks.toml

If Railway still has issues, we've added `nixpacks.toml` as an alternative configuration.

### Option 4: Manual Build Command

In Railway Settings → Deploy:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn api_server:app --bind 0.0.0.0:$PORT`

## Verify Root Directory

**CRITICAL:** Make sure Railway knows where your files are:

1. Railway Dashboard → Settings
2. **Root Directory** must be: `UI/wildfire_readiness_pwa_v3_emergency_briefing`
3. NOT just `UI/` or root `/`

## Check These Files Exist

In the root directory (`UI/wildfire_readiness_pwa_v3_emergency_briefing/`):
- ✅ `api_server.py` (Flask app)
- ✅ `requirements.txt` (dependencies)
- ✅ `Procfile` (start command)
- ✅ Model file (in `models/` folder or accessible)

## Common Errors

**"No start command found"**
→ Set Start Command manually in Railway Settings

**"Module not found"**
→ Check Root Directory is correct
→ Check requirements.txt includes all dependencies

**"Model file not found"**
→ Ensure model file is in the repo or uploaded separately
→ Check MODEL_PATH in api_server.py

## Alternative: Use Render Instead

If Railway continues to have issues, Render is simpler:

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory:** `UI/wildfire_readiness_pwa_v3_emergency_briefing`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn api_server:app --bind 0.0.0.0:$PORT`
5. Deploy

