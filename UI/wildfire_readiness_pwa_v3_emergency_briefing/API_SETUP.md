# API Setup for Wildfire Readiness UI

This guide explains how to connect the trained model to the UI.

## Prerequisites

1. **Export the model** from the notebook:
   - Run the "Export model for UI integration" cell in the notebook
   - This creates `models/wildfire_readiness_rf_model.joblib` in the project root

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API Server

1. **Start the API server**:
   ```bash
   python api_server.py
   ```
   
   The server will start on `http://localhost:5000`

2. **Verify it's working**:
   ```bash
   curl http://localhost:5000/health
   ```

## Running the UI

1. **Start a web server** (the UI needs to be served, not opened as a file):
   
   Using Python:
   ```bash
   python -m http.server 8080
   ```
   
   Or using VS Code Live Server extension.

2. **Open the UI**:
   Navigate to `http://localhost:8080` in your browser

## API Endpoints

### POST /predict
Make a prediction with weather/fire data.

**Request body**:
```json
{
  "TMAX": 32.0,
  "AWND": 25.0,
  "PRCP": 0.5,
  "EVAP": 5.0,
  "DISTANCE_TO_FIRE_KM": 8.0
}
```

**Response**:
```json
{
  "p_elevated": 0.75,
  "risk_level": 1,
  "confidence": "High",
  "features": {
    "TMAX": 32.0,
    "AWND": 25.0,
    "PRCP": 0.5,
    "EVAP": 5.0,
    "DISTANCE_TO_FIRE_KM": 8.0
  },
  "why": [
    "Distance to historical fire perimeters is very close.",
    "Winds are elevated, which can increase spread potential under dry conditions.",
    "Dryness is high and precipitation is low, creating favorable conditions for fire spread."
  ]
}
```

### GET /health
Health check endpoint.

## How It Works

1. The UI loads demo tile data from `data/demo_tiles.json`
2. When a user selects a tile and clicks "Run assessment":
   - The UI extracts feature values from the selected tile
   - It calls the `/predict` API endpoint with those features
   - The API uses the trained Random Forest model to make a prediction
   - The UI updates the display with the API response

## Troubleshooting

**"Model file not found" error**:
- Make sure you've run the model export cell in the notebook
- Check that `models/wildfire_readiness_rf_model.joblib` exists in the project root (two levels up from the UI folder)

**CORS errors in browser**:
- The API server has CORS enabled, but make sure you're accessing the UI through a web server (not `file://`)
- Both API (port 5000) and UI (port 8080) should be running

**API connection refused**:
- Make sure the API server is running (`python api_server.py`)
- Check that port 5000 is not in use by another application
- Verify the API_URL in `app.js` matches your setup

