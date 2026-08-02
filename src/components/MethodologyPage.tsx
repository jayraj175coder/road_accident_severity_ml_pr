import React from 'react';
import { ArrowDown, Database, Filter, BarChart3, Wrench, Tags, SlidersHorizontal, SplitSquareVertical, Brain, BadgeCheck, Trophy, Server } from 'lucide-react';

const steps = [
  { title: 'Dataset', icon: Database, text: 'Road accident records are loaded from the project CSV dataset.' },
  { title: 'Data Cleaning', icon: Filter, text: 'Duplicates are removed and missing numeric or categorical values are imputed.' },
  { title: 'EDA', icon: BarChart3, text: 'Severity, weather, vehicle, location, and trend patterns are analyzed.' },
  { title: 'Feature Engineering', icon: Wrench, text: 'Relevant accident, road, driver, and environment features are selected.' },
  { title: 'Encoding', icon: Tags, text: 'Categorical values are transformed with saved LabelEncoders.' },
  { title: 'Scaling', icon: SlidersHorizontal, text: 'The final feature matrix is standardized with a saved StandardScaler.' },
  { title: 'Train Test Split', icon: SplitSquareVertical, text: 'Data is split with stratification to preserve target-class balance.' },
  { title: 'Model Training', icon: Brain, text: 'Eight supervised classifiers are trained and benchmarked.' },
  { title: 'Model Evaluation', icon: BadgeCheck, text: 'Accuracy, precision, recall, F1, report, ROC, and confusion matrix are generated.' },
  { title: 'Best Model', icon: Trophy, text: 'The highest weighted F1 model is persisted as model.pkl.' },
  { title: 'Deployment', icon: Server, text: 'The web API loads model.pkl, encoder.pkl, and scaler.pkl for live inference.' },
];

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <Brain className="w-3.5 h-3.5" />
          <span>ML WORKFLOW</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Project Methodology</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          End-to-end pipeline followed to convert raw accident records into a deployed severity prediction model.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.title}>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-white font-black text-sm uppercase tracking-widest">{step.title}</div>
                  <p className="text-xs text-slate-400 mt-1">{step.text}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center text-orange-400/70">
                  <ArrowDown className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
