# Railway Deployment Fix

## Issue
Railway's Railpack couldn't find a start command.

## Solution
Updated files for Railway deployment:

1. **Procfile** - Now uses gunicorn (production WSGI server)
2. **requirements.txt** - Added gunicorn
3. **railway.json** - Added explicit Railway configuration

## What Changed

### Procfile
```
web: gunicorn api_server:app --bind 0.0.0.0:$PORT
```

### requirements.txt
Added: `gunicorn>=20.1.0`

## Railway Settings

If Railway still doesn't detect the start command:

1. Go to your Railway project → Settings
2. Under "Deploy", set:
   - **Start Command:** `gunicorn api_server:app --bind 0.0.0.0:$PORT`
   - Or leave empty to use Procfile

3. Ensure **Root Directory** is set to: `UI/wildfire_readiness_pwa_v3_emergency_briefing`

## Verify

After deployment, test:
- `https://your-app.railway.app/health` should return `{"status": "healthy"}`

