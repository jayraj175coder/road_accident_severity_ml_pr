import React, { useState, useRef, useEffect } from 'react';
import { FileSpreadsheet, Upload, Download, CheckCircle2, AlertTriangle, Sparkles, FileText, RefreshCw, Layers } from 'lucide-react';
import Papa from 'papaparse';
import { BatchItem, BatchSummary } from '../types';
import { processBatchPredictions, fetchDatasetCSV } from '../services/api';

export const BatchPrediction: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically load the project CSV dataset on first mount
  useEffect(() => {
    handleLoadProjectDataset();
  }, []);

  const parseCsvText = (csvText: string, fileName: string) => {
    setLoading(true);
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedRows = results.data.map((row: any, idx: number) => {
          return {
            id: row['Accident_ID'] || row['id'] || row['ID'] || `ACC-${idx + 1001}`,
            state: row['State'] || row['state'] || 'Maharashtra',
            city: row['City'] || row['city'] || 'Mumbai',
            weather: row['Weather'] || row['weather'] || 'Clear',
            road_type: row['Road_Type'] || row['road_type'] || 'National Highway',
            road_surface: row['Road_Surface'] || row['road_surface'] || 'Dry',
            light_condition: row['Light_Condition'] || row['light_condition'] || 'Daylight',
            vehicle_type: row['Vehicle_Type'] || row['vehicle_type'] || 'Car',
            driver_age: Number(row['Driver_Age'] || row['driver_age'] || 32),
            alcohol: row['Alcohol'] || row['alcohol'] || 'No',
            speed_limit: Number(row['Speed_Limit'] || row['speed_limit'] || 60),
            casualties: Number(row['Casualties'] || row['casualties'] || 1)
          };
        });

        if (parsedRows.length > 0) {
          try {
            const res = await processBatchPredictions(parsedRows);
            setItems(res.results);
            setSummary(res.summary);
            setActiveFileName(fileName);
          } catch (e) {
            console.error('Batch processing error:', e);
          }
        }
        setLoading(false);
      },
      error: (err: any) => {
        console.error('CSV Parsing Error:', err);
        setLoading(false);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseCsvText(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          parseCsvText(content, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadProjectDataset = async () => {
    setLoading(true);
    try {
      const csvText = await fetchDatasetCSV();
      parseCsvText(csvText, 'india_road_accidents.csv');
    } catch (e) {
      console.error('Failed to load project dataset:', e);
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (items.length === 0) return;
    const headers = ['ID', 'State', 'Road Type', 'Weather', 'Predicted Severity', 'Risk Score (%)', 'Confidence (%)'];
    const rows = items.map(i => [i.id, i.state, i.road_type, i.weather, i.predicted_severity, i.risk_score, i.confidence]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Batch_Road_Accident_Predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>BULK DATA PROCESSING & CSV PREDICTOR</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Batch CSV Prediction Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Upload your custom CSV file or load the official Kaggle Indian Road Accidents Dataset for high-throughput machine learning severity classification.
        </p>
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 backdrop-blur-xl relative ${
          dragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-white/20 bg-white/5 hover:border-orange-500/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/20 shadow-lg shadow-orange-500/10">
          <Upload className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-bold text-white text-base">
            Drag & Drop Your CSV File Here
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Supports CSV files containing headers like <span className="font-mono text-orange-400">Accident_ID, State, Weather, Road_Type, Vehicle_Type, Speed_Limit, Alcohol</span>, etc.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Select CSV File From Computer</span>
          </button>

          <button
            onClick={handleLoadProjectDataset}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Load Kaggle Dataset (india_road_accidents.csv)</span>
          </button>
        </div>

        {activeFileName && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active File: {activeFileName} ({items.length} records processed)</span>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-bold text-white">Running ML Classification across CSV records...</div>
        </div>
      )}

      {/* Summary Metrics */}
      {summary && !loading && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Records</div>
            <div className="text-2xl font-black text-white">{summary.total_records}</div>
          </div>
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center backdrop-blur-xl">
            <div className="text-[10px] font-bold text-red-400 uppercase">Fatal Cases</div>
            <div className="text-2xl font-black text-red-400">{summary.fatal_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center backdrop-blur-xl">
            <div className="text-[10px] font-bold text-amber-400 uppercase">Serious Cases</div>
            <div className="text-2xl font-black text-amber-400">{summary.serious_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center backdrop-blur-xl">
            <div className="text-[10px] font-bold text-emerald-400 uppercase">Minor Cases</div>
            <div className="text-2xl font-black text-emerald-400">{summary.minor_count}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Risk Score</div>
            <div className="text-2xl font-black text-orange-400">{summary.average_risk_score}/100</div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {items.length > 0 && !loading && (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-white text-xs uppercase tracking-widest">
                Batch Classification Results ({items.length} Records)
              </h3>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Predictions CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-bold">Record ID</th>
                  <th className="pb-3 font-bold">State</th>
                  <th className="pb-3 font-bold">Road Type</th>
                  <th className="pb-3 font-bold">Weather</th>
                  <th className="pb-3 font-bold">Predicted Severity</th>
                  <th className="pb-3 font-bold">Risk Score</th>
                  <th className="pb-3 font-bold">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-white/5">
                    <td className="py-3 font-bold font-mono text-white">{row.id}</td>
                    <td className="py-3 text-slate-300">{row.state}</td>
                    <td className="py-3 text-slate-400">{row.road_type}</td>
                    <td className="py-3 text-slate-400">{row.weather}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        row.predicted_severity === 'Fatal' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        row.predicted_severity === 'Serious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {row.predicted_severity}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-white font-mono">{row.risk_score}%</td>
                    <td className="py-3 font-bold text-orange-400 font-mono">{row.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

