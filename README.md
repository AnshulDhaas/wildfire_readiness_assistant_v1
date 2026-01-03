# Wildfire Readiness Assistant — California

A machine learning model and web application for assessing wildfire readiness risk levels in California based on historical fire perimeters, weather data, and geographic proximity.

## Overview

This project provides:
- **Machine Learning Model**: Trained on California 2022 fire season data to predict wildfire readiness risk levels (Low, Moderate, High)
- **Web Application**: Progressive Web App (PWA) for interactive risk assessment
- **REST API**: Flask-based API server for model inference

## Project Structure

```
.
├── ReadinessAssistant_CA_Generalized_WORKING (1).ipynb  # Main Jupyter notebook for data processing and model training
├── models/                                               # Trained model files (exported from notebook)
│   ├── wildfire_readiness_lr_model.joblib              # Logistic Regression model (primary)
│   └── wildfire_readiness_rf_model.joblib              # Random Forest model
├── UI/                                                   # Web application
│   └── wildfire_readiness_pwa_v3_emergency_briefing/
│       ├── api_server.py                                # Flask API server
│       ├── app.js                                       # Frontend JavaScript
│       ├── index.html                                   # Main HTML
│       ├── styles.css                                   # Styling
│       └── sw.js                                        # Service worker (PWA)
├── changes/                                             # Documentation of fixes and changes
└── api_cache/                                           # Cached API data (gitignored)

```

## Features

### Model
- **Primary Model**: Logistic Regression (selected for superior recall and ROC-AUC performance)
- **Features**: Temperature (TMAX), Wind Speed (AWND), Precipitation (PRCP), Evapotranspiration (EVAP), Distance to Fire (DISTANCE_TO_FIRE_KM)
- **Metrics**: Prioritizes recall and ROC-AUC to minimize false negatives (missed dangerous days)
- **Training Data**: California 2022 fire season, tiled into 16 regions

### Web Application
- **Scenario-Based Assessment**: Uses historical, representative data rather than live predictions
- **ZIP Code Input**: Maps California ZIP codes to regional scenarios
- **Risk Levels**: Low, Moderate, High readiness levels with explanations
- **Progressive Web App**: Works offline with service worker caching

## Quick Start

### 1. Model Training (Jupyter Notebook)

1. Open `ReadinessAssistant_CA_Generalized_WORKING (1).ipynb`
2. Run all cells to:
   - Download and process CAL FIRE FRAP fire perimeter data
   - Fetch historical weather data from Open-Meteo
   - Build training dataset
   - Train models (Logistic Regression and Random Forest)
   - Export models to `models/` directory

### 2. API Server Setup

```bash
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
pip install -r requirements.txt
python api_server.py
```

The API will run on `http://localhost:5000`

### 3. Web Application

```bash
cd UI/wildfire_readiness_pwa_v3_emergency_briefing
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

## Model Evaluation

### Metrics Prioritized
- **Recall (Primary)**: Minimizes false negatives—critical for not missing dangerous days
- **ROC-AUC**: Measures ranking quality across all thresholds
- **Precision (Secondary)**: Tracks alert fatigue from false positives

### Model Selection
**Logistic Regression** is the primary model because:
- Superior recall performance
- Strong ROC-AUC scores
- High interpretability (coefficients explain feature importance)
- Stability and reliability for operational deployment

## Geographic Limitations

⚠️ **Critical**: This model is **validated only for California regions** (2022 fire season).

- **Do NOT use** for regions outside California
- Model is trained on California-specific fire patterns, weather, and geography
- Retraining required for other regions
- Even within California, performance may vary by region (coastal vs. inland, northern vs. southern)

**Always follow official emergency directives**: This tool provides readiness guidance only and does not replace official CAL FIRE, county emergency management, or National Weather Service alerts and evacuation orders.

## Data Sources

- **Fire Perimeters**: CAL FIRE FRAP (California Fire and Resource Assessment Program)
- **Weather Data**: Open-Meteo Historical Weather API
- **Training Period**: June 1 - October 31, 2022 (California fire season)

## Requirements

### Python Dependencies
- pandas
- numpy
- scikit-learn
- geopandas
- shapely
- flask
- joblib
- requests

See `UI/wildfire_readiness_pwa_v3_emergency_briefing/requirements.txt` for API server dependencies.

## Documentation

- `changes/`: Documentation of scientific fixes, model integration, and refactoring
- `UI/wildfire_readiness_pwa_v3_emergency_briefing/API_SETUP.md`: API setup instructions
- `UI/wildfire_readiness_pwa_v3_emergency_briefing/SCENARIO_BASED_DESIGN.md`: Design rationale for scenario-based approach

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

