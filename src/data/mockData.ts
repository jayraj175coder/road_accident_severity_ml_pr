import { AccidentInputData, Hotspot } from '../types';

export const INDIAN_STATES = [
  'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'Karnataka', 'Delhi',
  'Kerala', 'Gujarat', 'West Bengal', 'Rajasthan', 'Madhya Pradesh',
  'Telangana', 'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Assam'
];

export const WEATHER_CONDITIONS = [
  'Clear', 'Heavy Rain', 'Foggy', 'Mist', 'Sunny'
];

export const ROAD_TYPES = [
  'National Highway', 'Expressway', 'State Highway', 'City Road', 'Rural Road'
];

export const ROAD_SURFACES = [
  'Dry', 'Wet', 'Slippery', 'Gravel', 'Under Construction'
];

export const LIGHT_CONDITIONS = [
  'Daylight', 'Night - Street Lights On', 'Night - Darkness', 'Twilight/Dusk'
];

export const VEHICLE_TYPES = [
  'Two-Wheeler', 'Car', 'Bus', 'Heavy Truck', 'Auto-Rickshaw', 'LCV'
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SAMPLE_PRESETS: { label: string; description: string; data: AccidentInputData }[] = [
  {
    label: 'Night Highway Heavy Truck',
    description: 'High speed, night darkness, alcohol involvement on National Highway',
    data: {
      state: 'Maharashtra',
      weather: 'Heavy Rain',
      road_type: 'National Highway',
      road_surface: 'Slippery',
      light_condition: 'Night - Darkness',
      vehicle_type: 'Heavy Truck',
      driver_age: 42,
      driver_gender: 'Male',
      alcohol: 'Yes',
      speed_limit: 90,
      time_of_day: '23:30',
      month: 'July',
      casualties: 4
    }
  },
  {
    label: 'City Daylight Car Commute',
    description: 'Moderate speed, clear weather, dry city road during daytime',
    data: {
      state: 'Karnataka',
      weather: 'Clear',
      road_type: 'City Road',
      road_surface: 'Dry',
      light_condition: 'Daylight',
      vehicle_type: 'Car',
      driver_age: 29,
      driver_gender: 'Male',
      alcohol: 'No',
      speed_limit: 50,
      time_of_day: '14:15',
      month: 'March',
      casualties: 1
    }
  },
  {
    label: 'Winter Fog Expressway Bus Crash',
    description: 'Low visibility foggy morning on Uttar Pradesh Expressway',
    data: {
      state: 'Uttar Pradesh',
      weather: 'Foggy',
      road_type: 'Expressway',
      road_surface: 'Wet',
      light_condition: 'Twilight/Dusk',
      vehicle_type: 'Bus',
      driver_age: 48,
      driver_gender: 'Male',
      alcohol: 'No',
      speed_limit: 100,
      time_of_day: '06:10',
      month: 'December',
      casualties: 6
    }
  },
  {
    label: 'Monsoon Bike Skid',
    description: 'Slippery surface, two-wheeler in heavy rain in Kerala',
    data: {
      state: 'Kerala',
      weather: 'Heavy Rain',
      road_type: 'State Highway',
      road_surface: 'Slippery',
      light_condition: 'Night - Street Lights On',
      vehicle_type: 'Two-Wheeler',
      driver_age: 23,
      driver_gender: 'Male',
      alcohol: 'No',
      speed_limit: 60,
      time_of_day: '20:45',
      month: 'August',
      casualties: 2
    }
  }
];

export const DEFAULT_HOTSPOTS: Hotspot[] = [
  { id: 'HS1', name: 'Mumbai Eastern Express Highway', state: 'Maharashtra', city: 'Mumbai', lat: 19.0760, lng: 72.8777, severity: 'Fatal', casualties: 142, road_type: 'National Highway', risk_rating: 'High' },
  { id: 'HS2', name: 'Pune-Mumbai Expressway (Khandala Section)', state: 'Maharashtra', city: 'Pune', lat: 18.7557, lng: 73.3426, severity: 'Fatal', casualties: 189, road_type: 'Expressway', risk_rating: 'High' },
  { id: 'HS3', name: 'Delhi Outer Ring Road (Mukarba Chowk)', state: 'Delhi', city: 'New Delhi', lat: 28.7352, lng: 77.1601, severity: 'Fatal', casualties: 165, road_type: 'National Highway', risk_rating: 'High' },
  { id: 'HS4', name: 'Bengaluru Silk Board Junction', state: 'Karnataka', city: 'Bengaluru', lat: 12.9172, lng: 77.6228, severity: 'Serious', casualties: 98, road_type: 'City Road', risk_rating: 'Medium' },
  { id: 'HS5', name: 'Chennai GST Road (Chromepet Curve)', state: 'Tamil Nadu', city: 'Chennai', lat: 12.9516, lng: 80.1462, severity: 'Serious', casualties: 112, road_type: 'National Highway', risk_rating: 'Medium' },
  { id: 'HS6', name: 'Lucknow-Agra Expressway (Etawah Stretch)', state: 'Uttar Pradesh', city: 'Lucknow', lat: 26.7855, lng: 79.0224, severity: 'Fatal', casualties: 210, road_type: 'Expressway', risk_rating: 'High' },
  { id: 'HS7', name: 'Kolkata E.M. Bypass (Chingrighata)', state: 'West Bengal', city: 'Kolkata', lat: 22.5629, lng: 88.3963, severity: 'Serious', casualties: 87, road_type: 'City Road', risk_rating: 'Medium' },
  { id: 'HS8', name: 'Ahmedabad S.G. Highway', state: 'Gujarat', city: 'Ahmedabad', lat: 23.0300, lng: 72.5076, severity: 'Minor', casualties: 45, road_type: 'State Highway', risk_rating: 'Low' },
  { id: 'HS9', name: 'Jaipur Bypass (Ajmer Road)', state: 'Rajasthan', city: 'Jaipur', lat: 26.8854, lng: 75.7482, severity: 'Serious', casualties: 76, road_type: 'National Highway', risk_rating: 'Medium' },
  { id: 'HS10', name: 'Bhopal VIP Road Junction', state: 'Madhya Pradesh', city: 'Bhopal', lat: 23.2599, lng: 77.3850, severity: 'Minor', casualties: 34, road_type: 'City Road', risk_rating: 'Low' }
];

export const ROAD_SAFETY_FACTS = [
  {
    title: 'Speeding Factor',
    stat: '71.2%',
    desc: 'Over-speeding accounts for over 70% of fatal road crashes on Indian National Highways (MoRTH Report).'
  },
  {
    title: 'Night Visbility Risk',
    stat: '3.4x',
    desc: 'Accidents occurring during night darkness without street lighting have a 3.4x higher fatality probability.'
  },
  {
    title: 'Two-Wheeler Vulnerability',
    stat: '44.5%',
    desc: 'Two-wheeler riders represent nearly 45% of total road traffic casualties across major urban hubs.'
  },
  {
    title: 'Monsoon & Winter Fog',
    stat: '+38%',
    desc: 'Adverse weather conditions like heavy monsoon rain and winter fog increase collision frequency by 38%.'
  }
];
