import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Users, Clock, BarChart3 } from 'lucide-react';
import { HourVariance, TaskVariance } from '../../types';
import { mockHourVariances, mockTaskVariances } from '../../data/mockData';

const VarianceAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hours' | 'tasks'>('hours');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');

  const hourVariances = mockHourVariances.filter(v => v.month === selectedMonth);
  const taskVariances = mockTaskVariances;

  const totalExpectedHours = hourVariances.reduce((sum, v) => sum + v.expectedHours, 0);
  const totalActualHours = hourVariances.reduce((sum, v) => sum + v.actualHours, 0);
  const totalVariance = totalActualHours - totalExpectedHours;
  const totalVariancePercentage = totalExpectedHours > 0 ? (totalVariance / totalExpectedHours) * 100 : 0;

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600';
    if (variance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getVarianceBgColor = (variance: number) => {
    if (variance > 0) return 'bg-red-50 border-red-200';
    if (variance < 0) return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return TrendingUp;
    if (variance < 0) return TrendingDown;
    return BarChart3;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Variance Analysis</h2>
          <p className="text-gray-600 mt-1">Monitor differences between expected and actual hours</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-04">April 2024</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expected Hours</p>
              <p className="text-2xl font-bold text-blue-600">{totalExpectedHours}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actual Hours</p>
              <p className="text-2xl font-bold text-green-600">{totalActualHours}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Variance</p>
              <p className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
                {totalVariance > 0 ? '+' : ''}{totalVariance.toFixed(1)}h
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${getVarianceColor(totalVariance)}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Variance %</p>
              <p className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
                {totalVariancePercentage > 0 ? '+' : ''}{totalVariancePercentage.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${getVarianceColor(totalVariance)}`} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Employee Hours Variance</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <span>Task Hours Variance</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Employee Hours Variance</h3>
              <div className="space-y-3">
                {hourVariances.map((variance) => {
                  const VarianceIcon = getVarianceIcon(variance.variance);
                  
                  return (
                    <div
                      key={variance.userId}
                      className={`p-4 rounded-lg border-2 ${getVarianceBgColor(variance.variance)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{variance.userName}</h4>
                            <span className="text-sm text-gray-600">{variance.department}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">Expected:</span>
                              <span className="font-medium ml-2">{variance.expectedHours}h</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Actual:</span>
                              <span className="font-medium ml-2">{variance.actualHours}h</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Variance:</span>
                              <span className={`font-medium ml-2 ${getVarianceColor(variance.variance)}`}>
                                {variance.variance > 0 ? '+' : ''}{variance.variance}h
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Variance %:</span>
                              <span className={`font-medium ml-2 ${getVarianceColor(variance.variance)}`}>
                                {variance.variancePercentage > 0 ? '+' : ''}{variance.variancePercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <VarianceIcon className={`w-8 h-8 ${getVarianceColor(variance.variance)}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Task Hours Variance</h3>
              <div className="space-y-3">
                {taskVariances.map((variance) => {
                  const VarianceIcon = getVarianceIcon(variance.variance);
                  
                  return (
                    <div
                      key={variance.taskId}
                      className={`p-4 rounded-lg border-2 ${getVarianceBgColor(variance.variance)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{variance.taskName}</h4>
                            <span className="text-sm text-gray-600">{variance.projectName}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                            <div>
                              <span className="text-sm text-gray-600">Estimated:</span>
                              <span className="font-medium ml-2">{variance.estimatedHours}h</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Actual:</span>
                              <span className="font-medium ml-2">{variance.actualHours}h</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Variance:</span>
                              <span className={`font-medium ml-2 ${getVarianceColor(variance.variance)}`}>
                                {variance.variance > 0 ? '+' : ''}{variance.variance}h
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Variance %:</span>
                              <span className={`font-medium ml-2 ${getVarianceColor(variance.variance)}`}>
                                {variance.variancePercentage > 0 ? '+' : ''}{variance.variancePercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            Assigned to: {variance.assignedUsers.length} user(s)
                          </div>
                        </div>
                        
                        <VarianceIcon className={`w-8 h-8 ${getVarianceColor(variance.variance)}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Variance Alert Thresholds</h3>
            <ul className="space-y-1 text-amber-800">
              <li>• <strong>Green:</strong> Under-utilized hours (negative variance)</li>
              <li>• <strong>Red:</strong> Over-utilized hours (positive variance)</li>
              <li>• <strong>Critical:</strong> Variance greater than ±20%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarianceAnalysisPage;