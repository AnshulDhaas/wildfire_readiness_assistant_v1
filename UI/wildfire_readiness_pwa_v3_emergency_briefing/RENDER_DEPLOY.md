# Render Deployment Guide

This guide explains how to deploy the Wildfire Readiness Assistant to Render.

## Quick Deploy

1. **Push to GitHub**: Ensure this folder is in a Git repository and pushed to GitHub.

2. **Create a New Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the branch to deploy

3. **Configure the Service**:
   - **Name**: `wildfire-readiness-assistant` (or your choice)
   - **Root Directory**: Set to the path of this folder (e.g., `UI/wildfire_readiness_pwa_v3_emergency_briefing`)
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api_server:app --bind 0.0.0.0:$PORT`

4. **Environment Variables** (optional):
   - `FLASK_ENV`: `production`
   - `PYTHON_VERSION`: `3.11.0`

5. **Deploy**: Click "Create Web Service"

## Files Required for Deployment

- `api_server.py` - Flask backend server (also serves static frontend)
- `requirements.txt` - Python dependencies
- `Procfile` - Process configuration for gunicorn
- `render.yaml` - Render service configuration
- `models/` - Trained ML models
  - `wildfire_readiness_rf_model.joblib`
  - `wildfire_readiness_lr_model.joblib`
- Frontend files: `index.html`, `app.js`, `styles.css`, etc.

## Configuration

The `config.js` file configures the API URL:
- For Render (frontend + backend same server): `API_URL: ""`
- For local development: `API_URL: "http://localhost:5000"`

## Local Testing

Before deploying, test locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python api_server.py

# Or with gunicorn (mimics Render)
gunicorn api_server:app --bind 0.0.0.0:5000
```

Then open http://localhost:5000 in your browser.

## Troubleshooting

### Model not found
Ensure the `models/` folder contains the `.joblib` model files.

### Static files not loading
The Flask server serves static files from the same directory. Ensure all frontend files are in the root directory.

### API errors
Check the Render logs for error messages. Common issues:
- Missing dependencies in `requirements.txt`
- Model file path issues
