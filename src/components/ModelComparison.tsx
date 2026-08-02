import React, { useEffect, useState } from 'react';
import { Activity, Award, CheckCircle2, Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import { ModelComparisonItem, ModelInfo } from '../types';
import { fetchEvaluationArtifacts, fetchModelComparison, fetchModelInfo } from '../services/api';

export const ModelComparison: React.FC = () => {
  const [models, setModels] = useState<ModelComparisonItem[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchModelComparison(), fetchModelInfo(), fetchEvaluationArtifacts()]).then(([comp, info, evalData]) => {
      setModels(comp);
      setModelInfo(info);
      setEvaluation(evalData);
      setLoading(false);
    });
  }, []);

  if (loading || !modelInfo || !evaluation) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Model Comparison Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5" />
          <span>BENCHMARKING & ALGORITHM SELECTION</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Machine Learning Model Leaderboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Comparative analysis of 8 classification algorithms trained and validated on the 80/20 split India Road Accident Dataset.
        </p>
      </div>

      {/* Best Model Winner Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-orange-500/30 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-orange-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>TOP PERFORMING ALGORITHM</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">{modelInfo.algorithm}</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Selected automatically based on highest Weighted F1-Score ({modelInfo.f1_score}) and 5-Fold Cross-Validation score ({modelInfo.cross_val_score}).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-[240px]">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</div>
            <div className="text-xl font-black text-orange-400">{(modelInfo.accuracy * 100).toFixed(1)}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">F1 Score</div>
            <div className="text-xl font-black text-amber-400">{(modelInfo.f1_score * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Comparison Leaderboard Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>Model Comparison Leaderboard</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Weighted Test Metrics (80/20 Split)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-3 font-bold">Algorithm Name</th>
                <th className="pb-3 font-bold">Accuracy</th>
                <th className="pb-3 font-bold">Precision</th>
                <th className="pb-3 font-bold">Recall</th>
                <th className="pb-3 font-bold">F1 Score</th>
                <th className="pb-3 font-bold">Train Time</th>
                <th className="pb-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {models.map((m, idx) => (
                <tr 
                  key={idx} 
                  className={`hover:bg-white/5 transition-colors ${
                    m.is_best ? 'bg-orange-500/10 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    {m.algorithm}
                    {m.is_best && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500 text-white uppercase shadow-sm">
                        BEST
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-slate-200">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-3.5 font-mono text-slate-400">{(m.precision * 100).toFixed(1)}%</td>
                  <td className="py-3.5 font-mono text-slate-400">{(m.recall * 100).toFixed(1)}%</td>
                  <td className="py-3.5 font-mono font-bold text-orange-400">{(m.f1_score * 100).toFixed(1)}%</td>
                  <td className="py-3.5 font-mono text-slate-400">{m.train_time_ms} ms</td>
                  <td className="py-3.5 text-right">
                    {m.is_best ? (
                      <span className="inline-flex items-center gap-1 text-orange-400 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>Generated ROC-AUC Curves</span>
          </h3>
          <div className="rounded-2xl overflow-hidden bg-white border border-white/10">
            <img src={evaluation.images.roc_curve} alt="ROC Curve" className="w-full h-auto object-contain" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Generated Confusion Matrix</span>
          </h3>
          <div className="rounded-2xl overflow-hidden bg-white border border-white/10">
            <img src={evaluation.images.confusion_matrix} alt="Confusion Matrix" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};
