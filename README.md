# 🔥 Wildfire Readiness Assistant  
**AI-powered readiness guidance for wildfire-prone communities (Advisory-only)**

🌲 **Wildfire Readiness Assistant** is a machine learning tool designed to help **residents in wildfire-prone regions** understand **how prepared they should be right now** using a simple readiness level:

🟢 **Low** → Stay informed  
🟡 **Moderate** → Prepare (go-bag, routes, checklist)  
🔴 **High** → Be ready to evacuate *if advised by authorities*

> ⚠️ **Important:** This project is **advisory-only** and **does not replace** federal/state/local emergency alerts or evacuation orders.

---

## 🎯 Why This Exists
Wildfire information is often scattered across:

🗺️ fire maps • 🌬️ weather forecasts • 📢 alerts • 📰 news updates  

That can make it difficult for residents to answer the most practical question:

> **“How prepared should I be right now?”**

This project closes that **readiness gap** by synthesizing public wildfire + weather signals into one calm, actionable output.

---

## 👥 Who Benefits
This tool is designed for **wildfire-prone residents**, especially households managing:

👶 children • 👵 seniors • 🐶 pets • 🚗 travel/packing time

---

## 🧭 Pilot Region & Scope
### ✅ Santa Cruz Pilot (2020–2022 Fire Seasons)
The initial implementation begins as a **Santa Cruz pilot**, covering **three fire seasons (2020–2022)**  
📅 Fire season window: **June 1 – October 31**

Santa Cruz was chosen because it represents a high-risk area with documented wildfire activity, enabling structured testing using historical fire + weather conditions.

📌 The multi-year approach provides approximately **459 training days** and supports cross-year validation.

---

## 🧠 How the Model Works
The model combines historical wildfire perimeters and daily weather conditions using **5 key inputs**:

- 🌡️ Maximum daily temperature (**TMAX**)  
- 💨 Wind speed (**AWND**)  
- 🌧️ Precipitation (**PRCP**)  
- 🌵 Evapotranspiration / dryness (**EVAP**)  
- 📍 Distance to nearest historical fire perimeter (**DISTANCE_TO_FIRE_KM**)  

The system uses a **Logistic Regression model** to output a probability score representing whether readiness should be elevated.

---

## 🚦 Readiness Levels (Output)
The model maps probability into **3 readiness states**:

🟢 **Low (p < 0.25)**  
Normal activity • Stay informed  

🟡 **Moderate (0.25 ≤ p < 0.45)**  
Pack a go-bag • Review evacuation routes  

🔴 **High (p ≥ 0.45)**  
Prepare to evacuate **if advised by officials**  
*(This is not an evacuation order.)*

---

## 📊 Evaluation Philosophy
This project prioritizes **Recall** as the primary metric.

✅ **Why recall matters:**  
In wildfire readiness, a **false negative** (missing a dangerous day) is more costly than a **false positive** (a cautious readiness warning).

📌 Secondary metrics:  
- **Accuracy** can be misleading due to class imbalance  
- **ROC-AUC** helps compare ranking quality, but recall best reflects safety goals  

---

## 🛡️ Responsible Use & Limitations
This tool supports **readiness and situational awareness** — it does **not**:

- ❌ issue evacuation orders  
- ❌ replace CAL FIRE, county alerts, NWS warnings, or emergency instructions  
- ❌ predict wildfire ignition or fire spread in real time  

### 🔒 Pilot Validation Limits
The model has been **pilot-tested** for the **Santa Cruz region (2020–2022)** and has not been fully validated for other regions.

📢 Users should always follow official guidance from:
- CAL FIRE  
- County emergency management offices  
- National Weather Service  

---

## 🗺️ Statewide California Coverage (Tiled Framework)
The Santa Cruz pilot approach was expanded to statewide California coverage using a **16-tile bounding box framework**:

🧩 **16 regions × 3 years = 48 tile-year combinations**  
📆 ~**7,344 daily observations**

Each tile is processed independently to:
- respect API rate limits  
- enable region-aware evaluation  
- identify tiles that need calibration or retraining  

---

## 🧪 How to Run the Notebook
### 1) Install dependencies
```bash
pip install -r requirements.txt
