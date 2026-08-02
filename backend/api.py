"""
FastAPI backend for Road Accident Severity Prediction.

The API loads the trained scikit-learn model artifacts through predict_model.py
so the response is produced by model.predict and model.predict_proba, not by
hand-written severity rules.
"""

import json
import os
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict_model import predict

CURRENT_DIR = os.path.dirname(__file__)
METRICS_PATH = os.path.join(CURRENT_DIR, 'metrics.json')
COMPARISON_PATH = os.path.join(CURRENT_DIR, 'model_comparison.json')

app = FastAPI(
    title='Road Accident Severity Prediction API',
    description='Machine Learning API for predicting Indian road accident severity',
    version='1.0.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class AccidentInput(BaseModel):
    state: str = Field(..., example='Maharashtra')
    weather: str = Field(..., example='Heavy Rain')
    road_type: str = Field(..., example='National Highway')
    road_surface: str = Field(..., example='Slippery')
    light_condition: str = Field(..., example='Night - Darkness')
    vehicle_type: str = Field(..., example='Heavy Truck')
    driver_age: int = Field(..., ge=18, le=90, example=42)
    driver_gender: str = Field(..., example='Male')
    alcohol: str = Field(..., example='Yes')
    speed_limit: int = Field(..., ge=20, le=140, example=80)
    time_of_day: str = Field(..., example='23:15')
    month: str = Field(..., example='July')
    casualties: int = Field(1, ge=1, le=20, example=4)


class PredictionResponse(BaseModel):
    severity: str
    confidence: float
    probabilities: Dict[str, float]
    recommendations: List[str]


def read_json(path, fallback):
    """Read a JSON artifact generated during model training."""
    try:
        with open(path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return fallback


@app.get('/')
def read_root():
    return {
        'project': 'Road Accident Severity Prediction using Machine Learning',
        'status': 'Online',
        'version': '1.0.0',
    }


@app.get('/model-info')
def get_model_info():
    return read_json(METRICS_PATH, {})


@app.get('/model-comparison')
def get_model_comparison():
    return read_json(COMPARISON_PATH, [])


@app.post('/predict', response_model=PredictionResponse)
def predict_severity(data: AccidentInput):
    """Validate input and return a real trained-model prediction."""
    try:
        return predict(data.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=8000)
