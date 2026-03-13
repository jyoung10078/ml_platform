import React, { useState } from 'react';
import { 
  Save, 
  Play, 
  Settings, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  Upload 
} from 'lucide-react';
import { ModelParameter } from '../types';

const ParameterInput: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [parameters, setParameters] = useState<ModelParameter[]>([
    {
      id: 'model_type',
      name: 'model_type',
      label: 'Model Type',
      type: 'select',
      required: true,
      options: ['Random Forest', 'XGBoost', 'Neural Network', 'Linear Regression'],
      value: 'Random Forest',
      description: 'Select the machine learning algorithm to use'
    },
    {
      id: 'training_data',
      name: 'training_data',
      label: 'Training Data Path',
      type: 'text',
      required: true,
      value: 's3://ml-bucket/training-data.csv',
      description: 'S3 path to your training dataset'
    },
    {
      id: 'max_depth',
      name: 'max_depth',
      label: 'Max Depth',
      type: 'number',
      required: false,
      min: 1,
      max: 50,
      value: 10,
      description: 'Maximum depth of the decision trees'
    },
    {
      id: 'n_estimators',
      name: 'n_estimators',
      label: 'Number of Estimators',
      type: 'number',
      required: false,
      min: 10,
      max: 1000,
      value: 100,
      description: 'Number of trees in the forest'
    },
    {
      id: 'learning_rate',
      name: 'learning_rate',
      label: 'Learning Rate',
      type: 'number',
      required: false,
      min: 0.001,
      max: 1.0,
      value: 0.1,
      description: 'Step size for model training'
    },
    {
      id: 'cross_validation',
      name: 'cross_validation',
      label: 'Enable Cross Validation',
      type: 'boolean',
      required: false,
      value: true,
      description: 'Use k-fold cross validation for model evaluation'
    },
    {
      id: 'test_size',
      name: 'test_size',
      label: 'Test Set Size',
      type: 'number',
      required: false,
      min: 0.1,
      max: 0.5,
      value: 0.2,
      description: 'Proportion of data to use for testing (0.1-0.5)'
    },
    {
      id: 'random_state',
      name: 'random_state',
      label: 'Random Seed',
      type: 'number',
      required: false,
      min: 0,
      max: 99999,
      value: 42,
      description: 'Random seed for reproducible results'
    }
  ]);

  const handleParameterChange = (id: string, value: any) => {
    setParameters(prev => 
      prev.map(param => 
        param.id === id ? { ...param, value } : param
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call to AWS
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would send the parameters to your AWS system
      console.log('Submitting parameters:', parameters);
      
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderParameter = (param: ModelParameter) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
    
    switch (param.type) {
      case 'select':
        return (
          <select
            id={param.id}
            value={param.value || ''}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className={baseClasses}
            required={param.required}
          >
            {param.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              id={param.id}
              type="checkbox"
              checked={param.value || false}
              onChange={(e) => handleParameterChange(param.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={param.id} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {param.label}
            </label>
          </div>
        );
      
      case 'number':
        return (
          <input
            id={param.id}
            type="number"
            value={param.value || ''}
            onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value) || 0)}
            className={baseClasses}
            required={param.required}
            min={param.min}
            max={param.max}
            step={param.min && param.min < 1 ? 0.001 : 1}
          />
        );
      
      default:
        return (
          <input
            id={param.id}
            type="text"
            value={param.value || ''}
            onChange={(e) => handleParameterChange(param.id, e.target.value)}
            className={baseClasses}
            required={param.required}
          />
        );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Model Parameters</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your predictive model settings</p>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-300 font-medium">Model training initiated successfully!</span>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-300 font-medium">Failed to submit parameters. Please try again.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Training Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parameters.map(param => (
              <div key={param.id} className={param.type === 'boolean' ? 'md:col-span-2' : ''}>
                {param.type !== 'boolean' && (
                  <label htmlFor={param.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {param.label}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}

                {renderParameter(param)}

                {param.description && (
                  <div className="flex items-start mt-2">
                    <HelpCircle className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">{param.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Upload</h3>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">Drop your training files here or click to browse</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Supports CSV, JSON, and Parquet files up to 100MB</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Select Files
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 inline border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Training Model...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 inline" />
                Start Training
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParameterInput;