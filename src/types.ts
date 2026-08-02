export type SeverityLevel = 'Minor' | 'Serious' | 'Fatal';

export interface AccidentInputData {
  state: string;
  city?: string;
  weather: string;
  road_type: string;
  road_surface: string;
  light_condition: string;
  vehicle_type: string;
  driver_age: number;
  driver_gender: string;
  alcohol: string;
  speed_limit: number;
  time_of_day: string;
  month: string;
  casualties: number;
}

export interface ShapItem {
  feature: string;
  impact: number;
  description: string;
}

export interface PredictionResult {
  severity: SeverityLevel;
  confidence: number;
  probabilities: {
    Minor: number;
    Serious: number;
    Fatal: number;
  };
  risk_score: number;
  recommendations: string[];
  shap_explanation: ShapItem[];
  timestamp?: string;
  input_data?: AccidentInputData;
}

export interface ModelInfo {
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  cross_val_score: number;
  hyperparameters: Record<string, any>;
  feature_count: number;
  training_samples: number;
  test_samples: number;
  dataset_source: string;
  target_classes: string[];
  trained_at: string;
}

export interface ModelComparisonItem {
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  train_time_ms: number;
  is_best?: boolean;
}

export interface Hotspot {
  id: string;
  name: string;
  state: string;
  city: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  casualties: number;
  road_type: string;
  risk_rating: 'Low' | 'Medium' | 'High';
}

export interface BatchItem {
  id: string;
  state: string;
  road_type: string;
  weather: string;
  predicted_severity: SeverityLevel;
  risk_score: number;
  confidence: number;
}

export interface BatchSummary {
  total_records: number;
  fatal_count: number;
  serious_count: number;
  minor_count: number;
  average_risk_score: number;
}
