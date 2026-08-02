# Road Accident Severity Prediction using Machine Learning

A production-style B.Tech Computer Engineering microproject that predicts road accident severity in India as `Minor`, `Serious`, or `Fatal`. The application combines a React dashboard, Express API, Python/Scikit-learn training pipeline, persisted model artifacts, model evaluation outputs, and dataset documentation.

## Project Overview

The system trains multiple supervised machine learning classifiers on road accident records, selects the best model by weighted F1 score, saves the trained model and preprocessing artifacts, and serves real-time predictions through the web application.

The live prediction flow uses:

- `backend/model.pkl`
- `backend/encoder.pkl`
- `backend/scaler.pkl`
- `backend/predict_model.py`

No rule-based severity scoring is used for the prediction endpoint.

## Features

- Real trained-model prediction through `model.predict()` and `model.predict_proba()`
- Input validation and consistent training/inference preprocessing
- Dynamic model metrics from `backend/metrics.json`
- Model comparison leaderboard for all trained algorithms
- Dataset profiling page with rows, columns, missing values, duplicates, target classes, features, and class distribution
- Evaluation page showing confusion matrix, classification report, ROC curve, and feature importance
- Methodology page explaining the full ML workflow
- Analytics dashboard with charts and trained-model summary cards
- Hotspot map, batch CSV prediction, prediction history, PDF report export, and project documentation pages

## Architecture

```text
Dataset CSV
  -> ml/preprocess.py
  -> encoding + scaling artifacts
  -> ml/train.py
  -> model comparison + best model selection
  -> backend/model.pkl, encoder.pkl, scaler.pkl
  -> backend/metrics.json and evaluation artifacts
  -> Express API /api/predict
  -> Python inference runner
  -> React frontend
```

## Algorithms

The training pipeline benchmarks:

- Logistic Regression
- Decision Tree
- Random Forest
- Bagging
- AdaBoost
- Gradient Boosting
- SVM
- XGBoost, when installed
- Extra Trees fallback when XGBoost is unavailable

The best model is selected automatically using weighted F1 score.

## Dataset

Dataset file:

```text
dataset/india_road_accidents.csv
```

Core feature groups:

- Location: state, road type
- Environment: weather, road surface, light condition, month
- Vehicle and driver: vehicle type, driver age, gender, alcohol involvement
- Incident severity factors: speed limit and casualties

Target column:

```text
Severity
```

Target classes:

```text
Minor, Serious, Fatal
```

## Installation

### 1. Install Node dependencies

```bash
npm install
```

### 2. Install Python dependencies

Use the included virtual environment if available, or create a new one and install:

```bash
pip install pandas numpy scikit-learn matplotlib seaborn joblib fastapi uvicorn
```

Optional:

```bash
pip install xgboost
```

### 3. Train the model and generate artifacts

```bash
python ml/train.py
```

This generates:

```text
backend/model.pkl
backend/encoder.pkl
backend/scaler.pkl
backend/metrics.json
backend/model_comparison.json
backend/evaluation/classification_report.txt
backend/evaluation/confusion_matrix.png
backend/evaluation/roc_curve.png
backend/evaluation/feature_importance.png
```

### 4. Start the web application

```bash
npm run dev
```

The app runs on:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
npm start
```

## API Endpoints

### Health

```http
GET /api/health
```

### Prediction

```http
POST /api/predict
```

Example request:

```json
{
  "state": "Maharashtra",
  "weather": "Heavy Rain",
  "road_type": "National Highway",
  "road_surface": "Slippery",
  "light_condition": "Night - Darkness",
  "vehicle_type": "Heavy Truck",
  "driver_age": 42,
  "driver_gender": "Male",
  "alcohol": "Yes",
  "speed_limit": 90,
  "time_of_day": "23:15",
  "month": "July",
  "casualties": 4
}
```

Example response:

```json
{
  "severity": "Fatal",
  "confidence": 96.4,
  "probabilities": {
    "Minor": 0.2,
    "Serious": 3.4,
    "Fatal": 96.4
  },
  "recommendations": []
}
```

### Model Metrics

```http
GET /api/model-info
```

### Model Comparison

```http
GET /api/model-comparison
```

### Dataset Summary

```http
GET /api/dataset-summary
```

### Evaluation Artifacts

```http
GET /api/evaluation
```

## Screenshots

Add screenshots after running the app locally:

- Home page
- Prediction form
- Prediction result
- Dashboard
- Dataset page
- Model comparison page
- Evaluation page
- Methodology page
- Hotspot map
- Batch CSV prediction

## Project Structure

```text
backend/
  api.py
  predict_model.py
  model.pkl
  encoder.pkl
  scaler.pkl
  metrics.json
  model_comparison.json
  evaluation/
ml/
  preprocess.py
  train.py
  evaluate.py
dataset/
  india_road_accidents.csv
src/
  components/
  services/
  utils/
server.ts
vite.config.ts
```

## Future Scope

- Connect live traffic, weather, and road-condition APIs
- Add geospatial clustering from full latitude/longitude records
- Add model versioning and experiment tracking
- Add SHAP-based explanations from the trained model
- Deploy backend and frontend with CI/CD
- Integrate emergency dispatch workflows for high-severity predictions

## License

Academic microproject for learning and demonstration purposes.
