import React, { useEffect, useState, useRef } from 'react';
import { MapPin, AlertTriangle, ShieldAlert, Filter, Navigation } from 'lucide-react';
import { Hotspot } from '../types';
import { fetchHotspots } from '../services/api';

export const HotspotsMap: React.FC = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);

  useEffect(() => {
    fetchHotspots().then(res => setHotspots(res));
  }, []);

  // Filter hotspots
  const filteredHotspots = hotspots.filter(h => {
    const matchSeverity = selectedSeverity === 'ALL' || h.severity === selectedSeverity;
    const matchState = selectedState === 'ALL' || h.state === selectedState;
    return matchSeverity && matchState;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet dynamically if window.L is available or via script tag
    const initMap = () => {
      if ((window as any).L && mapRef.current) {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.remove();
        }

        const L = (window as any).L;
        const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // India Center

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        filteredHotspots.forEach(hs => {
          const color = hs.severity === 'Fatal' ? '#ef4444' : hs.severity === 'Serious' ? '#f59e0b' : '#10b981';
          
          const circle = L.circleMarker([hs.lat, hs.lng], {
            radius: 10,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85
          }).addTo(map);

          circle.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="color: #0f172a; font-size: 13px;">${hs.name}</strong><br/>
              <span style="font-size: 11px; color: #64748b;">${hs.city}, ${hs.state}</span><br/>
              <hr style="margin: 6px 0; border-color: #e2e8f0;"/>
              <div style="font-size: 11px; font-weight: bold; color: ${color}; font-size: 12px;">
                Severity: ${hs.severity} Crash Zone
              </div>
              <div style="font-size: 11px; color: #334155;">
                Casualties: <strong>${hs.casualties}</strong> | Road: ${hs.road_type}
              </div>
            </div>
          `);
        });

        leafletMapInstance.current = map;
      }
    };

    if (!(window as any).L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, [filteredHotspots]);

  const uniqueStates = Array.from(new Set(hotspots.map(h => h.state)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5" />
          <span>GEOSPATIAL HOTSPOT ANALYSIS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          India Accident Hotspot Map
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Interactive Leaflet map displaying spatial accident density clusters, highway blackspots, and regional fatality vulnerability ratings across India.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Filter className="w-4 h-4 text-orange-400" />
          <span>Filter Hotspot Clusters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 text-xs font-medium border border-white/10 text-white focus:outline-none focus:border-orange-500"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Severity Levels</option>
            <option value="Fatal" className="bg-slate-900 text-white">Fatal Severity Only</option>
            <option value="Serious" className="bg-slate-900 text-white">Serious Severity Only</option>
            <option value="Minor" className="bg-slate-900 text-white">Minor Severity Only</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/40 text-xs font-medium border border-white/10 text-white focus:outline-none focus:border-orange-500"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Indian States</option>
            {uniqueStates.map(st => (
              <option key={st} value={st} className="bg-slate-900 text-white">{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="rounded-3xl border border-white/10 overflow-hidden shadow-xl bg-slate-900 h-[500px] relative z-0">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Hotspots Detail Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHotspots.map((hs) => (
          <div key={hs.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-xs">{hs.name}</h4>
                <p className="text-[11px] text-slate-400">{hs.city}, {hs.state}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                hs.severity === 'Fatal' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                hs.severity === 'Serious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {hs.severity}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Road: <strong className="text-slate-200">{hs.road_type}</strong></span>
              <span>Casualties: <strong className="text-orange-400">{hs.casualties}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
