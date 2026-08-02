import React, { useEffect, useState } from 'react';
import { FileText, Image, ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react';
import { fetchEvaluationArtifacts } from '../services/api';

export const EvaluationPage: React.FC = () => {
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluationArtifacts().then((data) => {
      setEvaluation(data);
      setLoading(false);
    });
  }, []);

  if (loading || !evaluation) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Model Evaluation Artifacts...</p>
      </div>
    );
  }

  const artifactCards = [
    { title: 'Confusion Matrix', icon: ShieldCheck, src: evaluation.images.confusion_matrix },
    { title: 'ROC Curve', icon: TrendingUp, src: evaluation.images.roc_curve },
    { title: 'Feature Importance', icon: BarChart3, src: evaluation.images.feature_importance },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <Image className="w-3.5 h-3.5" />
          <span>MODEL DIAGNOSTICS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Evaluation Artifacts</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Generated confusion matrix, classification report, ROC curve, and feature-importance evidence from the latest training run.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {artifactCards.map((artifact) => {
          const Icon = artifact.icon;
          return (
            <div key={artifact.title} className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-4 h-4 text-orange-400" />
                <span>{artifact.title}</span>
              </h3>
              <div className="rounded-2xl overflow-hidden bg-white border border-white/10">
                <img src={artifact.src} alt={artifact.title} className="w-full h-auto object-contain" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400" />
          <span>Classification Report</span>
        </h3>
        <pre className="overflow-x-auto rounded-2xl bg-black/50 border border-white/10 p-4 text-xs leading-6 text-slate-200 font-mono">
          {evaluation.classification_report}
        </pre>
      </div>
    </div>
  );
};
