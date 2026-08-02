"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - PREPROCESSING
==================================================
Author: B.Tech Computer Engineering Student
File: ml/preprocess.py
Description: Data loading, cleaning, encoding, scaling, and train-test splitting.
"""

import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'india_road_accidents.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend')

CATEGORICAL_FEATURES = [
    'State', 'Weather', 'Road_Type', 'Road_Surface',
    'Light_Condition', 'Vehicle_Type', 'Driver_Gender', 'Alcohol', 'Month'
]

NUMERICAL_FEATURES = [
    'Driver_Age', 'Speed_Limit', 'Casualties'
]

TARGET_COL = 'Severity'
FEATURE_COLUMNS = CATEGORICAL_FEATURES + NUMERICAL_FEATURES


def load_data(filepath=DATASET_PATH):
    """
    Load the primary accident dataset and skip malformed rows.

    The CSV may contain rows from a different source schema after the expected
    training records. Skipping malformed rows preserves the model feature
    contract used by the deployed inference pipeline.
    """
    print(f"[INFO] Loading dataset from: {filepath}")
    return pd.read_csv(filepath, on_bad_lines='skip')


def clean_data(df):
    """
    Remove duplicates and fill missing values before model preparation.
    """
    initial_shape = df.shape
    df = df.drop_duplicates().copy()

    for col in NUMERICAL_FEATURES:
        if col in df.columns and df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].median())

    for col in CATEGORICAL_FEATURES:
        if col in df.columns and df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].mode()[0])

    print(f"[INFO] Cleaning complete. Initial rows: {initial_shape[0]}, Cleaned rows: {df.shape[0]}")
    return df


def encode_and_scale(df, is_training=True, encoders=None, scaler=None):
    """
    Apply the exact training/inference preprocessing contract.

    Categorical fields are LabelEncoded, the target label encoder is stored
    under Severity, and the final feature matrix is scaled with StandardScaler.
    Inference reuses the saved encoders and scaler so predictions match the
    trained model representation.
    """
    df_processed = df.copy()
    encoders = {} if encoders is None else encoders

    for col in CATEGORICAL_FEATURES:
        if col in df_processed.columns:
            if is_training:
                encoder = LabelEncoder()
                df_processed[col] = encoder.fit_transform(df_processed[col].astype(str))
                encoders[col] = encoder
            else:
                encoder = encoders[col]
                df_processed[col] = df_processed[col].astype(str).map(
                    lambda value: encoder.transform([value])[0] if value in encoder.classes_ else 0
                )

    if TARGET_COL in df_processed.columns and is_training:
        target_encoder = LabelEncoder()
        df_processed[TARGET_COL] = target_encoder.fit_transform(df_processed[TARGET_COL].astype(str))
        encoders[TARGET_COL] = target_encoder

    X = df_processed[FEATURE_COLUMNS]
    y = df_processed[TARGET_COL] if TARGET_COL in df_processed.columns else None

    if is_training:
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
    else:
        if scaler is None:
            raise ValueError('A fitted scaler is required for inference preprocessing.')
        X_scaled = scaler.transform(X)

    X_scaled_df = pd.DataFrame(X_scaled, columns=FEATURE_COLUMNS)
    return X_scaled_df, y, encoders, scaler


def get_prepared_data(test_size=0.2, random_state=42):
    """
    Load, clean, encode, scale, split, and persist preprocessing artifacts.
    """
    df = clean_data(load_data())
    X, y, encoders, scaler = encode_and_scale(df, is_training=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    print(f"[INFO] Train shape: {X_train.shape}, Test shape: {X_test.shape}")
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(encoders, os.path.join(MODEL_DIR, 'encoder.pkl'))
    joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
    print(f"[INFO] Encoder and Scaler saved to {MODEL_DIR}")

    return X_train, X_test, y_train, y_test, encoders, scaler


if __name__ == "__main__":
    get_prepared_data()
    print("[SUCCESS] Data Preprocessing Pipeline Executed Successfully!")
