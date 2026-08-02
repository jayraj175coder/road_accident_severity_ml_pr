import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';
import { createServer as createViteServer } from 'vite';

type JsonValue = Record<string, any> | any[];

const ROOT_DIR = process.cwd();
const PORT = 3000;
const VENV_PYTHON = path.join(ROOT_DIR, 'venv', 'Scripts', 'python.exe');
const PYTHON_BIN = fs.existsSync(VENV_PYTHON) ? VENV_PYTHON : 'python';
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const EVALUATION_DIR = path.join(BACKEND_DIR, 'evaluation');
const DATASET_PATH = path.join(ROOT_DIR, 'dataset', 'india_road_accidents.csv');

function readJsonFile<T extends JsonValue>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function normalizeMetric(value: number | undefined): number {
  const metric = Number(value || 0);
  return metric > 1 ? metric / 100 : metric;
}

function readMetrics() {
  const metrics = readJsonFile<Record<string, any>>(path.join(BACKEND_DIR, 'metrics.json'), {});
  return {
    algorithm: metrics.algorithm || 'Model not trained',
    accuracy: normalizeMetric(metrics.accuracy),
    precision: normalizeMetric(metrics.precision),
    recall: normalizeMetric(metrics.recall),
    f1_score: normalizeMetric(metrics.f1_score ?? metrics.f1),
    cross_val_score: normalizeMetric(metrics.cross_val_score),
    hyperparameters: metrics.hyperparameters || {},
    feature_count: metrics.feature_count || 0,
    training_samples: metrics.training_samples || 0,
    test_samples: metrics.test_samples || 0,
    dataset_source: metrics.dataset_source || 'dataset/india_road_accidents.csv',
    target_classes: metrics.target_classes || ['Minor', 'Serious', 'Fatal'],
    trained_at: metrics.trained_at || 'Not available',
  };
}

function normalizeComparisonRows(rows: any[]) {
  return rows.map((row) => ({
    algorithm: row.algorithm || row.Algorithm,
    accuracy: normalizeMetric(row.accuracy ?? row.Accuracy),
    precision: normalizeMetric(row.precision ?? row.Precision),
    recall: normalizeMetric(row.recall ?? row.Recall),
    f1_score: normalizeMetric(row.f1_score ?? row.F1_Score ?? row.f1),
    train_time_ms: row.train_time_ms || 0,
    is_best: Boolean(row.is_best),
  }));
}

