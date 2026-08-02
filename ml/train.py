"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - MODEL TRAINING
==================================================
Author: B.Tech Computer Engineering Student
File: ml/train.py
Description: Train, compare, select, and document the production ML model.
"""

import json
import os
import time
from datetime import datetime

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import (
    AdaBoostClassifier,
    BaggingClassifier,
    ExtraTreesClassifier,
    GradientBoostingClassifier,
    RandomForestClassifier,
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_curve,
)
from sklearn.preprocessing import label_binarize
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from preprocess import FEATURE_COLUMNS, MODEL_DIR, get_prepared_data

ARTIFACT_DIR = os.path.join(MODEL_DIR, 'evaluation')


def percent(value):
    """Convert a decimal metric into a rounded percentage value."""
    return round(float(value) * 100, 2)


def build_model_registry():
    """Create the supervised classification models used for benchmarking."""
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Decision Tree': DecisionTreeClassifier(random_state=42, max_depth=8),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Bagging': BaggingClassifier(n_estimators=50, random_state=42),
        'AdaBoost': AdaBoostClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'SVM': SVC(probability=True, random_state=42),
    }

    if HAS_XGBOOST:
        models['XGBoost'] = XGBClassifier(eval_metric='mlogloss', random_state=42)
    else:
        models['Extra Trees (XGBoost Fallback)'] = ExtraTreesClassifier(n_estimators=100, random_state=42)

    return models


def get_feature_importance(model):
    """Extract feature importance from tree models or linear coefficients."""
    if hasattr(model, 'feature_importances_'):
        values = model.feature_importances_
    elif hasattr(model, 'coef_'):
        values = np.mean(np.abs(model.coef_), axis=0)
    else:
        values = np.zeros(len(FEATURE_COLUMNS))

    return pd.DataFrame({'feature': FEATURE_COLUMNS, 'importance': values}).sort_values(
        by='importance', ascending=False
    )


def save_confusion_matrix(y_test, y_pred, class_names):
    """Render the confusion matrix as a PNG image for the frontend report page."""
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(7, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Oranges', xticklabels=class_names, yticklabels=class_names)
    plt.xlabel('Predicted Label')
    plt.ylabel('Actual Label')
    plt.title('Confusion Matrix')
    plt.tight_layout()
    plt.savefig(os.path.join(ARTIFACT_DIR, 'confusion_matrix.png'), dpi=160)
    plt.close()
    return cm.tolist()


def save_roc_curve(model, X_test, y_test, class_names):
    """Render one-vs-rest ROC curves for classifiers exposing predict_proba."""
    if not hasattr(model, 'predict_proba'):
        return None

    probabilities = model.predict_proba(X_test)
    y_binary = label_binarize(y_test, classes=list(range(len(class_names))))

    plt.figure(figsize=(7, 5))
    for idx, class_name in enumerate(class_names):
        fpr, tpr, _ = roc_curve(y_binary[:, idx], probabilities[:, idx])
        plt.plot(fpr, tpr, linewidth=2, label=class_name)

    plt.plot([0, 1], [0, 1], linestyle='--', color='gray', linewidth=1)
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve (One-vs-Rest)')
    plt.legend(loc='lower right')
    plt.tight_layout()
    plt.savefig(os.path.join(ARTIFACT_DIR, 'roc_curve.png'), dpi=160)
    plt.close()
    return 'roc_curve.png'


def save_feature_importance(model):
    """Render model feature importance values as a PNG image."""
    importance_df = get_feature_importance(model)
    top_features = importance_df.head(12).sort_values(by='importance', ascending=True)

    plt.figure(figsize=(8, 5))
    plt.barh(top_features['feature'], top_features['importance'], color='#f97316')
    plt.xlabel('Importance')
    plt.title('Feature Importance')
    plt.tight_layout()
    plt.savefig(os.path.join(ARTIFACT_DIR, 'feature_importance.png'), dpi=160)
    plt.close()
    return importance_df.to_dict(orient='records')


def train_and_evaluate_models():
    """Train all models, select the best F1 model, and save production artifacts."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(ARTIFACT_DIR, exist_ok=True)

    X_train, X_test, y_train, y_test, encoders, scaler = get_prepared_data()
    class_names = encoders['Severity'].classes_.tolist()
    models = build_model_registry()

    comparison_results = []
    best_model = None
    best_model_name = ''
    best_score = -1.0

    print('\n==================================================')
    print('        MACHINE LEARNING MODEL COMPARISON         ')
    print('==================================================')
    print(f"{'Algorithm':<30} | {'Accuracy':<9} | {'Precision':<9} | {'Recall':<9} | {'F1':<9}")
    print('-' * 82)

    for name, model in models.items():
        start = time.perf_counter()
        model.fit(X_train, y_train)
        train_time_ms = round((time.perf_counter() - start) * 1000)
        y_pred = model.predict(X_test)

        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

        result = {
            'algorithm': name,
            'accuracy': percent(accuracy),
            'precision': percent(precision),
            'recall': percent(recall),
            'f1_score': percent(f1),
            'train_time_ms': train_time_ms,
        }
        comparison_results.append(result)
        print(f"{name:<30} | {accuracy:.4f}   | {precision:.4f}    | {recall:.4f}   | {f1:.4f}")

        if f1 > best_score:
            best_score = f1
            best_model = model
            best_model_name = name

    for item in comparison_results:
        item['is_best'] = item['algorithm'] == best_model_name

    y_pred_best = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred_best)
    precision = precision_score(y_test, y_pred_best, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred_best, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred_best, average='weighted', zero_division=0)

    report = classification_report(y_test, y_pred_best, target_names=class_names, zero_division=0)
    with open(os.path.join(ARTIFACT_DIR, 'classification_report.txt'), 'w', encoding='utf-8') as file:
        file.write(report)

    confusion = save_confusion_matrix(y_test, y_pred_best, class_names)
    save_roc_curve(best_model, X_test, y_test, class_names)
    feature_importance = save_feature_importance(best_model)

    metrics = {
        'algorithm': best_model_name,
        'accuracy': percent(accuracy),
        'precision': percent(precision),
        'recall': percent(recall),
        'f1': percent(f1),
        'f1_score': percent(f1),
        'training_samples': int(len(X_train)),
        'test_samples': int(len(X_test)),
        'feature_count': int(len(FEATURE_COLUMNS)),
        'target_classes': class_names,
        'dataset_source': 'dataset/india_road_accidents.csv',
        'trained_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'confusion_matrix': confusion,
        'feature_importance': feature_importance,
    }

    with open(os.path.join(MODEL_DIR, 'metrics.json'), 'w', encoding='utf-8') as file:
        json.dump(metrics, file, indent=2)

    with open(os.path.join(MODEL_DIR, 'model_comparison.json'), 'w', encoding='utf-8') as file:
        json.dump(comparison_results, file, indent=2)

    joblib.dump({
        'model': best_model,
        'algorithm_name': best_model_name,
        'f1_score': f1,
        'metrics': comparison_results,
        'feature_columns': FEATURE_COLUMNS,
        'target_classes': class_names,
    }, os.path.join(MODEL_DIR, 'model.pkl'))

    print('==================================================')
    print(f"[BEST MODEL SELECTED]: {best_model_name} with Weighted F1-Score: {f1:.4f}")
    print(f"[INFO] Artifacts saved to: {MODEL_DIR}")
    return pd.DataFrame(comparison_results), best_model, best_model_name


if __name__ == '__main__':
    train_and_evaluate_models()
    print('\n[SUCCESS] Model Training, Comparison, and Artifact Generation Finished!')
