# Wildfire Readiness Assistant (UI demo) — Emergency Briefing Theme (v3)

This version matches the earlier mock's color feel:
- Dark header
- Orange primary button
- Readiness card gradient (green/orange/red)
- 3-level readiness thresholds: Low < 0.35, Moderate 0.35–0.75, High >= 0.75

## Quick Start

### 1. Export the Model
First, run the "Export model for UI integration" cell in the notebook to create the model file.

### 2. Start the API Server
```bash
pip install -r requirements.txt
python api_server.py
```
The API will run on http://localhost:5000

### 3. Start the UI
Use a local web server (so fetch() + the PWA service worker work):

#### Python
1) Open Command Prompt
2) cd into this folder
3) Run:
   python -m http.server 8080
4) Open:
   http://localhost:8080

#### VS Code Live Server
- Install 'Live Server' extension
- Right click index.html -> Open with Live Server

## API Integration

The UI is now connected to the trained model via the API server. When you select a tile and click "Run assessment", it will:
1. Extract feature values from the selected tile
2. Call the API to get predictions from the trained model
3. Display the results with explanations

See `API_SETUP.md` for detailed setup instructions.
