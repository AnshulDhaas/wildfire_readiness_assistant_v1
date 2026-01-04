# Railway "No Start Command" Fix

## Immediate Solution: Set Start Command Manually

Railway isn't detecting the Procfile. Set it manually:

### Steps:

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard
   - Select your project
   - Select your service

2. **Open Settings**
   - Click on "Settings" tab
   - Scroll to "Deploy" section

3. **Set Start Command**
   - Find "Start Command" field
   - Enter exactly:
     ```
     gunicorn api_server:app --bind 0.0.0.0:$PORT
     ```

4. **Verify Root Directory**
   - In same Settings page
   - "Root Directory" should be:
     ```
     UI/wildfire_readiness_pwa_v3_emergency_briefing
     ```

5. **Save and Redeploy**
   - Click "Save" or "Redeploy"
   - Wait for deployment

## Alternative Start Commands (if above doesn't work)

Try these one at a time:

**Option 1:**
```
python -m gunicorn api_server:app --bind 0.0.0.0:$PORT
```

**Option 2:**
```
gunicorn --bind 0.0.0.0:$PORT api_server:app
```

**Option 3:**
```
python api_server.py
```
(Note: This uses Flask dev server, not recommended for production but works for testing)

## Verify Deployment

After setting start command and redeploying:

1. Check Railway logs - should see Flask app starting
2. Test endpoint: `https://your-app.railway.app/health`
3. Should return: `{"status": "healthy"}`

## Why This Happens

Railway's Railpack sometimes doesn't detect Procfile if:
- Root directory isn't set correctly
- Procfile has encoding issues
- Railway is using a different build system

Setting it manually in the UI always works!

