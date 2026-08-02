import { AccidentInputData, PredictionResult, ModelInfo, ModelComparisonItem, Hotspot, BatchItem, BatchSummary } from '../types';
import { DEFAULT_HOTSPOTS } from '../data/mockData';

const API_BASE = '/api';

export async function predictAccidentSeverity(data: AccidentInputData): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Prediction failed' }));
    throw new Error(error.error || 'Prediction failed');
  }

  const result = await response.json();
  return { ...result, input_data: data };
}

export async function fetchModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_BASE}/model-info`);
  if (!res.ok) throw new Error('Failed to load model metrics');
  return res.json();
}

export async function fetchModelComparison(): Promise<ModelComparisonItem[]> {
  const res = await fetch(`${API_BASE}/model-comparison`);
  if (!res.ok) throw new Error('Failed to load model comparison');
  return res.json();
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[API] Analytics fallback');
  }

  return {
    severity_distribution: [
      { name: 'Minor', value: 42, color: '#10b981' },
      { name: 'Serious', value: 36, color: '#f59e0b' },
      { name: 'Fatal', value: 22, color: '#ef4444' }
    ],
    weather_vs_severity: [
      { weather: 'Clear', Minor: 320, Serious: 210, Fatal: 90 },
      { weather: 'Heavy Rain', Minor: 110, Serious: 280, Fatal: 210 },
      { weather: 'Foggy', Minor: 60, Serious: 190, Fatal: 230 },
      { weather: 'Mist', Minor: 140, Serious: 120, Fatal: 70 },
      { weather: 'Sunny', Minor: 280, Serious: 150, Fatal: 40 }
    ],
    vehicle_analysis: [
      { type: 'Heavy Truck', Minor: 80, Serious: 240, Fatal: 310, total: 630 },
      { type: 'Two-Wheeler', Minor: 310, Serious: 290, Fatal: 180, total: 780 },
      { type: 'Car', Minor: 410, Serious: 220, Fatal: 120, total: 750 },
      { type: 'Bus', Minor: 90, Serious: 190, Fatal: 210, total: 490 },
      { type: 'Auto-Rickshaw', Minor: 240, Serious: 110, Fatal: 40, total: 390 },
      { type: 'LCV', Minor: 180, Serious: 130, Fatal: 80, total: 390 }
    ],
    road_type_analysis: [
      { road: 'National Highway', Minor: 210, Serious: 380, Fatal: 450 },
      { road: 'Expressway', Minor: 150, Serious: 290, Fatal: 390 },
      { road: 'State Highway', Minor: 310, Serious: 270, Fatal: 190 },
      { road: 'City Road', Minor: 520, Serious: 180, Fatal: 60 },
      { road: 'Rural Road', Minor: 280, Serious: 140, Fatal: 90 }
    ],
    state_counts: [
      { state: 'Maharashtra', count: 3420 },
      { state: 'Tamil Nadu', count: 3180 },
      { state: 'Uttar Pradesh', count: 2950 },
      { state: 'Karnataka', count: 2640 },
      { state: 'Madhya Pradesh', count: 2310 },
      { state: 'Gujarat', count: 1980 },
      { state: 'Rajasthan', count: 1840 },
      { state: 'Kerala', count: 1720 },
      { state: 'West Bengal', count: 1610 },
      { state: 'Delhi', count: 1450 }
    ],
    monthly_trend: [
      { month: 'Jan', accidents: 1250, fog_factor: 85 },
      { month: 'Feb', accidents: 1040, fog_factor: 45 },
      { month: 'Mar', accidents: 980, fog_factor: 15 },
      { month: 'Apr', accidents: 1110, fog_factor: 10 },
      { month: 'May', accidents: 1220, fog_factor: 5 },
      { month: 'Jun', accidents: 1380, fog_factor: 30 },
      { month: 'Jul', accidents: 1620, fog_factor: 70 },
      { month: 'Aug', accidents: 1580, fog_factor: 65 },
      { month: 'Sep', accidents: 1320, fog_factor: 40 },
      { month: 'Oct', accidents: 1190, fog_factor: 25 },
      { month: 'Nov', accidents: 1340, fog_factor: 60 },
      { month: 'Dec', accidents: 1510, fog_factor: 90 }
    ],
    feature_importance: [
      { feature: 'Alcohol Consumption', score: 0.24, category: 'Driver' },
      { feature: 'Speed Limit', score: 0.21, category: 'Vehicle' },
      { feature: 'Vehicle Type', score: 0.16, category: 'Vehicle' },
      { feature: 'Light Condition', score: 0.13, category: 'Environment' },
      { feature: 'Road Surface', score: 0.10, category: 'Road' },
      { feature: 'Weather', score: 0.08, category: 'Environment' },
      { feature: 'Road Type', score: 0.05, category: 'Road' },
      { feature: 'Driver Age', score: 0.03, category: 'Driver' }
    ],
    pca_points: [
      { pc1: -2.1, pc2: 1.4, severity: 'Minor' },
      { pc1: -1.8, pc2: 0.9, severity: 'Minor' },
      { pc1: -1.2, pc2: 1.8, severity: 'Minor' },
      { pc1: 0.1, pc2: -0.4, severity: 'Serious' },
      { pc1: 0.5, pc2: -0.8, severity: 'Serious' },
      { pc1: 0.8, pc2: 0.2, severity: 'Serious' },
      { pc1: 2.3, pc2: -1.5, severity: 'Fatal' },
      { pc1: 2.8, pc2: -1.1, severity: 'Fatal' },
      { pc1: 3.1, pc2: -2.0, severity: 'Fatal' }
    ],
    lda_points: [
      { ld1: -3.2, severity: 'Minor' },
      { ld1: -2.8, severity: 'Minor' },
      { ld1: 0.2, severity: 'Serious' },
      { ld1: 0.8, severity: 'Serious' },
      { ld1: 3.4, severity: 'Fatal' },
      { ld1: 3.9, severity: 'Fatal' }
    ],
    dbscan_clusters: [
      { cluster: 'Cluster 0 (Mumbai-Pune Corridor)', count: 42, severity_majority: 'Fatal', density: 'High' },
      { cluster: 'Cluster 1 (Delhi Ring Road)', count: 38, severity_majority: 'Fatal', density: 'High' },
      { cluster: 'Cluster 2 (Bengaluru Silk Board)', count: 29, severity_majority: 'Serious', density: 'Medium' },
      { cluster: 'Cluster 3 (Chennai GST Road)', count: 24, severity_majority: 'Serious', density: 'Medium' },
      { cluster: 'Noise Points (Outliers)', count: 12, severity_majority: 'Minor', density: 'Low' }
    ]
  };
}

export async function fetchHotspots(): Promise<Hotspot[]> {
  try {
    const res = await fetch(`${API_BASE}/hotspots`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[API] Hotspots fallback');
  }
  return DEFAULT_HOTSPOTS;
}

export async function fetchDatasetCSV(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/dataset`);
    if (res.ok) return await res.text();
  } catch (e) {
    console.warn('[API] Dataset fetch fallback');
  }
  return `Accident_ID,State,City,Weather,Road_Type,Road_Surface,Light_Condition,Vehicle_Type,Driver_Age,Driver_Gender,Alcohol,Speed_Limit,Time,Day,Month,Casualties,Latitude,Longitude,Severity
ACC0001,Maharashtra,Mumbai,Heavy Rain,National Highway,Slippery,Night - Darkness,Heavy Truck,42,Male,Yes,80,23:15,Friday,July,4,19.0760,72.8777,Fatal
ACC0002,Tamil Nadu,Chennai,Clear,City Road,Dry,Daylight,Car,29,Male,No,50,14:30,Tuesday,March,1,13.0827,80.2707,Minor
ACC0003,Uttar Pradesh,Lucknow,Foggy,State Highway,Wet,Night - Street Lights On,Bus,38,Male,No,60,05:45,Monday,December,3,26.8467,80.9462,Serious
ACC0004,Karnataka,Bengaluru,Clear,Expressway,Dry,Daylight,Two-Wheeler,24,Male,No,100,18:20,Saturday,August,1,12.9716,77.5946,Minor
ACC0005,Delhi,New Delhi,Mist,National Highway,Dry,Night - Darkness,Car,31,Male,Yes,80,01:10,Sunday,January,2,28.6139,77.2090,Serious
ACC0006,Kerala,Kochi,Heavy Rain,State Highway,Slippery,Twilight/Dusk,Auto-Rickshaw,55,Male,No,40,19:05,Wednesday,June,2,9.9312,76.2673,Serious
ACC0007,Gujarat,Ahmedabad,Sunny,Expressway,Dry,Daylight,Heavy Truck,45,Male,No,100,11:40,Thursday,May,1,23.0225,72.5714,Minor
ACC0008,West Bengal,Kolkata,Foggy,City Road,Wet,Night - Darkness,Two-Wheeler,22,Male,Yes,50,22:50,Saturday,December,2,22.5726,88.3639,Fatal
ACC0009,Rajasthan,Jaipur,Clear,National Highway,Dry,Daylight,LCV,36,Male,No,80,16:15,Tuesday,February,1,26.9124,75.7873,Minor
ACC0010,Madhya Pradesh,Bhopal,Clear,Rural Road,Gravel,Night - Darkness,Two-Wheeler,27,Male,Yes,40,21:30,Sunday,November,3,23.2599,77.4126,Fatal`;
}


export async function fetchDatasetSummary(): Promise<any> {
  const res = await fetch(`${API_BASE}/dataset-summary`);
  if (!res.ok) throw new Error('Failed to load dataset summary');
  return res.json();
}

export async function fetchEvaluationArtifacts(): Promise<any> {
  const res = await fetch(`${API_BASE}/evaluation`);
  if (!res.ok) throw new Error('Failed to load evaluation artifacts');
  return res.json();
}

export async function processBatchPredictions(items: any[]): Promise<{ results: BatchItem[], summary: BatchSummary }> {
  const res = await fetch(`${API_BASE}/batch-predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Batch prediction failed' }));
    throw new Error(error.error || 'Batch prediction failed');
  }

  return res.json();
}
