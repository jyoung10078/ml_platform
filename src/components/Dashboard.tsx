import React, { useEffect, useState } from 'react';
import {
  Activity,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  getDashboardStatsData,
  getRecentActivity,
  DashboardStatsData,
  ActivityItem,
} from '../services/sagemakerService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStatsData(), getRecentActivity()])
      .then(([s, a]) => { setStats(s); setActivity(a); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          title: 'Active Models',
          value: String(stats.activeModels),
          icon: Brain,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          darkBg: 'dark:bg-blue-900/30',
          darkColor: 'dark:text-blue-400',
        },
        {
          title: 'Predictions Made',
          value: stats.totalPredictions.toLocaleString(),
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          darkBg: 'dark:bg-green-900/30',
          darkColor: 'dark:text-green-400',
        },
        {
          title: 'Avg. Accuracy',
          value: (stats.avgAccuracy * 100).toFixed(1) + '%',
          icon: CheckCircle,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          darkBg: 'dark:bg-emerald-900/30',
          darkColor: 'dark:text-emerald-400',
        },
        {
          title: 'Avg. Processing Time',
          value: stats.avgProcessingTimeSec.toFixed(1) + 's',
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          darkBg: 'dark:bg-amber-900/30',
          darkColor: 'dark:text-amber-400',
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor your predictive models and system performance</p>
        </div>
        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {loading ? (
              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {loading ? 'Loading…' : 'Live'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.darkBg}`}>
                    <Icon className={`w-6 h-6 ${stat.color} ${stat.darkColor}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-64" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activity.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  {item.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                </div>
                <Activity className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <h4 className="font-medium text-gray-900 dark:text-white">Configure New Model</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Set up parameters for training</p>
          </button>
          <button className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <h4 className="font-medium text-gray-900 dark:text-white">View Performance</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Check model metrics and trends</p>
          </button>
          <button className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <h4 className="font-medium text-gray-900 dark:text-white">Download Predictions</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Export latest prediction results</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
