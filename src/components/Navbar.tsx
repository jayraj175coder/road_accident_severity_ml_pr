import React from 'react';
import { 
  ShieldAlert, Home, Activity, BarChart3, MapPin, 
  FileSpreadsheet, History, Info, Sun, Moon, FolderOpen, Database, FileText, Workflow 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'predict', label: 'Prediction', icon: ShieldAlert },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'model-comparison', label: 'Models', icon: Activity },
    { id: 'evaluation', label: 'Evaluation', icon: FileText },
    { id: 'methodology', label: 'Method', icon: Workflow },
    { id: 'hotspots', label: 'Map Hotspots', icon: MapPin },
    // { id: 'batch', label: 'Batch CSV', icon: FileSpreadsheet },
    // { id: 'files', label: 'File Explorer', icon: FolderOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050b18]/80 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                RoadGuard<span className="text-orange-400">AI</span>
              </span>
              {/* <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-widest uppercase bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/30">
                India ML
              </span> */}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Accident Severity Prediction Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button> */}

         
        </div>
      </div>

      {/* Mobile Bar Tab Bar */}
      <div className="lg:hidden flex overflow-x-auto px-2 py-1.5 bg-[#050b18]/90 border-t border-white/10 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
                isActive
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
