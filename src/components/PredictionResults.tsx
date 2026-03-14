import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Calendar,
  BarChart,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { PredictionFile } from '../types';

const PredictionResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<PredictionFile | null>(null);

  const predictionFiles: PredictionFile[] = [
    {
      id: '1',
      filename: 'customer_churn_predictions_2024-01-15.csv',
      size: 2.4,
      recordCount: 15420,
      uploadDate: new Date('2024-01-15T14:30:00'),
      modelId: 'customer-churn',
      modelName: 'Customer Churn Prediction',
      accuracy: 0.942,
      status: 'completed'
    },
    {
      id: '2',
      filename: 'sales_forecast_Q1_2024.csv',
      size: 1.8,
      recordCount: 8760,
      uploadDate: new Date('2024-01-15T13:15:00'),
      modelId: 'sales-forecast',
      modelName: 'Sales Forecasting',
      accuracy: 0.887,
      status: 'completed'
    },
    {
      id: '3',
      filename: 'fraud_detection_batch_001.csv',
      size: 5.2,
      recordCount: 25000,
      uploadDate: new Date('2024-01-15T12:00:00'),
      modelId: 'fraud-detection',
      modelName: 'Fraud Detection',
      accuracy: 0.965,
      status: 'processing'
    },
    {
      id: '4',
      filename: 'customer_segments_analysis.csv',
      size: 3.1,
      recordCount: 12000,
      uploadDate: new Date('2024-01-14T16:45:00'),
      modelId: 'customer-churn',
      modelName: 'Customer Churn Prediction',
      accuracy: 0.938,
      status: 'completed'
    },
    {
      id: '5',
      filename: 'monthly_sales_predictions.csv',
      size: 0.9,
      recordCount: 3000,
      uploadDate: new Date('2024-01-14T11:30:00'),
      modelId: 'sales-forecast',
      modelName: 'Sales Forecasting',
      accuracy: 0.883,
      status: 'failed'
    }
  ];

  const filteredFiles = predictionFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.modelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${Math.round(sizeInMB * 1000)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prediction Results</h2>
            <p className="text-gray-600 dark:text-gray-400">Download and analyze prediction files</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
            <Download className="w-4 h-4" />
            <span>Bulk Download</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{predictionFiles.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(predictionFiles.reduce((sum, file) => sum + file.recordCount, 0))}
              </p>
            </div>
            <BarChart className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Accuracy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {((predictionFiles.reduce((sum, file) => sum + file.accuracy, 0) / predictionFiles.length) * 100).toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {predictionFiles.filter(f => f.status === 'processing').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredFiles.length} of {predictionFiles.length} files
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{file.filename}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{file.modelName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{formatNumber(file.recordCount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{formatFileSize(file.size)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{(file.accuracy * 100).toFixed(1)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                      {getStatusIcon(file.status)}
                      <span className="ml-1 capitalize">{file.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{file.uploadDate.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{file.uploadDate.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedFile(file)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        title="Download"
                        disabled={file.status !== 'completed'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">File Details</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filename</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{selectedFile.filename}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{selectedFile.modelName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Records</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{formatNumber(selectedFile.recordCount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">File Size</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{(selectedFile.accuracy * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedFile.status)}`}>
                      {getStatusIcon(selectedFile.status)}
                      <span className="ml-1 capitalize">{selectedFile.status}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Date</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{selectedFile.uploadDate.toLocaleDateString()} at {selectedFile.uploadDate.toLocaleTimeString()}</p>
              </div>
              
              <div className="flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  disabled={selectedFile.status !== 'completed'}
                >
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;