function parseDatasetSummary() {
  const raw = fs.readFileSync(DATASET_PATH, 'utf-8').trim();
  const lines = raw.split(/\r?\n/);
  const headers = lines[0].split(',');
  const validRows = lines.slice(1).filter((line) => line.split(',').length === headers.length);
  const records = validRows.map((line) => {
    const values = line.split(',');
    return headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = values[index] || '';
      return record;
    }, {});
  });

  const missingValues = records.reduce((total, record) => (
    total + headers.filter((header) => !record[header]).length
  ), 0);
  const duplicateRows = validRows.length - new Set(validRows).size;
  const classDistribution = records.reduce<Record<string, number>>((acc, record) => {
    const label = record.Severity || 'Unknown';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return {
    rows: records.length,
    columns: headers.length,
    missing_values: missingValues,
    duplicate_rows: duplicateRows,
    target_classes: Object.keys(classDistribution),
    feature_list: headers.filter((header) => !['Accident_ID', 'Severity'].includes(header)),
    class_distribution: classDistribution,
    dataset_source: 'dataset/india_road_accidents.csv',
  };
}

function runModelPrediction(payload: Record<string, any>) {
  const runnerPath = path.join(BACKEND_DIR, 'predict_model.py');
  const result = spawnSync(PYTHON_BIN, [runnerPath, JSON.stringify(payload)], {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
    windowsHide: true,
  });

  const output = (result.stdout || '').trim();
  if (result.status !== 0) {
    const parsedError = output ? JSON.parse(output) : { error: result.stderr || 'Prediction process failed' };
    throw new Error(parsedError.error || 'Prediction process failed');
  }

  return JSON.parse(output);
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'online',
      project: 'Road Accident Severity Prediction using Machine Learning',
      framework: 'Express + Vite + React + Scikit-Learn',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/dataset', (req: Request, res: Response) => {
    try {
      res.type('text/csv').send(fs.readFileSync(DATASET_PATH, 'utf-8'));
    } catch {
      res.status(500).json({ error: 'Failed to read dataset CSV file' });
    }
  });

  app.get('/api/dataset-summary', (req: Request, res: Response) => {
    try {
      res.json(parseDatasetSummary());
    } catch {
      res.status(500).json({ error: 'Failed to summarize dataset' });
    }
  });

  app.get('/api/model-info', (req: Request, res: Response) => {
    res.json(readMetrics());
  });

  app.get('/api/model-comparison', (req: Request, res: Response) => {
    const rows = readJsonFile<any[]>(path.join(BACKEND_DIR, 'model_comparison.json'), []);
    res.json(normalizeComparisonRows(rows));
  });

  app.get('/api/evaluation', (req: Request, res: Response) => {
    const metrics = readJsonFile<Record<string, any>>(path.join(BACKEND_DIR, 'metrics.json'), {});
    const reportPath = path.join(EVALUATION_DIR, 'classification_report.txt');
    res.json({
      confusion_matrix: metrics.confusion_matrix || [],
      classification_report: fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf-8') : 'Classification report has not been generated yet.',
      images: {
        confusion_matrix: '/api/artifacts/confusion_matrix.png',
        roc_curve: '/api/artifacts/roc_curve.png',
        feature_importance: '/api/artifacts/feature_importance.png',
      },
    });
  });

  app.get('/api/artifacts/:filename', (req: Request, res: Response) => {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(EVALUATION_DIR, safeName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Artifact not found' });
    }
    res.sendFile(filePath);
  });

  app.post('/api/predict', (req: Request, res: Response) => {
    try {
      const prediction = runModelPrediction(req.body);
      res.json({
        ...prediction,
        risk_score: prediction.confidence,
        shap_explanation: [],
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Prediction failed' });
    }
  });

  app.post('/api/batch-predict', (req: Request, res: Response) => {
    const { items = [] } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of accident items' });
    }

    try {
      const results = items.map((item: any, idx: number) => {
        const prediction = runModelPrediction({
          state: item.state || item.State || 'Maharashtra',
          weather: item.weather || item.Weather || 'Clear',
          road_type: item.road_type || item.Road_Type || 'National Highway',
          road_surface: item.road_surface || item.Road_Surface || 'Dry',
          light_condition: item.light_condition || item.Light_Condition || 'Daylight',
          vehicle_type: item.vehicle_type || item.Vehicle_Type || 'Car',
          driver_age: item.driver_age || item.Driver_Age || 30,
          driver_gender: item.driver_gender || item.Driver_Gender || 'Male',
          alcohol: item.alcohol || item.Alcohol || 'No',
          speed_limit: item.speed_limit || item.Speed_Limit || 60,
          time_of_day: item.time_of_day || item.Time || '14:00',
          month: item.month || item.Month || 'July',
          casualties: item.casualties || item.Casualties || 1,
        });
        return {
          id: item.id || item.Accident_ID || `ACC-${idx + 1001}`,
          state: item.state || item.State || 'Maharashtra',
          road_type: item.road_type || item.Road_Type || 'National Highway',
          weather: item.weather || item.Weather || 'Clear',
          predicted_severity: prediction.severity,
          risk_score: Math.round(prediction.confidence),
          confidence: Math.round(prediction.confidence),
        };
      });

      const summary = {
        total_records: results.length,
        fatal_count: results.filter((r) => r.predicted_severity === 'Fatal').length,
        serious_count: results.filter((r) => r.predicted_severity === 'Serious').length,
        minor_count: results.filter((r) => r.predicted_severity === 'Minor').length,
        average_risk_score: Math.round(results.reduce((acc, r) => acc + r.risk_score, 0) / results.length),
      };

      res.json({ results, summary });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Batch prediction failed' });
    }
  });

  // Hotspots Map Endpoint
  app.get('/api/hotspots', (req: Request, res: Response) => {
    res.json([
      { id: 'HS1', name: 'Mumbai Eastern Express Highway', state: 'Maharashtra', city: 'Mumbai', lat: 19.0760, lng: 72.8777, severity: 'Fatal', casualties: 142, road_type: 'National Highway', risk_rating: 'High' },
      { id: 'HS2', name: 'Pune-Mumbai Expressway (Khandala Section)', state: 'Maharashtra', city: 'Pune', lat: 18.7557, lng: 73.3426, severity: 'Fatal', casualties: 189, road_type: 'Expressway', risk_rating: 'High' },
      { id: 'HS3', name: 'Delhi Outer Ring Road (Mukarba Chowk)', state: 'Delhi', city: 'New Delhi', lat: 28.7352, lng: 77.1601, severity: 'Fatal', casualties: 165, road_type: 'National Highway', risk_rating: 'High' },
      { id: 'HS4', name: 'Bengaluru Silk Board Junction', state: 'Karnataka', city: 'Bengaluru', lat: 12.9172, lng: 77.6228, severity: 'Serious', casualties: 98, road_type: 'City Road', risk_rating: 'Medium' },
      { id: 'HS5', name: 'Chennai GST Road (Chromepet Curve)', state: 'Tamil Nadu', city: 'Chennai', lat: 12.9516, lng: 80.1462, severity: 'Serious', casualties: 112, road_type: 'National Highway', risk_rating: 'Medium' },
      { id: 'HS6', name: 'Lucknow-Agra Expressway (Etawah Stretch)', state: 'Uttar Pradesh', city: 'Lucknow', lat: 26.7855, lng: 79.0224, severity: 'Fatal', casualties: 210, road_type: 'Expressway', risk_rating: 'High' },
      { id: 'HS7', name: 'Kolkata E.M. Bypass (Chingrighata)', state: 'West Bengal', city: 'Kolkata', lat: 22.5629, lng: 88.3963, severity: 'Serious', casualties: 87, road_type: 'City Road', risk_rating: 'Medium' },
      { id: 'HS8', name: 'Ahmedabad S.G. Highway', state: 'Gujarat', city: 'Ahmedabad', lat: 23.0300, lng: 72.5076, severity: 'Minor', casualties: 45, road_type: 'State Highway', risk_rating: 'Low' },
      { id: 'HS9', name: 'Jaipur Bypass (Ajmer Road)', state: 'Rajasthan', city: 'Jaipur', lat: 26.8854, lng: 75.7482, severity: 'Serious', casualties: 76, road_type: 'National Highway', risk_rating: 'Medium' },
      { id: 'HS10', name: 'Bhopal VIP Road Junction', state: 'Madhya Pradesh', city: 'Bhopal', lat: 23.2599, lng: 77.3850, severity: 'Minor', casualties: 34, road_type: 'City Road', risk_rating: 'Low' },
      { id: 'HS11', name: 'Hyderabad ORR (Gachibowli Gate)', state: 'Telangana', city: 'Hyderabad', lat: 17.4401, lng: 78.3489, severity: 'Serious', casualties: 104, road_type: 'Expressway', risk_rating: 'Medium' },
      { id: 'HS12', name: 'Kochi Edappally Bypass', state: 'Kerala', city: 'Kochi', lat: 10.0261, lng: 76.3082, severity: 'Minor', casualties: 41, road_type: 'State Highway', risk_rating: 'Low' }
    ]);
  });

  // Interactive Analytics Data
  app.get('/api/analytics', (req: Request, res: Response) => {
    res.json({
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
    });
  });

  // ==========================================
  // VITE SERVING & STATIC FALLBACK
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0');
}

startServer();
