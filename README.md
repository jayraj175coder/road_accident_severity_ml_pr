# 🚦 Road Accident Severity Prediction using Machine Learning

> **An End-to-End Machine Learning Web Application for Predicting Road Accident Severity in India using Supervised Learning**

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![License](https://img.shields.io/badge/License-Academic-green)

---

# 📖 Overview

Road accidents are one of the leading causes of fatalities worldwide. Early estimation of accident severity helps emergency responders, transportation authorities, and policy makers allocate resources more efficiently.

This project predicts the severity of road accidents using Machine Learning by analyzing factors such as:

* Weather Conditions
* Road Type
* Road Surface
* Light Conditions
* Vehicle Type
* Driver Information
* Speed Limit
* Casualties
* Location
* Time & Month

The trained model classifies accidents into three categories:

| Severity   | Description                                      |
| ---------- | ------------------------------------------------ |
| 🟢 Minor   | Small injuries with minimal damage               |
| 🟡 Serious | Significant injuries requiring medical attention |
| 🔴 Fatal   | Life-threatening or fatal accidents              |

Unlike rule-based systems, predictions are generated directly from a trained machine learning model using Scikit-Learn.

---

# ✨ Features

## 🤖 Machine Learning

* Multiple ML algorithms trained automatically
* Automatic best-model selection
* Weighted F1 Score comparison
* Persisted trained model
* Probability prediction
* Feature preprocessing pipeline
* Real-time inference

---

## 📊 Analytics Dashboard

* Dataset Summary
* Missing Value Analysis
* Duplicate Detection
* Class Distribution
* Model Performance
* Feature Importance
* ROC Curve
* Confusion Matrix
* Classification Report

---

## 🌐 Web Application

* Modern React UI
* Express REST API
* Real-time prediction
* CSV Batch Prediction
* Prediction History
* PDF Report Export
* Hotspot Visualization
* Dataset Explorer
* Methodology Page
* Model Comparison Dashboard

---

# 🏗️ Complete System Architecture

```text
                                    ROAD ACCIDENT SEVERITY PREDICTION SYSTEM

                                         ┌──────────────────────────────┐
                                         │   India Road Accident CSV    │
                                         │      Historical Dataset       │
                                         └──────────────┬───────────────┘
                                                        │
                                                        ▼
                                       ┌────────────────────────────────┐
                                       │      Data Preprocessing        │
                                       │                                │
                                       │ • Missing Value Handling       │
                                       │ • Label Encoding               │
                                       │ • Feature Scaling              │
                                       │ • Train/Test Split             │
                                       └──────────────┬─────────────────┘
                                                      │
                                                      ▼
                                   ┌────────────────────────────────────┐
                                   │      Machine Learning Training     │
                                   │                                    │
                                   │ Logistic Regression                │
                                   │ Decision Tree                      │
                                   │ Random Forest                      │
                                   │ Bagging                            │
                                   │ AdaBoost                           │
                                   │ Gradient Boosting                  │
                                   │ Support Vector Machine             │
                                   │ XGBoost / Extra Trees              │
                                   └──────────────┬─────────────────────┘
                                                  │
                           Compare Accuracy, Precision, Recall & Weighted F1
                                                  │
                                                  ▼
                                   ┌────────────────────────────────────┐
                                   │      Best Model Selection          │
                                   │      Highest Weighted F1 Score     │
                                   └──────────────┬─────────────────────┘
                                                  │
                                                  ▼
                    ┌────────────────────────────────────────────────────────────┐
                    │                    Model Artifacts                         │
                    │                                                            │
                    │ model.pkl                                                  │
                    │ encoder.pkl                                                │
                    │ scaler.pkl                                                 │
                    │ metrics.json                                               │
                    │ model_comparison.json                                      │
                    └──────────────┬─────────────────────────────────────────────┘
                                   │
                                   ▼
                   ┌─────────────────────────────────────────────────────┐
                   │            Express REST API Backend                 │
                   │                                                     │
                   │ /api/predict                                        │
                   │ /api/model-info                                     │
                   │ /api/model-comparison                               │
                   │ /api/dataset-summary                                │
                   │ /api/evaluation                                     │
                   └──────────────┬──────────────────────────────────────┘
                                  │
                                  ▼
                     ┌────────────────────────────────────┐
                     │     Python Prediction Engine       │
                     │                                    │
                     │ Load Model                         │
                     │ Encode Features                    │
                     │ Scale Features                     │
                     │ Predict Severity                   │
                     │ Predict Probability                │
                     └──────────────┬─────────────────────┘
                                    │
                                    ▼
                     ┌────────────────────────────────────┐
                     │       React Frontend Dashboard      │
                     │                                    │
                     │ Prediction Form                    │
                     │ Analytics Dashboard                │
                     │ Model Comparison                   │
                     │ Dataset Statistics                 │
                     │ Evaluation Results                 │
                     │ Hotspot Map                        │
                     │ Batch Prediction                   │
                     │ Prediction History                 │
                     └────────────────────────────────────┘
```

---

# 🧠 Machine Learning Workflow

```text
Dataset
    │
    ▼
Data Cleaning
    │
    ▼
Feature Engineering
    │
    ▼
Encoding
    │
    ▼
Scaling
    │
    ▼
Train/Test Split
    │
    ▼
Train Multiple Models
    │
    ▼
Evaluate Performance
    │
    ▼
Select Best Model
    │
    ▼
Save Model Artifacts
    │
    ▼
Deploy REST API
    │
    ▼
Predict New Accident Severity
```

---

# 🗂 Project Structure

```text
Road-Accident-Severity-Prediction/
│
├── backend/
│   ├── api.py
│   ├── predict_model.py
│   ├── model.pkl
│   ├── encoder.pkl
│   ├── scaler.pkl
│   ├── metrics.json
│   ├── model_comparison.json
│   └── evaluation/
│       ├── classification_report.txt
│       ├── confusion_matrix.png
│       ├── roc_curve.png
│       └── feature_importance.png
│
├── ml/
│   ├── preprocess.py
│   ├── train.py
│   └── evaluate.py
│
├── dataset/
│   └── india_road_accidents.csv
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── assets/
│
├── public/
├── server.ts
├── vite.config.ts
├── package.json
└── README.md
```

---

# 📊 Machine Learning Algorithms

The project benchmarks multiple supervised learning algorithms.

| Algorithm              | Purpose                     |
| ---------------------- | --------------------------- |
| Logistic Regression    | Baseline Linear Model       |
| Decision Tree          | Tree-based Classification   |
| Random Forest          | Ensemble Learning           |
| Bagging Classifier     | Bootstrap Aggregation       |
| AdaBoost               | Adaptive Boosting           |
| Gradient Boosting      | Sequential Ensemble         |
| Support Vector Machine | Margin-based Classification |
| XGBoost                | Gradient Boosting Framework |
| Extra Trees            | Fallback Ensemble           |

The model with the **highest Weighted F1 Score** is automatically selected for deployment.

---

# 📁 Dataset

```
dataset/india_road_accidents.csv
```

## Input Features

### 🌍 Location

* State
* Road Type

### 🌦 Environment

* Weather
* Road Surface
* Light Condition
* Month

### 🚗 Vehicle

* Vehicle Type
* Speed Limit

### 👤 Driver

* Driver Age
* Driver Gender
* Alcohol Involvement

### 🚨 Incident

* Time of Day
* Casualties

### 🎯 Target

```
Severity
```

Classes

```
Minor
Serious
Fatal
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/Road-Accident-Severity-Prediction.git

cd Road-Accident-Severity-Prediction
```

---

## Install Node Packages

```bash
npm install
```

---

## Install Python Packages

```bash
pip install pandas numpy scikit-learn matplotlib seaborn joblib fastapi uvicorn
```

Optional

```bash
pip install xgboost
```

---

# 🏋️ Train Model

```bash
python ml/train.py
```

Generated Artifacts

```text
backend/model.pkl

backend/encoder.pkl

backend/scaler.pkl

backend/metrics.json

backend/model_comparison.json

backend/evaluation/
```

---

# ▶️ Run Application

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

Frontend

```
http://localhost:3000
```

---

# 🔌 REST API

## Health

```http
GET /api/health
```

---

## Predict Severity

```http
POST /api/predict
```

Example Response

```json
{
  "severity":"Fatal",
  "confidence":96.4,
  "probabilities":{
      "Minor":0.2,
      "Serious":3.4,
      "Fatal":96.4
  }
}
```

---

## Additional APIs

```http
GET /api/model-info

GET /api/model-comparison

GET /api/dataset-summary

GET /api/evaluation
```

---

# 📈 Evaluation Metrics

The trained model is evaluated using:

* Accuracy
* Precision
* Recall
* Weighted F1 Score
* Confusion Matrix
* ROC Curve
* Classification Report
* Feature Importance

---

# 🖼 Screenshots

Replace the placeholders with project screenshots.

```
Home Page

Prediction Page

Prediction Result

Analytics Dashboard

Dataset Summary

Model Comparison

Evaluation

Methodology

Hotspot Map

CSV Prediction

Prediction History
```

---

# 🚀 Future Enhancements

* Real-time weather integration
* Live traffic API support
* Google Maps integration
* Accident hotspot prediction
* SHAP Explainable AI
* Deep Learning models
* Model versioning
* Docker deployment
* CI/CD Pipeline
* Emergency response integration
* Mobile application support

---

# 🛠 Technology Stack

| Layer            | Technologies            |
| ---------------- | ----------------------- |
| Frontend         | React, TypeScript, Vite |
| Backend          | Express.js, Node.js     |
| Machine Learning | Python, Scikit-Learn    |
| Visualization    | Matplotlib, Seaborn     |
| Data Processing  | Pandas, NumPy           |
| API              | REST API                |
| Model Storage    | Joblib / Pickle         |

---

# 👨‍💻 Author

**Jayraj Sanas**

Bachelor of Technology (Computer Engineering)

Academic Machine Learning Microproject

---

# 📄 License

This project is developed for **academic learning, research, and demonstration purposes**. It is intended to showcase the application of Machine Learning techniques for road accident severity prediction and should not be used as a replacement for real-world emergency decision-making systems.

---

⭐ **If you found this project useful, consider giving it a Star on GitHub!**
