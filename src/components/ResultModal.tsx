import React from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, FileText, 
  RotateCcw, Sparkles, PhoneCall, Gauge, TrendingUp, Info 
} from 'lucide-react';
import { PredictionResult } from '../types';
import { generatePredictionPDF } from '../utils/pdfExport';

interface ResultModalProps {
  result: PredictionResult;
  onReset: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onReset }) => {
  const isFatal = result.severity === 'Fatal';
  const isSerious = result.severity === 'Serious';

  const severityBadgeClass = isFatal
    ? 'bg-red-500/10 text-red-500 border-red-500/30'
    : isSerious
    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';

  const severityBg = isFatal
    ? 'bg-red-500'
    : isSerious
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <div className={`p-8 rounded-3xl border shadow-xl text-white relative overflow-hidden ${
        isFatal ? 'bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-red-800/50' :
        isSerious ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-amber-800/50' :
        'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-emerald-800/50'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${severityBadgeClass}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>PREDICTED ACCIDENT SEVERITY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center gap-3">
              <span>{result.severity} Severity</span>
              {isFatal && <span className="w-4 h-4 rounded-full bg-red-500 animate-ping inline-block" />}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm">
              Predicted with <strong className="text-white font-extrabold">{result.confidence}%</strong> model confidence using Gradient Boosting Ensemble logic.
            </p>
          </div>

          {/* Risk Meter Display */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 min-w-[200px] text-center space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Score Meter</div>
            <div className="text-3xl font-black text-white">{result.risk_score}<span className="text-xs text-slate-400">/100</span></div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${severityBg} transition-all duration-1000`} 
                style={{ width: `${result.risk_score}%` }} 
              />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {result.risk_score > 65 ? 'High Hazard Critical Risk' : result.risk_score > 35 ? 'Moderate Hazard Risk' : 'Low Hazard Risk'}
            </div>
          </div>
        </div>
      </div>

      {/* Class Probability Distribution */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Gauge className="w-4 h-4 text-orange-400" />
            <span>Class Probability Distribution</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Normalized Classifier Output</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400">Minor Severity</span>
              <span className="text-sm font-black text-emerald-300">{result.probabilities.Minor}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-950/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${result.probabilities.Minor}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400">Serious Severity</span>
              <span className="text-sm font-black text-amber-300">{result.probabilities.Serious}%</span>
            </div>
            <div className="w-full h-2 bg-amber-950/50 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${result.probabilities.Serious}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-red-400">Fatal Severity</span>
              <span className="text-sm font-black text-red-300">{result.probabilities.Fatal}%</span>
            </div>
            <div className="w-full h-2 bg-red-950/50 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${result.probabilities.Fatal}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>SHAP Model Explainability Attribution</span>
          </h3>
          <span className="text-xs text-slate-400">Feature Risk Contribution</span>
        </div>

        <div className="space-y-3">
          {result.shap_explanation.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-white">{item.feature}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{item.description}</div>
              </div>
              <div className={`font-mono font-bold px-2.5 py-1 rounded-lg ${
                item.impact > 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {item.impact > 0 ? `+${item.impact}` : item.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Safety Recommendations */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-4">
        <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-orange-400" />
          <span>Recommended Safety & Emergency Actions</span>
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {result.recommendations.map((rec, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze New Accident Scenario</span>
        </button>

        <button
          onClick={() => generatePredictionPDF(result)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span>Download Prediction Report (PDF)</span>
        </button>
      </div>
    </div>
  );
};
