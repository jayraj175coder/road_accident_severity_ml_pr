import React from 'react';
import { ShieldAlert, Cpu, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40 backdrop-blur-xl text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white">
                RoadGuard AI - Severity Prediction Engine
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Developed as a third-year B.Tech Computer Engineering Machine Learning Microproject.
              Leverages Scikit-Learn ensembles, SHAP feature attributions, PCA/LDA projections, and DBSCAN spatial clustering on Indian road traffic datasets.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Technical Stack</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-orange-400" /> Python 3.10 & Scikit-Learn</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-orange-400" /> FastAPI & Express Server</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-orange-400" /> React 19, Vite & Tailwind CSS</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-orange-400" /> Recharts & Leaflet Maps</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Academic Project</h4>
            <p className="text-slate-400 mb-2">
              Department of Computer Engineering
            </p>
            <p className="font-medium text-slate-300">
              Kaggle Dataset: India Road Accident Dataset
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-orange-400 font-medium hover:underline cursor-pointer">
              <span>View GitHub Microproject Repo</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500">
            © 2026 RoadGuard AI Microproject. Built for Academic & Engineering Excellence.
          </p>
          <p className="flex items-center gap-1 text-slate-500">
            Designed with <Heart className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> for Indian Road Safety
          </p>
        </div>
      </div>
    </footer>
  );
};
