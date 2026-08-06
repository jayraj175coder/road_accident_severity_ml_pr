import React from 'react';
import { 
  ShieldAlert, Sparkles, ArrowRight, Activity, Zap, 
  MapPin, CheckCircle2, AlertTriangle, TrendingUp, Cpu
} from 'lucide-react';
import { ROAD_SAFETY_FACTS } from '../data/mockData';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl p-8 sm:p-12 md:p-16 border border-white/10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED ROAD SAFETY ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Road Accident Severity Prediction using <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-400">Machine Learning</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Instant predictive classification into <strong className="text-emerald-400">Minor</strong>, <strong className="text-orange-400">Serious</strong>, or <strong className="text-red-400">Fatal</strong> severity levels based on weather, highway geometry, driver demographics, vehicle mass, and speed parameters across Indian roads.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>RUN ML PREDICTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Activity className="w-4 h-4 text-orange-400" />
              <span>Explore Analytics</span>
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-orange-500/50 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">94.8%</div>
          <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">Model Accuracy</div>
          <p className="text-xs text-slate-400 mt-2">XGBoost & Gradient Boosting Classifier ensemble optimization.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-amber-500/50 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">8 Models</div>
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-1">Algorithms Benchmarked</div>
          <p className="text-xs text-slate-400 mt-2">Evaluated against Random Forest, XGBoost, Decision Trees & SVM.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-red-500/50 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">3 Classes</div>
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">Severity Levels</div>
          <p className="text-xs text-slate-400 mt-2">Classified into Minor, Serious, or Fatal crash outcomes.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm hover:border-blue-500/50 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">12+ Hotspots</div>
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">DBSCAN Spatial Clusters</div>
          <p className="text-xs text-slate-400 mt-2">Geographical density spatial clustering on Indian highways.</p>
        </div>
      </section>

      {/* Why AI Prediction */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
            PROACTIVE SAFETY PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why Machine Learning in Road Safety?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Traditional accident reporting is reactive. Machine Learning enables real-time severity forecasting to optimize emergency triage and highway infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">01</div>
            <h3 className="font-bold text-white text-base">Emergency Response Triage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides emergency dispatchers with immediate confidence scores on crash severity, prioritizing trauma team deployments for high-risk fatal predictions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">02</div>
            <h3 className="font-bold text-white text-base">Highway Blackspot Mitigation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              DBSCAN spatial clustering highlights recurring blackspots on national expressways, enabling traffic police to install speed governors and warning signs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">03</div>
            <h3 className="font-bold text-white text-base">SHAP Model Explainability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilizes SHAP values to explain <em className="not-italic text-white font-semibold">why</em> an accident scenario carries high risk (e.g. night speed + rain + alcohol), ensuring transparent decision-making.
            </p>
          </div>
        </div>
      </section>
      {/* Real World Applications */}
<section className="space-y-6">
  <div className="text-center max-w-2xl mx-auto">
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
      REAL-WORLD APPLICATIONS
    </span>

    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
      Where Can This AI System Be Used?
    </h2>

    <p className="text-sm text-slate-400 mt-2">
      Our machine learning model supports faster decisions for road safety,
      emergency response, and traffic management.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

    <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
      <ShieldAlert className="w-8 h-8 text-red-400 mb-3" />
      <h3 className="font-bold text-white">Emergency Response</h3>
      <p className="text-xs text-slate-400 mt-2">
        Predict accident severity to help ambulance and hospitals respond faster.
      </p>
    </div>

    <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
      <MapPin className="w-8 h-8 text-blue-400 mb-3" />
      <h3 className="font-bold text-white">Accident Hotspots</h3>
      <p className="text-xs text-slate-400 mt-2">
        Identify high-risk locations for better road planning and safety measures.
      </p>
    </div>

    <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
      <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
      <h3 className="font-bold text-white">Driver Safety</h3>
      <p className="text-xs text-slate-400 mt-2">
        Alert drivers about dangerous conditions using AI-powered risk prediction.
      </p>
    </div>

    <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
      <CheckCircle2 className="w-8 h-8 text-orange-400 mb-3" />
      <h3 className="font-bold text-white">Insurance Analysis</h3>
      <p className="text-xs text-slate-400 mt-2">
        Assist insurers in faster claim assessment and accident risk analysis.
      </p>
    </div>

  </div>
</section>

      {/* Facts & Stats */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Indian Road Safety Key Insights</h3>
            <p className="text-xs text-slate-400">Statistical insights derived from Ministry of Road Transport & Highways (MoRTH) data.</p>
          </div>
          <button
            onClick={() => onNavigate('model-comparison')}
            className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            <span>View Algorithm Comparison Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROAD_SAFETY_FACTS.map((fact, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="text-2xl font-black text-orange-400">{fact.stat}</div>
              <div className="font-bold text-white text-xs">{fact.title}</div>
              <p className="text-[11px] text-slate-400 leading-normal">{fact.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
