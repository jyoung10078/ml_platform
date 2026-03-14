import React from 'react';
import {
  Home,
  Settings,
  BarChart3,
  FileText,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { ViewType } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BciCrossLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="2" width="10" height="32" rx="2.5" fill="white"/>
    <rect x="2" y="13" width="32" height="10" rx="2.5" fill="white"/>
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home, description: 'Overview & Status' },
    { id: 'parameters' as ViewType, label: 'Parameters', icon: Settings, description: 'Model Configuration' },
    { id: 'performance' as ViewType, label: 'Performance', icon: BarChart3, description: 'Model Metrics' },
    { id: 'predictions' as ViewType, label: 'Predictions', icon: FileText, description: 'Results & Files' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      {/* BCI Branded Header */}
      <div className="bg-bci-900 px-5 pt-5 pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <BciCrossLogo className="w-10 h-10 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold text-white leading-tight tracking-tight">B Magic</h1>
            <p className="text-xs text-bci-200 mt-0.5 font-medium">Blue Cross of Idaho</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-md hover:bg-white/10 transition-colors duration-200 border border-white/25"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-bci-200" />
              <span className="text-xs text-bci-200">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-bci-200" />
              <span className="text-xs text-bci-200">Light Mode</span>
            </>
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-bci-50 dark:bg-bci-900/40 text-bci-900 dark:text-bci-300 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-bci-800 dark:text-bci-300' : 'text-gray-500 dark:text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                isActive ? 'text-bci-700 dark:text-bci-300' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
              }`} />
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Status</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">AWS Services Online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
