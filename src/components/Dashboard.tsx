import React from 'react';
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Active Models',
      value: '3',
      change: '+2 this week',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Predictions Made',
      value: '12,847',
      change: '+23% from last month',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg. Accuracy',
      value: '94.2%',
      change: '+1.3% improvement',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Processing Time',
      value: '2.3s',
      change: '-0.4s faster',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'model_trained',
      title: 'Customer Churn Model completed training',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'prediction_batch',
      title: 'Batch prediction job processed 1,200 records',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'model_deployed',
      title: 'Sales Forecast Model deployed to production',
      time: '6 hours ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Model accuracy dropped below threshold',
      time: '1 day ago',
      status: 'warning'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor your predictive models and system performance</p>
        </div>
        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${
                  stat.bgColor === 'bg-blue-50' ? 'dark:bg-blue-900/30' :
                  stat.bgColor === 'bg-green-50' ? 'dark:bg-green-900/30' :
                  stat.bgColor === 'bg-emerald-50' ? 'dark:bg-emerald-900/30' :
                  stat.bgColor === 'bg-amber-50' ? 'dark:bg-amber-900/30' : ''
                }`}>
                  <Icon className={`w-6 h-6 ${stat.color} ${
                    stat.color === 'text-blue-600' ? 'dark:text-blue-400' :
                    stat.color === 'text-green-600' ? 'dark:text-green-400' :
                    stat.color === 'text-emerald-600' ? 'dark:text-emerald-400' :
                    stat.color === 'text-amber-600' ? 'dark:text-amber-400' : ''
                  }`} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                {activity.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
              <Activity className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
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