import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  RefreshCw,
  Download,
  Eye,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { ModelPerformance as ModelPerformanceType } from '../types';
import { getModelPerformances } from '../services/sagemakerService';

const ModelPerformance: React.FC = () => {
  const [models, setModels] = useState<ModelPerformanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('7d');

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    const data = await getModelPerformances();
    setModels(data);
    if (!selectedModel && data.length > 0) setSelectedModel(data[0].modelId);
    if (isRefresh) setRefreshing(false); else setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const currentModel = models.find(m => m.modelId === selectedModel) ?? models[0];
  const latestMetrics = currentModel?.metrics[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':   return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'training': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'error':    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:         return 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-400';
    }
  };

  const fmt = (v: number | undefined) => v === undefined ? 'N/A' : (v * 100).toFixed(1) + '%';
  const fmtNum = (v: number | undefined) => v === undefined ? 'N/A' : v.toFixed(2);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading performance data…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Model Performance</h2>
            <p className="text-gray-600 dark:text-gray-400">Monitor metrics and trends across your models</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map(model => (
            <button
              key={model.modelId}
              onClick={() => setSelectedModel(model.modelId)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedModel === model.modelId
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{model.modelName}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Last updated: {model.lastUpdated.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Training time: {model.trainingTime}min
              </p>
            </button>
          ))}
        </div>
      </div>

      {currentModel && latestMetrics && (
        <>
          {/* Current Model Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Accuracy', value: fmt(latestMetrics.accuracy) },
                  { label: 'Precision', value: fmt(latestMetrics.precision) },
                  { label: 'Recall', value: fmt(latestMetrics.recall) },
                  { label: 'F1 Score', value: fmt(latestMetrics.f1Score) },
                  ...(latestMetrics.rmse !== undefined ? [{ label: 'RMSE', value: fmtNum(latestMetrics.rmse) }] : []),
                  ...(latestMetrics.r2Score !== undefined ? [{ label: 'R² Score', value: fmtNum(latestMetrics.r2Score) }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trend placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trend</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">Performance chart visualization</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chart component would be integrated here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historical Performance</h3>
                <button className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Date', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentModel.metrics.map((metric, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{metric.timestamp.toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fmt(metric.accuracy)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fmt(metric.precision)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fmt(metric.recall)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{fmt(metric.f1Score)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Alerts</h3>
        <div className="space-y-3">
          {models.some(m => m.metrics[0]?.accuracy < 0.90) ? (
            models
              .filter(m => m.metrics[0]?.accuracy < 0.90)
              .map(m => (
                <div key={m.modelId} className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-300">Model accuracy below threshold</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {m.modelName} accuracy at {(m.metrics[0].accuracy * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">All models within threshold</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">No accuracy alerts at this time</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
