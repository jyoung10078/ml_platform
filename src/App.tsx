import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ParameterInput from './components/ParameterInput';
import ModelPerformance from './components/ModelPerformance';
import PredictionResults from './components/PredictionResults';
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'parameters':
        return <ParameterInput />;
      case 'performance':
        return <ModelPerformance />;
      case 'predictions':
        return <PredictionResults />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;