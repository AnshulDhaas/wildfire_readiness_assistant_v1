# Wildfire Readiness Assistant

The Wildfire Readiness Assistant is a machine learning tool designed to help communities assess their preparedness for wildfire events. This project addresses public safety issues by providing data-driven readiness assessments that help individuals and communities understand whether conditions may require increased awareness or preparation. The tool focuses on supporting informed decision-making and does **not** replace official emergency directions.

## Pilot Region and Scope

The implementation begins as a **Santa Cruz pilot** for the **2022 fire season** (June 1 – October 31). Santa Cruz was selected as the pilot region because it represents a high-risk area with documented fire activity during the 2022 season, allowing for **pilot testing** of the modeling approach using real historical fire and weather conditions. This focused scope supports structured testing and iteration before scaling to broader geographic coverage.

The model was later expanded using tiled data across California. **Results and thresholds from this pilot should not be assumed to generalize outside Santa Cruz without additional calibration and testing.**

## How the Model Works

The model is trained on combined historical fire perimeter data with daily weather conditions to assess wildfire readiness risk. It takes five key inputs:

- Maximum daily temperature  
- Wind speed  
- Precipitation  
- Evapotranspiration (a measure of how dry conditions are)  
- Distance to the nearest historical fire perimeter  

Using a logistic regression model trained on 2022 California fire season data, the tool outputs a probability that indicates whether readiness should be elevated.

The model categorizes days into three readiness levels: **Low**, **Moderate**, and **High**. These are determined by probability thresholds:

- **Low (p < 0.25):** Normal activity; stay informed  
- **Moderate (0.25 ≤ p < 0.45):** Pack go-bag; review evacuation routes  
- **High (p ≥ 0.45):** Prepare to evacuate if advised by officials  

## Evaluation Philosophy

**Recall is the primary evaluation metric** for this model. In the context of wildfire readiness, a false negative—failing to flag a day that is actually elevated risk—is far more costly than a false positive—raising an alert when conditions are less dangerous. Missing a dangerous day could leave people unprepared when they should be taking readiness actions.

Accuracy and ROC-AUC are secondary metrics: accuracy can be misleading when most days are low-risk (class imbalance), and while ROC-AUC helps compare model ranking quality, recall directly verifies whether or not we catch dangerous days.

## Responsible Use and Limitations

This tool is designed to **support readiness and situational awareness**. It does **not** issue evacuation orders, replace official emergency directives, or make real-time predictions.

The model has been **pilot-tested** for the Santa Cruz region during the 2022 fire season. It has not been fully validated for other regions, time periods, or for use outside California. Users should always follow official directives from CAL FIRE, county emergency management, and the National Weather Service. This tool provides supplementary readiness guidance only.

## Statewide California Coverage

The Santa Cruz pilot approach was expanded to statewide California coverage by dividing the state into tiled bounding boxes with 16 regions. Each tile is processed independently to collect fire perimeter and weather data, then combined into a unified training dataset. This tiled approach respects API rate limits, enables region-aware evaluation, and allows for per-tile performance assessment to identify areas where the model may need additional calibration.

## How to Run the Notebook

1. Install dependencies: `pip install -r requirements.txt`  
2. Open `readinessAssistantModel.ipynb` in Jupyter  
3. Run all cells sequentially  
4. The notebook will download data, train models, and generate results  

Data is fetched programmatically from public APIs at runtime. No pre-downloaded datasets are required.
