import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { PredictionForm } from './components/PredictionForm';
import { ResultModal } from './components/ResultModal';
import { Dashboard } from './components/Dashboard';
import { ModelComparison } from './components/ModelComparison';
import { DatasetPage } from './components/DatasetPage';
import { EvaluationPage } from './components/EvaluationPage';
import { MethodologyPage } from './components/MethodologyPage';
import { HotspotsMap } from './components/HotspotsMap';
import { BatchPrediction } from './components/BatchPrediction';
import { FileExplorer } from './components/FileExplorer';
import { HistoryView } from './components/History';
import { About } from './components/About';
import { PredictionResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);

  // Toggle Dark mode class on root html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handlePredictionComplete = (result: PredictionResult) => {
    setCurrentResult(result);
    setHistory(prev => [result, ...prev]);
  };

  const handleResetPrediction = () => {
    setCurrentResult(null);
  };

  const handleSelectHistoryResult = (result: PredictionResult) => {
    setCurrentResult(result);
    setActiveTab('predict');
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-200 transition-colors duration-200 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'predict') {
            // Keep current result intact when toggling away
          }
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'home' && (
          <Home onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'predict' && (
          currentResult ? (
            <ResultModal
              result={currentResult}
              onReset={handleResetPrediction}
            />
          ) : (
            <PredictionForm onPredictionComplete={handlePredictionComplete} />
          )
        )}

        {activeTab === 'dashboard' && <Dashboard />}

        {activeTab === 'dataset' && <DatasetPage />}

        {activeTab === 'evaluation' && <EvaluationPage />}

        {activeTab === 'methodology' && <MethodologyPage />}

        {activeTab === 'model-comparison' && <ModelComparison />}

        {activeTab === 'hotspots' && <HotspotsMap />}

        {activeTab === 'batch' && <BatchPrediction />}

        {activeTab === 'files' && <FileExplorer />}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={() => setHistory([])}
            onSelectResult={handleSelectHistoryResult}
          />
        )}

        {activeTab === 'about' && <About />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
