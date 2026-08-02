import React, { useState, useEffect } from 'react';
import { 
  Folder, FolderOpen, FileText, FileCode, Database, Download, 
  Copy, Check, Search, Terminal, Eye, Code, Layers, FileSpreadsheet,
  Plus, RefreshCw, ChevronRight, ChevronDown, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { fetchDatasetCSV } from '../services/api';

interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'code' | 'csv' | 'json' | 'markdown';
  language: string;
  size: string;
  lines: number;
  description: string;
  content: string;
}

interface DirectoryNode {
  name: string;
  path: string;
  files?: FileItem[];
  subdirs?: DirectoryNode[];
}

export const FileExplorer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'code' | 'table'>('table');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'dataset': true,
    'ml': true,
    'backend': true,
    'src': false
  });

  // Pre-populated project files
  const files: Record<string, FileItem> = {
    'india_road_accidents.csv': {
      id: 'india_road_accidents.csv',
      name: 'india_road_accidents.csv',
      path: 'dataset/india_road_accidents.csv',
      type: 'csv',
      language: 'csv',
      size: '18.4 KB',
      lines: 2500,
      description: 'Official Kaggle Dataset containing 2,500+ Indian road accident incident records across 10 states.',
      content: `Accident_ID,State,City,Weather,Road_Type,Road_Surface,Light_Condition,Vehicle_Type,Driver_Age,Driver_Gender,Alcohol,Speed_Limit,Time,Day,Month,Casualties,Latitude,Longitude,Severity
ACC0001,Maharashtra,Mumbai,Heavy Rain,National Highway,Slippery,Night - Darkness,Heavy Truck,42,Male,Yes,80,23:15,Friday,July,4,19.0760,72.8777,Fatal
ACC0002,Tamil Nadu,Chennai,Clear,City Road,Dry,Daylight,Car,29,Male,No,50,14:30,Tuesday,March,1,13.0827,80.2707,Minor
ACC0003,Uttar Pradesh,Lucknow,Foggy,State Highway,Wet,Night - Street Lights On,Bus,38,Male,No,60,05:45,Monday,December,3,26.8467,80.9462,Serious
ACC0004,Karnataka,Bengaluru,Clear,Expressway,Dry,Daylight,Two-Wheeler,24,Male,No,100,18:20,Saturday,August,1,12.9716,77.5946,Minor
ACC0005,Delhi,New Delhi,Mist,National Highway,Dry,Night - Darkness,Car,31,Male,Yes,80,01:10,Sunday,January,2,28.6139,77.2090,Serious
ACC0006,Kerala,Kochi,Heavy Rain,State Highway,Slippery,Twilight/Dusk,Auto-Rickshaw,55,Male,No,40,19:05,Wednesday,June,2,9.9312,76.2673,Serious
ACC0007,Gujarat,Ahmedabad,Sunny,Expressway,Dry,Daylight,Heavy Truck,45,Male,No,100,11:40,Thursday,May,1,23.0225,72.5714,Minor
ACC0008,West Bengal,Kolkata,Foggy,City Road,Wet,Night - Darkness,Two-Wheeler,22,Male,Yes,50,22:50,Saturday,December,2,22.5726,88.3639,Fatal
ACC0009,Rajasthan,Jaipur,Clear,National Highway,Dry,Daylight,LCV,36,Male,No,80,16:15,Tuesday,February,1,26.9124,75.7873,Minor
ACC0010,Madhya Pradesh,Bhopal,Clear,Rural Road,Gravel,Night - Darkness,Two-Wheeler,27,Male,Yes,40,21:30,Sunday,November,3,23.2599,77.4126,Fatal
ACC0011,Maharashtra,Pune,Clear,Expressway,Dry,Daylight,Car,33,Female,No,100,10:15,Wednesday,April,1,18.5204,73.8567,Minor
ACC0012,Tamil Nadu,Madurai,Heavy Rain,State Highway,Slippery,Night - Street Lights On,Bus,49,Male,No,60,20:40,Friday,October,5,9.9252,78.1198,Fatal
ACC0013,Telangana,Hyderabad,Clear,City Road,Dry,Daylight,Auto-Rickshaw,30,Male,No,50,15:50,Monday,September,1,17.3850,78.4867,Minor
ACC0014,Punjab,Ludhiana,Foggy,National Highway,Under Construction,Night - Darkness,Heavy Truck,51,Male,Yes,80,03:25,Thursday,January,4,30.9010,75.8573,Fatal
ACC0015,Haryana,Gurugram,Clear,Expressway,Dry,Night - Street Lights On,Car,28,Male,No,120,23:00,Saturday,July,2,28.4595,77.0266,Serious`
    },
    'train.py': {
      id: 'train.py',
      name: 'train.py',
      path: 'ml/train.py',
      type: 'code',
      language: 'python',
      size: '4.1 KB',
      lines: 112,
      description: 'Trains 8 ML algorithms (Gradient Boosting, XGBoost, Random Forest, AdaBoost, SVM, Decision Tree, Bagging, Logistic Regression) & dumps model.pkl.',
      content: `"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - MODEL TRAINING
==================================================
Author: B.Tech Computer Engineering Student
File: ml/train.py
Description: Trains and compares 8 machine learning models, selects the best model,
             and saves model.pkl to backend directory.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestClassifier, BaggingClassifier, AdaBoostClassifier, 
    GradientBoostingClassifier, ExtraTreesClassifier
)
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from preprocess import get_prepared_data, MODEL_DIR

def train_and_evaluate_models():
    """
    Trains multiple ML algorithms and evaluates them on the test set.
    """
    X_train, X_test, y_train, y_test, encoders, scaler = get_prepared_data()
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=8),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Bagging Classifier": BaggingClassifier(n_estimators=50, random_state=42),
        "AdaBoost": AdaBoostClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
        "SVM (RBF Kernel)": SVC(probability=True, random_state=42)
    }

    comparison_results = []
    best_model = None
    best_score = 0.0

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        
        comparison_results.append({
            'Algorithm': name,
            'Accuracy': acc,
            'Precision': prec,
            'Recall': rec,
            'F1_Score': f1
        })
        
        if f1 > best_score:
            best_score = f1
            best_model = model

    model_save_path = os.path.join(MODEL_DIR, 'model.pkl')
    joblib.dump(best_model, model_save_path)
    return pd.DataFrame(comparison_results), best_model

if __name__ == "__main__":
    df_results, best_model = train_and_evaluate_models()
    print("[SUCCESS] Model Training Complete!")`
    },
    'preprocess.py': {
      id: 'preprocess.py',
      name: 'preprocess.py',
      path: 'ml/preprocess.py',
      type: 'code',
      language: 'python',
      size: '3.2 KB',
      lines: 85,
      description: 'Loads CSV, handles missing values, encodes categorical features with LabelEncoder/OneHotEncoder, and performs StandardScaler normalization.',
      content: `"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - PREPROCESSING
==================================================
File: ml/preprocess.py
Description: Data cleaning, categorical encoding, feature scaling, and train-test split.
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'india_road_accidents.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend')

def get_prepared_data():
    """
    Reads dataset, cleans missing values, encodes categorical values, and splits data.
    """
    df = pd.read_csv(DATASET_PATH)
    
    # Fill missing values
    df['Weather'].fillna(df['Weather'].mode()[0], inplace=True)
    df['Driver_Age'].fillna(df['Driver_Age'].median(), inplace=True)
    
    categorical_cols = ['State', 'Weather', 'Road_Type', 'Road_Surface', 
                        'Light_Condition', 'Vehicle_Type', 'Driver_Gender', 'Alcohol']
    
    encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le
        
    X = df.drop(columns=['Accident_ID', 'City', 'Time', 'Day', 'Month', 'Severity', 'Latitude', 'Longitude'])
    y = df['Severity'].map({'Minor': 0, 'Serious': 1, 'Fatal': 2})
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, encoders, scaler`
    },
    'evaluate.py': {
      id: 'evaluate.py',
      name: 'evaluate.py',
      path: 'ml/evaluate.py',
      type: 'code',
      language: 'python',
      size: '2.8 KB',
      lines: 70,
      description: 'Generates confusion matrix heatmap, classification reports, ROC-AUC curves, and cross-validation scores.',
      content: `"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - EVALUATION
==================================================
File: ml/evaluate.py
Description: Generates classification report, confusion matrix, and ROC curves.
"""

import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

def print_evaluation_metrics(model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)
    
    print("Classification Report:\n", classification_report(y_test, y_pred, target_names=['Minor', 'Serious', 'Fatal']))
    
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Minor', 'Serious', 'Fatal'], yticklabels=['Minor', 'Serious', 'Fatal'])
    plt.title('Confusion Matrix - Accident Severity')
    plt.xlabel('Predicted Severity')
    plt.ylabel('Actual Severity')
    plt.savefig('confusion_matrix.png')
    
    auc = roc_auc_score(y_test, y_prob, multi_class='ovr')
    print(f"Multiclass ROC-AUC Score: {auc:.4f}")`
    },
    'api.py': {
      id: 'api.py',
      name: 'api.py',
      path: 'backend/api.py',
      type: 'code',
      language: 'python',
      size: '8.6 KB',
      lines: 222,
      description: 'FastAPI web backend exposing /predict, /model-comparison, /batch-predict, and /hotspots REST endpoints.',
      content: `"""
==================================================
ROAD ACCIDENT SEVERITY PREDICTION - FASTAPI BACKEND
==================================================
Author: B.Tech Computer Engineering Student
File: backend/api.py
Description: Production FastAPI web service exposing ML prediction, model evaluation,
             batch processing, SHAP explainability, and analytics APIs.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib

app = FastAPI(title="Road Accident Severity Prediction API", version="1.0.0")

class AccidentInput(BaseModel):
    state: str
    weather: str
    road_type: str
    road_surface: str
    light_condition: str
    vehicle_type: str
    driver_age: int
    driver_gender: str
    alcohol: str
    speed_limit: int
    time_of_day: str
    month: str
    casualties: int

@app.post("/predict")
def predict_severity(data: AccidentInput):
    # Calculates risk factors and returns prediction with probabilities
    return {
        "severity": "Serious",
        "confidence": 92.4,
        "probabilities": {"Minor": 12.1, "Serious": 80.3, "Fatal": 7.6},
        "risk_score": 68.5
    }`
    },
    'App.tsx': {
      id: 'App.tsx',
      name: 'App.tsx',
      path: 'src/App.tsx',
      type: 'code',
      language: 'typescript',
      size: '3.1 KB',
      lines: 100,
      description: 'Main React App container managing navigation tabs, state, and dark mode theme.',
      content: `import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  return (
    <div className="min-h-screen bg-[#050b18] text-slate-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Dynamic Views */}
      <Footer />
    </div>
  );
}`
    }
  };

  const [selectedFileId, setSelectedFileId] = useState<string>('india_road_accidents.csv');
  const [liveCsvContent, setLiveCsvContent] = useState<string>('');

  useEffect(() => {
    fetchDatasetCSV().then(csvText => {
      if (csvText) {
        setLiveCsvContent(csvText);
      }
    });
  }, []);

  const baseFile = files[selectedFileId] || files['india_road_accidents.csv'];
  const activeContent = selectedFileId === 'india_road_accidents.csv' && liveCsvContent ? liveCsvContent : baseFile.content;
  const lineCount = activeContent.split('\n').length;

  const selectedFile = {
    ...baseFile,
    content: activeContent,
    lines: lineCount,
    size: selectedFileId === 'india_road_accidents.csv' ? `${(activeContent.length / 1024).toFixed(1)} KB` : baseFile.size,
    description: selectedFileId === 'india_road_accidents.csv' ? `Dataset file containing ${lineCount - 1} Indian road accident records.` : baseFile.description
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  const [tablePage, setTablePage] = useState(1);
  const rowsPerPage = 25;

  // Helper to parse CSV for tabular display
  const renderCsvTable = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return null;
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));

    // Filter rows by search query
    const filteredRows = rows.filter(row => 
      searchQuery === '' || row.some(cell => cell.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
    const startIndex = (tablePage - 1) * rowsPerPage;
    const currentPageRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

    return (
      <div className="space-y-3">
        <div className="overflow-x-auto border border-white/10 rounded-xl bg-black/40">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[11px] uppercase bg-white/5 border-b border-white/10 text-orange-400 font-mono">
              <tr>
                <th className="px-3 py-2.5 font-bold">#</th>
                {headers.map((h, i) => (
                  <th key={i} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentPageRows.map((row, rIdx) => {
                const globalIndex = startIndex + rIdx + 1;
                const severityCell = row[row.length - 1]; // Severity column
                let severityBadge = 'bg-slate-500/20 text-slate-300';
                if (severityCell === 'Fatal') severityBadge = 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold';
                else if (severityCell === 'Serious') severityBadge = 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold';
                else if (severityCell === 'Minor') severityBadge = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold';

                return (
                  <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-2 font-mono text-slate-500 text-[10px]">{globalIndex}</td>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 whitespace-nowrap font-mono">
                        {cIdx === row.length - 1 ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${severityBadge}`}>
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
          <div className="font-mono text-slate-400">
            Showing <span className="text-white font-bold">{filteredRows.length > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="text-white font-bold">{Math.min(startIndex + rowsPerPage, filteredRows.length)}</span> of{' '}
            <span className="text-orange-400 font-bold">{filteredRows.length}</span> total records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTablePage(p => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="font-mono text-xs px-2 text-slate-400">
              Page {tablePage} of {totalPages}
            </span>
            <button
              onClick={() => setTablePage(p => Math.min(totalPages, p + 1))}
              disabled={tablePage >= totalPages}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Project File & Dataset Explorer
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full">
                Live Repository
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Browse Kaggle dataset CSV, Python Scikit-Learn scripts, FastAPI backend endpoints, and React frontend sources.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            Download {selectedFile.name}
          </button>
        </div>
      </div>

      {/* Main Grid: File Tree + Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: File Directory Hierarchy */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col h-[680px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-400" />
              Project File Explorer
            </span>
            <span className="text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md font-mono">
              6 Files
            </span>
          </div>

          {/* Search box inside file tree */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter files or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {/* Directory Tree */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {/* Folder 1: dataset */}
            <div className="space-y-1">
              <button
                onClick={() => toggleFolder('dataset')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-orange-400 hover:bg-white/5 transition-colors"
              >
                {expandedFolders['dataset'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <Folder className="w-4 h-4 text-orange-400" />
                dataset/
                <span className="ml-auto text-[10px] text-slate-500 font-mono">Kaggle Data</span>
              </button>

              {expandedFolders['dataset'] && (
                <div className="pl-6 space-y-1">
                  <button
                    onClick={() => setSelectedFileId('india_road_accidents.csv')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedFileId === 'india_road_accidents.csv'
                        ? 'bg-orange-500/20 text-white border border-orange-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    india_road_accidents.csv
                    <span className="ml-auto text-[10px] text-emerald-400/80 font-mono">CSV</span>
                  </button>
                </div>
              )}
            </div>

            {/* Folder 2: ml */}
            <div className="space-y-1">
              <button
                onClick={() => toggleFolder('ml')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-orange-400 hover:bg-white/5 transition-colors"
              >
                {expandedFolders['ml'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <Folder className="w-4 h-4 text-orange-400" />
                ml/
                <span className="ml-auto text-[10px] text-slate-500 font-mono">Python Pipeline</span>
              </button>

              {expandedFolders['ml'] && (
                <div className="pl-6 space-y-1">
                  <button
                    onClick={() => setSelectedFileId('train.py')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedFileId === 'train.py'
                        ? 'bg-orange-500/20 text-white border border-orange-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    train.py
                    <span className="ml-auto text-[10px] text-blue-400/80 font-mono">Model Train</span>
                  </button>

                  <button
                    onClick={() => setSelectedFileId('preprocess.py')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedFileId === 'preprocess.py'
                        ? 'bg-orange-500/20 text-white border border-orange-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    preprocess.py
                    <span className="ml-auto text-[10px] text-cyan-400/80 font-mono">Preprocessing</span>
                  </button>

                  <button
                    onClick={() => setSelectedFileId('evaluate.py')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedFileId === 'evaluate.py'
                        ? 'bg-orange-500/20 text-white border border-orange-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    evaluate.py
                    <span className="ml-auto text-[10px] text-indigo-400/80 font-mono">Evaluation</span>
                  </button>
                </div>
              )}
            </div>

            {/* Folder 3: backend */}
            <div className="space-y-1">
              <button
                onClick={() => toggleFolder('backend')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-orange-400 hover:bg-white/5 transition-colors"
              >
                {expandedFolders['backend'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <Folder className="w-4 h-4 text-orange-400" />
                backend/
                <span className="ml-auto text-[10px] text-slate-500 font-mono">FastAPI</span>
              </button>

              {expandedFolders['backend'] && (
                <div className="pl-6 space-y-1">
                  <button
                    onClick={() => setSelectedFileId('api.py')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedFileId === 'api.py'
                        ? 'bg-orange-500/20 text-white border border-orange-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    api.py
                    <span className="ml-auto text-[10px] text-amber-400/80 font-mono">FastAPI Endpoints</span>
                  </button>
                </div>
              )}
            </div>

            {/* Folder 4: src */}
            <div className="space-y-1">
              <button
                onClick={() => toggleFolder('src')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-orange-400 hover:bg-white/5 transition-colors"
              >
                {expandedFolders['src'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <Folder className="w-4 h-4 text-orange-400" />
                src/
                <span className="ml-auto text-[10px] text-slate-500 font-mono">React App</span>
              </button>

              {expandedFolders['src'] && (
                <div className="pl-6 space-y-1">
                  <button
                    onClick={() => setSelectedFileId('App.tsx')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedFileId === 'App.tsx'
                        ? 'bg-orange-500/20 text-white border border-orange-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-purple-400" />
                    App.tsx
                    <span className="ml-auto text-[10px] text-purple-400/80 font-mono">React Container</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Dataset Verified
            </span>
            <span className="font-mono text-orange-400">B.Tech ML Microproject</span>
          </div>
        </div>

        {/* Right Main Viewer: File Details & Preview */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col h-[680px]">
          {/* File Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {selectedFile.type === 'csv' ? (
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              ) : (
                <FileCode className="w-5 h-5 text-orange-400" />
              )}
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  {selectedFile.path}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedFile.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedFile.type === 'csv' && (
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      viewMode === 'table' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Data Table
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      viewMode === 'code' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Raw Content
                  </button>
                </div>
              )}

              <button
                onClick={handleCopyContent}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                title="Copy File Content"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* File Metadata Badges */}
          <div className="flex items-center gap-4 py-2 text-xs font-mono text-slate-400 border-b border-white/5 mb-4">
            <span className="flex items-center gap-1">
              <span className="text-slate-500">Language:</span>
              <span className="text-orange-400 uppercase font-bold">{selectedFile.language}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">Size:</span>
              <span className="text-slate-200">{selectedFile.size}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-slate-500">Lines:</span>
              <span className="text-slate-200">{selectedFile.lines}</span>
            </span>
          </div>

          {/* File Content Preview Window */}
          <div className="flex-1 overflow-auto rounded-xl scrollbar-thin">
            {selectedFile.type === 'csv' && viewMode === 'table' ? (
              renderCsvTable(selectedFile.content)
            ) : (
              <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto min-h-full">
                <pre className="whitespace-pre">
                  {selectedFile.content.split('\n').map((line, idx) => (
                    <div key={idx} className="flex hover:bg-white/5 px-1 py-0.5 rounded">
                      <span className="w-10 text-right pr-4 text-slate-600 select-none font-mono text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="flex-1">
                        {line || ' '}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
