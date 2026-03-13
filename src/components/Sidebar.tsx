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

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { 
      id: 'dashboard' as ViewType, 
      label: 'Dashboard', 
      icon: Home, 
      description: 'Overview & Status' 
    },
    { 
      id: 'parameters' as ViewType, 
      label: 'Parameters', 
      icon: Settings, 
      description: 'Model Configuration' 
    },
    { 
      id: 'performance' as ViewType, 
      label: 'Performance', 
      icon: BarChart3, 
      description: 'Model Metrics' 
    },
    { 
      id: 'predictions' as ViewType, 
      label: 'Predictions', 
      icon: FileText, 
      description: 'Results & Files' 
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">ML Platform</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Predictive Modeling System</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Light Mode</span>
            </>
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
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