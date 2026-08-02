import React, { useState } from 'react';
import { 
  ShieldAlert, Sparkles, AlertCircle, Gauge, Clock, 
  MapPin, Car, CloudRain, UserCheck, Flame, Zap
} from 'lucide-react';
import { AccidentInputData, PredictionResult } from '../types';
import { 
  INDIAN_STATES, WEATHER_CONDITIONS, ROAD_TYPES, ROAD_SURFACES, 
  LIGHT_CONDITIONS, VEHICLE_TYPES, MONTHS, SAMPLE_PRESETS 
} from '../data/mockData';
import { predictAccidentSeverity } from '../services/api';

interface PredictionFormProps {
  onPredictionComplete: (result: PredictionResult) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionComplete }) => {
  const [formData, setFormData] = useState<AccidentInputData>({
    state: 'Maharashtra',
    weather: 'Clear',
    road_type: 'National Highway',
    road_surface: 'Dry',
    light_condition: 'Daylight',
    vehicle_type: 'Car',
    driver_age: 32,
    driver_gender: 'Male',
    alcohol: 'No',
    speed_limit: 60,
    time_of_day: '14:30',
    month: 'July',
    casualties: 1
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AccidentInputData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (presetData: AccidentInputData) => {
    setFormData(presetData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await predictAccidentSeverity(formData);
      onPredictionComplete(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>REAL-TIME INFERENCE ENGINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Accident Severity Predictor
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Enter accident scenario details below to compute instant severity probabilities using our trained Gradient Boosting ML Ensemble model.
        </p>
      </div>

      {/* Preset Quick Load Buttons */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Zap className="w-4 h-4 text-orange-400" />
          <span>Quick Sample Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.data)}
              className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-orange-500/50 text-left transition-all group"
            >
              <div className="font-bold text-xs text-white group-hover:text-orange-400 transition-colors">
                {preset.label}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Section 1: Location & Highway Geometry */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <MapPin className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">
              1. Location & Highway Type
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                State / Territory
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Road Type
              </label>
              <select
                value={formData.road_type}
                onChange={(e) => handleChange('road_type', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {ROAD_TYPES.map((rt) => (
                  <option key={rt} value={rt} className="bg-slate-900 text-white">{rt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Environment & Atmospheric Conditions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <CloudRain className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">
              2. Weather, Lighting & Surface
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Weather Condition
              </label>
              <select
                value={formData.weather}
                onChange={(e) => handleChange('weather', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {WEATHER_CONDITIONS.map((w) => (
                  <option key={w} value={w} className="bg-slate-900 text-white">{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Road Surface
              </label>
              <select
                value={formData.road_surface}
                onChange={(e) => handleChange('road_surface', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {ROAD_SURFACES.map((rs) => (
                  <option key={rs} value={rs} className="bg-slate-900 text-white">{rs}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Light Condition
              </label>
              <select
                value={formData.light_condition}
                onChange={(e) => handleChange('light_condition', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {LIGHT_CONDITIONS.map((lc) => (
                  <option key={lc} value={lc} className="bg-slate-900 text-white">{lc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Vehicle & Driver Demographics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Car className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">
              3. Vehicle & Driver Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Vehicle Type
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => handleChange('vehicle_type', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {VEHICLE_TYPES.map((vt) => (
                  <option key={vt} value={vt} className="bg-slate-900 text-white">{vt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Driver Gender
              </label>
              <select
                value={formData.driver_gender}
                onChange={(e) => handleChange('driver_gender', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="Male" className="bg-slate-900 text-white">Male</option>
                <option value="Female" className="bg-slate-900 text-white">Female</option>
                <option value="Other" className="bg-slate-900 text-white">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Driver Age ({formData.driver_age} yrs)
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={formData.driver_age}
                onChange={(e) => handleChange('driver_age', Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Alcohol Involvement
              </label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => handleChange('alcohol', 'No')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.alcohol === 'No'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'bg-black/40 text-slate-400 border border-white/10'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('alcohol', 'Yes')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.alcohol === 'Yes'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm ring-2 ring-red-500/30 animate-pulse'
                      : 'bg-black/40 text-slate-400 border border-white/10'
                  }`}
                >
                  Yes (Alcohol)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Dynamics, Speed & Timing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Gauge className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-widest">
              4. Speed, Timing & Casualties
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Speed Limit
                </label>
                <span className="text-xs font-extrabold text-orange-400">
                  {formData.speed_limit} km/h
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="5"
                value={formData.speed_limit}
                onChange={(e) => handleChange('speed_limit', Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Time of Day
              </label>
              <input
                type="time"
                value={formData.time_of_day}
                onChange={(e) => handleChange('time_of_day', e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Month
              </label>
              <select
                value={formData.month}
                onChange={(e) => handleChange('month', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Casualties Involved
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={formData.casualties}
                onChange={(e) => handleChange('casualties', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-sm text-white bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running ML Ensemble Inference...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" />
                <span>PREDICT ACCIDENT SEVERITY</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
