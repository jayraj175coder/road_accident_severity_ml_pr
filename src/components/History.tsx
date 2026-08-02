import React from 'react';
import { History, ShieldAlert, FileText, Trash2, Calendar } from 'lucide-react';
import { PredictionResult } from '../types';
import { generatePredictionPDF } from '../utils/pdfExport';

interface HistoryProps {
  history: PredictionResult[];
  onClearHistory: () => void;
  onSelectResult: (result: PredictionResult) => void;
}

export const HistoryView: React.FC<HistoryProps> = ({ history, onClearHistory, onSelectResult }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
            <History className="w-3.5 h-3.5" />
            <span>SESSION PREDICTION LOGS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Prediction History
          </h2>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History Logs</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">No Predictions Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Run an accident severity prediction on the Prediction page to record results in your session history log.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange-500/50 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    item.severity === 'Fatal' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    item.severity === 'Serious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.severity} Severity
                  </span>
                  <span className="text-xs font-extrabold text-white font-mono">
                    {item.confidence}% Confidence
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.timestamp || Date.now()).toLocaleString()}</span>
                  {item.input_data && (
                    <span>• {item.input_data.state} ({item.input_data.road_type})</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectResult(item)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => generatePredictionPDF(item)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
