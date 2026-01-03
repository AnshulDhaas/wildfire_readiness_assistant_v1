# Model-UI Integration Summary

The wildfire readiness model has been successfully connected to the UI. Here's what was set up:

## What Was Added

### 1. Model Export Cell (Notebook)
- Added a new cell in the notebook to export the trained Random Forest model
- Saves the model to `models/wildfire_readiness_rf_model.joblib`
- Location: Cell after model training

### 2. API Server (`UI/wildfire_readiness_pwa_v3_emergency_briefing/api_server.py`)
- Flask-based REST API server
- Endpoints:
  - `POST /predict` - Makes predictions using the trained model
  - `GET /health` - Health check
- Includes CORS support for the frontend
- Generates human-readable explanations for predictions

### 3. UI Updates (`UI/wildfire_readiness_pwa_v3_emergency_briefing/app.js`)
- Added API integration functions
- When "Run assessment" is clicked, the UI calls the API with tile feature values
- Falls back to demo data if API is unavailable
- Updated to use real predictions from the trained model

### 4. Documentation
- `API_SETUP.md` - Complete setup and usage instructions
- `requirements.txt` - Python dependencies for the API server
- Updated `README.txt` - Quick start guide

## How It Works

1. **Model Training**: Train the model in the notebook
2. **Model Export**: Run the export cell to save the model
3. **Start API**: Run `python api_server.py` in the UI folder
4. **Start UI**: Serve the UI using a web server (e.g., `python -m http.server 8080`)
5. **Use the App**: 
   - Select a tile in the UI
   - Click "Run assessment"
   - The UI calls the API with the tile's feature values
   - The API uses the trained model to predict risk
   - Results are displayed in the UI

## File Structure

```
Notebooks/
├── models/
│   └── wildfire_readiness_rf_model.joblib  (created by export cell)
├── ReadinessAssistant_CA_Generalized_WORKING (1).ipynb
└── UI/
    └── wildfire_readiness_pwa_v3_emergency_briefing/
        ├── api_server.py           (NEW - API server)
        ├── app.js                  (UPDATED - API integration)
        ├── requirements.txt        (NEW - dependencies)
        ├── API_SETUP.md            (NEW - setup guide)
        ├── README.txt              (UPDATED - quick start)
        ├── index.html
        ├── styles.css
        └── data/
            └── demo_tiles.json
```

## Next Steps

1. **Run the export cell** in the notebook to create the model file
2. **Install API dependencies**: `pip install -r UI/wildfire_readiness_pwa_v3_emergency_briefing/requirements.txt`
3. **Start the API server**: `cd UI/wildfire_readiness_pwa_v3_emergency_briefing && python api_server.py`
4. **Start the UI server**: `cd UI/wildfire_readiness_pwa_v3_emergency_briefing && python -m http.server 8080`
5. **Open the UI**: Navigate to `http://localhost:8080` in your browser

## Testing

To test the integration:

1. Verify the model file exists: `models/wildfire_readiness_rf_model.joblib`
2. Start the API server and check: `curl http://localhost:5000/health`
3. Test a prediction:
   ```bash
   curl -X POST http://localhost:5000/predict \
     -H "Content-Type: application/json" \
     -d '{"TMAX":32.0,"AWND":25.0,"PRCP":0.5,"EVAP":5.0,"DISTANCE_TO_FIRE_KM":8.0}'
   ```
4. Open the UI and select a tile, then click "Run assessment"

## Troubleshooting

- **Model file not found**: Make sure you've run the export cell in the notebook
- **API connection errors**: Ensure the API server is running on port 5000
- **CORS errors**: Make sure you're accessing the UI via a web server (not file://)
- **Import errors**: Install requirements: `pip install -r requirements.txt`

See `UI/wildfire_readiness_pwa_v3_emergency_briefing/API_SETUP.md` for detailed troubleshooting.

