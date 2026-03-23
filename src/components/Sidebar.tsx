import React from 'react';
import {
  Home,
  Settings,
  BarChart3,
  FileText,
  Sun,
  Moon,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { ViewType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { isAwsConfigured } from '../services/sagemakerService';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const BciCrossLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="2" width="10" height="32" rx="2.5" fill="white"/>
    <rect x="2" y="13" width="32" height="10" rx="2.5" fill="white"/>
  </svg>
);

const menuItems = [
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home, description: 'Overview & Status' },
  { id: 'parameters' as ViewType, label: 'Parameters', icon: Settings, description: 'Model Configuration' },
  { id: 'performance' as ViewType, label: 'Performance', icon: BarChart3, description: 'Model Metrics' },
  { id: 'predictions' as ViewType, label: 'Predictions', icon: FileText, description: 'Results & Files' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, expanded, onToggleExpand }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`relative flex-shrink-0 h-screen flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        expanded ? 'w-64' : 'w-14'
      }`}
    >
      {/* Header */}
      <div className="bg-bci-900 flex flex-col overflow-hidden">
        {/* Top row: logo + title + toggle */}
        <div className={`flex items-center px-2 pt-4 pb-2 ${expanded ? 'space-x-3' : 'justify-center'}`}>
          <BciCrossLogo className="w-8 h-8 flex-shrink-0" />
          {expanded && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white leading-tight tracking-tight truncate">B Magic</h1>
              <p className="text-xs text-bci-200 font-medium truncate">Blue Cross of Idaho</p>
            </div>
          )}
        </div>

        {/* Toggle expand button */}
        <button
          onClick={onToggleExpand}
          className={`flex items-center px-2 py-2 mb-1 mx-2 rounded-md hover:bg-white/10 transition-colors duration-200 ${
            expanded ? 'justify-end' : 'justify-center'
          }`}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu className="w-4 h-4 text-bci-200 flex-shrink-0" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center mx-2 mb-3 py-1.5 rounded-md hover:bg-white/10 transition-colors duration-200 border border-white/25 ${
            expanded ? 'px-3 space-x-2 justify-start' : 'justify-center px-0'
          }`}
          aria-label="Toggle theme"
          title={expanded ? undefined : (theme === 'light' ? 'Dark Mode' : 'Light Mode')}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-bci-200 flex-shrink-0" />
              {expanded && <span className="text-xs text-bci-200 whitespace-nowrap">Dark Mode</span>}
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-bci-200 flex-shrink-0" />
              {expanded && <span className="text-xs text-bci-200 whitespace-nowrap">Light Mode</span>}
            </>
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={expanded ? undefined : item.label}
              className={`w-full flex items-center rounded-lg transition-all duration-200 group ${
                expanded ? 'justify-between p-3' : 'justify-center p-2.5'
              } ${
                isActive
                  ? 'bg-bci-50 dark:bg-bci-900/40 text-bci-900 dark:text-bci-300 shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className={`flex items-center ${expanded ? 'space-x-3' : ''}`}>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-bci-800 dark:text-bci-300' : 'text-gray-500 dark:text-gray-400'}`} />
                {expanded && (
                  <div className="text-left min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</div>
                  </div>
                )}
              </div>
              {expanded && (
                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  isActive ? 'text-bci-700 dark:text-bci-300' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                }`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer status */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden transition-all duration-300 ${
            expanded ? 'p-4' : 'p-2 flex justify-center'
          }`}
          title={expanded ? undefined : (isAwsConfigured() ? 'AWS Connected' : 'Demo Mode')}
        >
          {expanded ? (
            <>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isAwsConfigured() ? 'bg-green-500' : 'bg-amber-400'}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Status</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {isAwsConfigured() ? 'AWS Connected' : 'Demo Mode (no credentials)'}
              </p>
            </>
          ) : (
            <div className={`w-2 h-2 rounded-full ${isAwsConfigured() ? 'bg-green-500' : 'bg-amber-400'}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
