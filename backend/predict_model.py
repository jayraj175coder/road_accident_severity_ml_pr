"""
Production inference runner for Road Accident Severity Prediction.

This script is called by the Express API. It loads the persisted scikit-learn
model, LabelEncoders, and StandardScaler, applies the same preprocessing used
in training, and returns the model prediction as JSON.
"""

import json
import os
import sys
from typing import Any, Dict

import joblib
import pandas as pd

CURRENT_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, '..'))
if os.path.join(PROJECT_ROOT, 'ml') not in sys.path:
    sys.path.append(os.path.join(PROJECT_ROOT, 'ml'))

from preprocess import CATEGORICAL_FEATURES, FEATURE_COLUMNS, NUMERICAL_FEATURES, encode_and_scale

MODEL_PATH = os.path.join(CURRENT_DIR, 'model.pkl')
ENCODER_PATH = os.path.join(CURRENT_DIR, 'encoder.pkl')
SCALER_PATH = os.path.join(CURRENT_DIR, 'scaler.pkl')

FIELD_MAP = {
    'state': 'State',
    'weather': 'Weather',
    'road_type': 'Road_Type',
    'road_surface': 'Road_Surface',
    'light_condition': 'Light_Condition',
    'vehicle_type': 'Vehicle_Type',
    'driver_age': 'Driver_Age',
    'driver_gender': 'Driver_Gender',
    'alcohol': 'Alcohol',
    'speed_limit': 'Speed_Limit',
    'month': 'Month',
    'casualties': 'Casualties',
}

RECOMMENDATIONS = {
    'Fatal': [
        'Immediate trauma response and ambulance dispatch are recommended.',
        'Notify traffic police and secure the crash corridor for emergency access.',
        'Alert the nearest hospital for critical-care preparation.',
        'Review speed, alcohol, lighting, and road-surface controls for this location.',
    ],
    'Serious': [
        'Dispatch emergency medical support for victim stabilization.',
        'Inform local traffic police for diversion and scene management.',
        'Inspect road condition and visibility factors before reopening normal flow.',
        'Record the incident for follow-up safety engineering review.',
    ],
    'Minor': [
        'Provide first aid and check occupants for minor injuries.',
        'Move vehicles to a safe shoulder if possible.',
        'File a digital incident report with location and vehicle details.',
        'Inspect vehicle lights, brakes, and tire condition before continuing.',
    ],
}


def load_artifacts():
    """Load the persisted model, encoders, and scaler required for inference."""
    model_bundle = joblib.load(MODEL_PATH)
    model = model_bundle.get('model') if isinstance(model_bundle, dict) else model_bundle
    encoders = joblib.load(ENCODER_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, encoders, scaler


def validate_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Validate required request fields and coerce numeric values safely."""
    missing = [field for field in FIELD_MAP if field not in payload]
    if missing:
        raise ValueError(f"Missing required field(s): {', '.join(missing)}")

    row = {}
    for incoming, training_col in FIELD_MAP.items():
        row[training_col] = payload[incoming]

    for col in NUMERICAL_FEATURES:
        try:
            row[col] = float(row[col])
        except (TypeError, ValueError) as exc:
            raise ValueError(f'{col} must be numeric') from exc

    if not 18 <= row['Driver_Age'] <= 90:
        raise ValueError('Driver_Age must be between 18 and 90')
    if not 20 <= row['Speed_Limit'] <= 140:
        raise ValueError('Speed_Limit must be between 20 and 140')
    if not 1 <= row['Casualties'] <= 20:
        raise ValueError('Casualties must be between 1 and 20')

    for col in CATEGORICAL_FEATURES:
        row[col] = str(row[col])

    return row


def predict(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Run the complete model inference flow for one accident record."""
    model, encoders, scaler = load_artifacts()
    row = validate_payload(payload)
    frame = pd.DataFrame([row], columns=FEATURE_COLUMNS)
    X_scaled, _, _, _ = encode_and_scale(frame, is_training=False, encoders=encoders, scaler=scaler)

    encoded_prediction = model.predict(X_scaled)[0]
    target_encoder = encoders['Severity']
    severity = target_encoder.inverse_transform([int(encoded_prediction)])[0]

    probabilities = {}
    if hasattr(model, 'predict_proba'):
        probability_values = model.predict_proba(X_scaled)[0]
        for class_index, probability in zip(model.classes_, probability_values):
            class_name = target_encoder.inverse_transform([int(class_index)])[0]
            probabilities[class_name] = round(float(probability) * 100, 2)

    for class_name in ['Minor', 'Serious', 'Fatal']:
        probabilities.setdefault(class_name, 0.0)

    confidence = max(probabilities.values())
    return {
        'severity': severity,
        'confidence': round(confidence, 2),
        'probabilities': {
            'Minor': probabilities['Minor'],
            'Serious': probabilities['Serious'],
            'Fatal': probabilities['Fatal'],
        },
        'recommendations': RECOMMENDATIONS.get(severity, RECOMMENDATIONS['Minor']),
    }


def main():
    """Read a JSON payload argument and print the prediction response as JSON."""
    try:
        payload = json.loads(sys.argv[1])
        print(json.dumps(predict(payload)))
    except Exception as exc:
        print(json.dumps({'error': str(exc)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
