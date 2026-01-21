# 🔥 Wildfire Readiness Assistant

The Wildfire Readiness Assistant is a machine learning tool designed to help communities assess their preparedness for wildfire events. This project addresses public safety issues by providing data-driven readiness assessments that help individuals and communities understand whether conditions may require increased awareness or preparation. The tool supports informed decision-making and does not replace official emergency directions.

---

## ❓ Why this exists?

Wildfire information is often scattered across maps, forecasts, and alerts, making it hard for residents to know how prepared they should be in the critical hours before guidance becomes clear.

The Wildfire Readiness Assistant synthesizes public wildfire and weather signals into a simple readiness level (Low, Moderate, High) with actionable next steps. It is advisory-only and designed to complement—not replace—official emergency alerts and evacuation orders.

---

## 📍 Pilot Region and Scope

The implementation begins as a Santa Cruz pilot covering **one fire season**, running June 1 – October 31. Santa Cruz was selected as the pilot region because it represents a high-risk area with documented fire activity, enabling structured testing of the modeling approach using historical fire and weather conditions.

The model was later expanded using tiled data across California for **one fire season year**. Results and thresholds from the Santa Cruz pilot should not be assumed to generalize outside California without additional calibration and testing.

---

## 🧠 How the Model Works

The model is trained on combined historical fire perimeter data and daily weather conditions to assess wildfire readiness risk. It uses five key inputs:

- 🌡️ Maximum daily temperature  
- 💨 Wind speed  
- 🌧️ Precipitation  
- 🌵 Evapotranspiration (a measure of dryness)  
- 📍 Distance to the nearest historical fire perimeter  

Using a logistic regression model trained on California fire season data, the tool outputs a probability indicating whether readiness should be elevated.

The model categorizes days into three readiness levels based on probability thresholds:

- 🟢 **Low (p < 0.25):** Normal activity; stay informed  
- 🟡 **Moderate (0.25 ≤ p < 0.45):** Pack go-bag; review evacuation routes  
- 🔴 **High (p ≥ 0.45):** Prepare to evacuate if advised by officials  

---

## 📊 Evaluation Philosophy

Recall is the primary evaluation metric for this model. In the context of wildfire readiness, a false negative—failing to flag a day that is actually elevated risk—is far more costly than a false positive—raising an alert when conditions are less dangerous. Missing a dangerous day could leave people unprepared when they should be taking readiness actions.

Accuracy and ROC-AUC are secondary metrics: accuracy can be misleading when most days are low-risk (class imbalance), and while ROC-AUC helps compare model ranking quality, recall directly verifies whether we catch dangerous days.

---

## 🛡️ Responsible Use and Limitations

This tool is designed to support readiness and situational awareness. It does not issue evacuation orders, replace official emergency directives, or make real-time predictions.

The model has been **pilot-tested** for the Santa Cruz region for one fire season. It has not been fully validated for other regions or for use outside California.

Users should always follow official directives from CAL FIRE, county emergency management, and the National Weather Service. This tool provides supplementary readiness guidance only.

---

## 🗺️ Statewide California Coverage

The Santa Cruz pilot approach was expanded to statewide California coverage by dividing the state into tiled bounding boxes with 16 regions, processed across **one fire season year**. This yields **16 tile-year combinations**.

Each tile is processed independently to collect fire perimeter and weather data, then combined into a unified training dataset.

This tiled approach respects API rate limits, enables region-aware evaluation, and allows for per-tile performance assessment to identify areas where the model may need additional calibration.

---

## 🧪 How to Run the Notebook

1. Install dependencies:  
   ```bash
   pip install -r requirements.txt

---

## 🌐 Live demo
You can test out the model at:
👉 https://wilfire-readiness-assisitant-v1.onrender.com/
