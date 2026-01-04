# Model Verification Guide

## How to Verify the Server is Using the Model

### 1. Check Server Startup Messages

When you start the API server, you should see:
```
✓ Model loaded from: [path to model file]
✓ Model type: RandomForestClassifier
✓ Features expected: ['TMAX', 'AWND', 'PRCP', 'EVAP', 'DISTANCE_TO_FIRE_KM']
✓ Model is ready for predictions!
```

### 2. Check the Health Endpoint

Visit `http://localhost:5000/health` in your browser or use curl:
```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_type": "RandomForestClassifier",
  "model_path": "[path to model]",
  "features": ["TMAX", "AWND", "PRCP", "EVAP", "DISTANCE_TO_FIRE_KM"]
}
```

### 3. Check Server Console Logs

When a prediction is made, you'll see in the server console:
```
[PREDICTION] Making prediction with features: {...}
[PREDICTION] Result: risk_level=0, p_elevated=0.1234
```

### 4. Check Browser Console

In the browser's developer console (F12), you'll see:
```
[API] Making prediction request with features: {...}
[API] Prediction received from model: {...}
```

## Changes Made

### API Server (`api_server.py`)

1. **Added Model Verification Logging**:
   - Shows model type on startup
   - Logs every prediction request and result
   - Health endpoint now includes model information

2. **Removed Demo Data Dependencies**:
   - `/tiles` endpoint now clearly states predictions require `/predict` with real features
   - Removed references to "demo" predictions

3. **Enhanced Error Messages**:
   - Clear messages when model is not found
   - Detailed logging for debugging

### Frontend (`app.js`)

1. **Forced API Usage**:
   - Removed fallback to demo data
   - All predictions must come from the API/model
   - Shows error if API is unavailable

2. **Removed "Demo" References**:
   - Updated UI text to remove "demo" language
   - Clarified that predictions use the trained model

3. **Added Console Logging**:
   - Logs API requests and responses
   - Helps verify model is being called

## Testing the Model

### Test Prediction Request

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TMAX": 30.0,
    "AWND": 15.0,
    "PRCP": 0.0,
    "EVAP": 4.0,
    "DISTANCE_TO_FIRE_KM": 25.0
  }'
```

Expected response:
```json
{
  "p_elevated": 0.1234,
  "risk_level": 0,
  "confidence": "Low",
  "features": {
    "TMAX": 30.0,
    "AWND": 15.0,
    "PRCP": 0.0,
    "EVAP": 4.0,
    "DISTANCE_TO_FIRE_KM": 25.0
  },
  "why": ["...", "..."]
}
```

## Important Notes

- **No Demo Data**: The system no longer falls back to demo/pilot data. All predictions come from the trained model.
- **Model Required**: The model file must exist at `models/wildfire_readiness_rf_model.joblib` (relative to project root).
- **API Must Be Running**: The UI requires the API server to be running. It will show an error if the API is unavailable.

