import React from 'react';
import { Info, Cpu, Layers, GitBranch, Database, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <Info className="w-3.5 h-3.5" />
          <span>ACADEMIC DOCUMENTATION</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          B.Tech Microproject Documentation
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          "Road Accident Severity Prediction using Machine Learning" — A full-stack engineering microproject designed for Computer Engineering curricula.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-6">
        <h3 className="font-extrabold text-white text-base flex items-center gap-2">
          <Cpu className="w-5 h-5 text-orange-400" />
          <span>Project Abstract & Objectives</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Road traffic accidents present a critical public health and economic challenge in India. This project presents an end-to-end Machine Learning pipeline trained on the Kaggle <strong className="text-white">India Road Accident Dataset</strong> to predict crash severity levels (<strong className="text-emerald-400">Minor</strong>, <strong className="text-amber-400">Serious</strong>, <strong className="text-red-400">Fatal</strong>). The application combines automated model training, 8-algorithm evaluation, SHAP explainability, spatial DBSCAN clustering, and an interactive web interface.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Target Column</h4>
            <p className="text-xs text-slate-400">
              <strong className="text-orange-400">Severity</strong> — Categorical label with 3 target classes (Minor, Serious, Fatal).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">Evaluation Methodology</h4>
            <p className="text-xs text-slate-400">
              80/20 Stratified Train/Test split with 5-Fold Cross Validation and Weighted F1-Score benchmarking.
            </p>
          </div>
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-white shadow-xl space-y-6">
        <h3 className="font-extrabold text-base flex items-center gap-2 text-white">
          <GitBranch className="w-5 h-5 text-orange-400" />
          <span>System Architecture & Pipeline Flow</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs">1</div>
            <div className="font-bold text-white text-xs">Data Preprocessing</div>
            <p className="text-slate-400 text-[11px]">
              Missing value imputation, duplicate removal, LabelEncoding, and StandardScaler normalization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs">2</div>
            <div className="font-bold text-white text-xs">Model Comparison</div>
            <p className="text-slate-400 text-[11px]">
              Train 8 ML classifiers: Random Forest, Gradient Boosting, XGBoost, AdaBoost, SVM, Decision Tree, Bagging, Logistic Regression.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs">3</div>
            <div className="font-bold text-white text-xs">FastAPI / Express API</div>
            <p className="text-slate-400 text-[11px]">
              RESTful backend serving <code className="text-orange-400">/predict</code>, <code className="text-orange-400">/model-info</code>, SHAP explanations, and batch predictions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs">4</div>
            <div className="font-bold text-white text-xs">React UI & Map</div>
            <p className="text-slate-400 text-[11px]">
              Responsive glassmorphism dashboard with Recharts, Leaflet hotspots map, and PDF report generator.
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Methodologies */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-6">
        <h3 className="font-extrabold text-white text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-orange-400" />
          <span>Advanced Analytics & Dimensionality Reduction</span>
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <h4 className="font-bold text-white">Principal Component Analysis (PCA)</h4>
            <p className="text-slate-400 text-xs">
              Linear dimensionality reduction transforming 12 correlated accident features into orthogonal 2D principal components (PC1 vs PC2) for scatter visualization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <h4 className="font-bold text-white">Linear Discriminant Analysis (LDA)</h4>
            <p className="text-slate-400 text-xs">
              Supervised dimension reduction maximizing class separability between Minor, Serious, and Fatal categories in feature space.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <h4 className="font-bold text-white">DBSCAN Spatial Clustering</h4>
            <p className="text-slate-400 text-xs">
              Density-Based Spatial Clustering of Applications with Noise grouping geographical latitude/longitude coordinates to identify high-vulnerability accident corridors and highway blackspots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
