# Wildfire Readiness Assistant

The Wildfire Readiness Assistant is a machine learning tool designed to help communities assess their preparedness for wildfire events. This project addresses public safety issues by providing data-driven readiness assessments that help individuals and communities understand whether conditions may require increased awareness or preparation. The tool focuses on supporting informed decision-making, NOT TO REPLACE OFFICIAL EMERGENCY DIRECTIONS.

## Pilot Region and Scope

The implementation begins as a **Santa Cruz pilot** for the **2022 fire season** (June 1 - October 31). Santa Cruz was chosen as the pilot region because it represents a high-risk area with documented fire activity during the 2022 season, allowing for validation of the modeling approach with real historical data. This focused scope enables rigorous scientific validation before scaling to broader geographic coverage. The model was then expanded with tiled data covering California. NOTE: These models should not be applicable/representative of regions outside of California and Santa Cruz. 

## How the Model Works

The model is trained on combined historical fire perimeter data with daily weather conditions to assess wildfire readiness risk. It takes five key inputs: maximum daily temperature, wind speed, precipitation, evapotranspiration (a measure of how dry conditions are), and distance to the nearest historical fire perimeter. Using a logistic regression model trained on 2022 California fire season data, the tool outputs a probability that indicates whether readiness should be elevated. The model categorizes days into three risk levels: Low, Moderate, and High readiness, helping users understand when conditions may warrant increased preparedness. These are determined by probability thresholds:
- Low: < 0.35
- Moderate: 0.35 - 0.75
- High: >= 0.75

## Evaluation Philosophy

**Recall is the primary evaluation metric** for this model. In the context of wildfire readiness, a false negative—failing to flag a day that is actually elevated risk—is far more costly than a false positive—raising an alert when conditions are less dangerous. Missing a dangerous day could leave people unprepared when they should be taking readiness actions. Accuracy and ROC-AUC are secondary metrics: accuracy can be misleading when most days are low-risk (class imbalance), and while ROC-AUC helps compare model ranking quality, recall directly verifies whether or not we catch a dangerous day.

## Responsible Use and Limitations

This tool is designed to **support readiness and situational awareness**. It does **not** issue evacuation orders, replace official emergency directives, or make real-time predictions. The model is validated only for the Santa Cruz pilot region and the 2022 fire season. It has not been validated for other regions, time periods, or for use outside California. Users should always follow official directives from CAL FIRE, county emergency management, and the National Weather Service. This tool provides supplementary readiness guidance only.

## Statewide California Coverage

The Santa Cruz pilot approach was elevated to statewide California coverage by dividing the state into tiled bounding boxes with 16 regions. Each tile is be processed independently to collect fire perimeter and weather data, then combined into a unified training dataset. This tiled approach respects API rate limits, enables region-aware evaluation, and allows for per-tile performance assessment to identify areas where the model may need additional calibration.

## How to Run the Notebook

1. Install dependencies: `pip install -r requirements.txt`
2. Open `readinessAssistantModel.ipynb` in Jupyter
3. Run all cells sequentially
4. The notebook will download data, train models, and generate results

Data is fetched programmatically from public APIs at runtime. No pre-downloaded datasets are required.
