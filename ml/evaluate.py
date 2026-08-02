"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - EVALUATION & DIMENSIONALITY REDUCTION
==================================================
Author: B.Tech Computer Engineering Student
File: ml/evaluate.py
Description: Advanced model evaluation including Confusion Matrix, ROC-AUC, 
             Cross-Validation, Feature Importance, PCA, LDA, and DBSCAN clustering.
"""

import os
import numpy as np
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.model_selection import cross_val_score
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
from sklearn.cluster import DBSCAN

from preprocess import get_prepared_data


def evaluate_model_pipeline(model, X_train, X_test, y_train, y_test, class_names=['Minor', 'Serious', 'Fatal']):
    """
    Evaluates trained model performance with detailed diagnostic metrics.
    """
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test) if hasattr(model, "predict_proba") else None
    
    print("\n--- CLASSIFICATION REPORT ---")
    print(classification_report(y_test, y_pred, target_names=class_names))
    
    print("\n--- CONFUSION MATRIX ---")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    
    # 5-Fold Cross Validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1_weighted')
    print(f"\n--- 5-FOLD CROSS VALIDATION F1 SCORES ---")
    print(f"Scores: {np.round(cv_scores, 4)}")
    print(f"Mean CV F1-Score: {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores):.4f})")
    
    # ROC-AUC calculation
    roc_metrics = {}
    if y_prob is not None:
        try:
            macro_roc_auc = roc_auc_score(y_test, y_prob, multi_class='ovr', average='macro')
            print(f"\n--- ROC-AUC SCORE (Macro OVR): {macro_roc_auc:.4f} ---")
            for i, class_label in enumerate(class_names):
                fpr, tpr, _ = roc_curve((y_test == i).astype(int), y_prob[:, i])
                roc_metrics[class_label] = {'fpr': fpr.tolist(), 'tpr': tpr.tolist()}
        except Exception as e:
            print(f"[WARN] ROC calculation skipped: {e}")
            
    return {
        'confusion_matrix': cm.tolist(),
        'cv_scores': cv_scores.tolist(),
        'cv_mean': float(np.mean(cv_scores)),
        'roc_metrics': roc_metrics
    }


def perform_pca(X, n_components=2):
    """
    Performs Principal Component Analysis (PCA) for 2D visualization.
    """
    pca = PCA(n_components=n_components, random_state=42)
    X_pca = pca.fit_transform(X)
    explained_var = pca.explained_variance_ratio_
    
    print(f"\n[PCA] Explained Variance Ratio: {np.round(explained_var, 4)} (Total: {np.sum(explained_var)*100:.2f}%)")
    
    return pd.DataFrame(X_pca, columns=[f'PC{i+1}' for i in range(n_components)]), explained_var


def perform_lda(X, y, n_components=2):
    """
    Performs Linear Discriminant Analysis (LDA) for class separability projection.
    """
    lda = LDA(n_components=min(n_components, len(np.unique(y)) - 1))
    X_lda = lda.fit_transform(X, y)
    
    print(f"[LDA] Transformed feature space shape: {X_lda.shape}")
    return pd.DataFrame(X_lda, columns=[f'LD{i+1}' for i in range(X_lda.shape[1])])


def perform_dbscan_clustering(df_locations, eps=0.15, min_samples=3):
    """
    Applies DBSCAN (Density-Based Spatial Clustering of Applications with Noise)
    to identify geographical accident hotspots based on Latitude and Longitude.
    """
    coords = df_locations[['Latitude', 'Longitude']].values
    
    dbscan = DBSCAN(eps=eps, min_samples=min_samples, metric='euclidean')
    cluster_labels = dbscan.fit_predict(coords)
    
    n_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
    n_noise = list(cluster_labels).count(-1)
    
    print(f"\n[DBSCAN] Detected Clusters: {n_clusters}, Noise points: {n_noise}")
    df_locations['Cluster'] = cluster_labels
    return df_locations, n_clusters


if __name__ == "__main__":
    X_train, X_test, y_train, y_test, encoders, scaler = get_prepared_data()
    
    print("[INFO] Evaluating PCA...")
    df_pca, exp_var = perform_pca(X_train)
    
    print("[INFO] Evaluating LDA...")
    df_lda = perform_lda(X_train, y_train)
    
    print("[SUCCESS] Evaluation Module Executed!")
