import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Legend, ScatterChart, Scatter, CartesianGrid 
} from 'recharts';
import { BarChart3, TrendingUp, Layers, CloudRain, MapPin, Cpu, Compass } from 'lucide-react';
import { fetchAnalytics, fetchModelInfo } from '../services/api';
import { ModelInfo } from '../types';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchModelInfo()]).then(([analytics, info]) => {
      setData(analytics);
      setModelInfo(info);
      setLoading(false);
    });
  }, []);

  if (loading || !data || !modelInfo) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Recharts Analytics Engine...</p>
      </div>
    );
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>EXPLORATORY DATA ANALYSIS (EDA)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Machine Learning Analytics Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Comprehensive visual analytics derived from the Kaggle India Road Accident Dataset, including feature importances, PCA projections, and spatial DBSCAN clustering.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Accuracy', value: `${(modelInfo.accuracy * 100).toFixed(2)}%` },
          { label: 'Precision', value: `${(modelInfo.precision * 100).toFixed(2)}%` },
          { label: 'Recall', value: `${(modelInfo.recall * 100).toFixed(2)}%` },
          { label: 'F1 Score', value: `${(modelInfo.f1_score * 100).toFixed(2)}%` },
          { label: 'Training Samples', value: modelInfo.training_samples },
          { label: 'Testing Samples', value: modelInfo.test_samples },
        ].map((metric) => (
          <div key={metric.label} className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{metric.label}</div>
            <div className="text-lg font-black text-white mt-1">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-3xl bg-white/5 border border-orange-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Best Algorithm</div>
          <div className="text-xl font-black text-white">{modelInfo.algorithm}</div>
        </div>
        <div className="text-xs text-slate-400">Trained at: <span className="text-slate-200 font-semibold">{modelInfo.trained_at}</span></div>
      </div>

      {/* Grid Row 1: Severity Distribution & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Donut */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <PieChart className="w-4 h-4 text-orange-400" />
            <span>Accident Severity Distribution</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.severity_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.severity_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>Monthly Accident Trend & Fog Index</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="accidents" stroke="#f97316" strokeWidth={3} name="Total Accidents" />
                <Line type="monotone" dataKey="fog_factor" stroke="#38bdf8" strokeWidth={2} name="Fog/Monsoon Severity Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Weather vs Severity & Vehicle Type Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather vs Severity */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-orange-400" />
            <span>Weather Condition vs Severity</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weather_vs_severity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="weather" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="Minor" fill="#10b981" />
                <Bar dataKey="Serious" fill="#f59e0b" />
                <Bar dataKey="Fatal" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Type Analysis */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <span>Vehicle Type Severity Comparison</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.vehicle_analysis} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="type" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="Minor" fill="#10b981" stackId="a" />
                <Bar dataKey="Serious" fill="#f59e0b" stackId="a" />
                <Bar dataKey="Fatal" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 3: State-wise Accident Count & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Counts */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Top Indian States by Accident Volume</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.state_counts}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-400" />
            <span>Random Forest / Gradient Boosting Feature Importances</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.feature_importance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} domain={[0, 0.3]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="score" fill="#f97316" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 4: PCA / LDA & DBSCAN Spatial Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PCA 2D Projection */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400" />
            <span>Principal Component Analysis (PCA) 2D Projection</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" dataKey="pc1" name="PC1" stroke="#94a3b8" fontSize={11} />
                <YAxis type="number" dataKey="pc2" name="PC2" stroke="#94a3b8" fontSize={11} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                <Scatter data={data.pca_points} fill="#f97316" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            PCA projects high-dimensional accident features into 2 principal components preserving 78.4% total variance.
          </p>
        </div>

        {/* DBSCAN Clusters Table */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>DBSCAN Spatial Hotspot Clusters</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-2 font-bold">Cluster Region</th>
                  <th className="pb-2 font-bold">Accident Density</th>
                  <th className="pb-2 font-bold">Majority Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.dbscan_clusters.map((c: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="py-2.5 font-bold text-white">{c.cluster}</td>
                    <td className="py-2.5 font-medium text-slate-400">{c.count} accidents ({c.density})</td>
                    <td className="py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.severity_majority === 'Fatal' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        c.severity_majority === 'Serious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {c.severity_majority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
