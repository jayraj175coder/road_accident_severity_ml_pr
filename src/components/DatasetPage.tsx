import React, { useEffect, useState } from 'react';
import { Database, ListChecks, AlertTriangle, CopyCheck, Tags, BarChart3 } from 'lucide-react';
import { fetchDatasetSummary } from '../services/api';

export const DatasetPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatasetSummary().then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Dataset Profile...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Rows', value: summary.rows, icon: Database, color: 'text-orange-400' },
    { label: 'Columns', value: summary.columns, icon: ListChecks, color: 'text-sky-400' },
    { label: 'Missing Values', value: summary.missing_values, icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Duplicate Rows', value: summary.duplicate_rows, icon: CopyCheck, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <Database className="w-3.5 h-3.5" />
          <span>DATASET QUALITY PROFILE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Road Accident Dataset</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Automatically generated dataset summary used by the model training pipeline.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <Icon className={`w-5 h-5 ${card.color} mb-3`} />
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{card.label}</div>
              <div className="text-2xl font-black text-white mt-1">{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Tags className="w-4 h-4 text-orange-400" />
            <span>Target Classes</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.target_classes.map((item: string) => (
              <span key={item} className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-slate-200">
                {item}
              </span>
            ))}
          </div>
          <div className="pt-3 text-xs text-slate-400">
            Dataset Source: <span className="text-slate-200 font-semibold">{summary.dataset_source}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <span>Class Distribution</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(summary.class_distribution).map(([label, count]) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>{label}</span>
                  <span>{String(count)}</span>
                </div>
                <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${Math.max(8, (Number(count) / Math.max(1, summary.rows)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
        <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-orange-400" />
          <span>Feature List</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {summary.feature_list.map((feature: string) => (
            <div key={feature} className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 font-semibold">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
