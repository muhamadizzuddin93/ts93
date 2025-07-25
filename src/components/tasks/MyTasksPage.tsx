import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Target, Flag, User } from 'lucide-react';
import { Task, Project } from '../../types';
import { mockTasks, mockProjects, mockTimesheetEntries } from '../../data/mockData';

const MyTasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed' | 'overdue'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');

  const currentUserId = '1'; // This should come from auth context
  
  // Get tasks assigned to current user
  const myTasks = mockTasks.filter(task => 
    task.assignedTo?.includes(currentUserId) && task.taskType === 'project'
  );

  // Calculate task progress
  const getTaskProgress = (taskId: string, estimatedHours?: number) => {
    const taskEntries = mockTimesheetEntries.filter(entry => 
      entry.taskId === taskId && entry.userId === currentUserId
    );
    const actualHours = taskEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
    
    if (!estimatedHours || estimatedHours === 0) return { actualHours, progress: 0 };
    
    const progress = Math.min((actualHours / estimatedHours) * 100, 100);
    return { actualHours, progress };
  };

  // Determine task status based on due date and progress
  const getTaskStatus = (task: Task): Task['status'] => {
    if (task.status) return task.status;
    
    const { progress } = getTaskProgress(task.id, task.estimatedHours);
    const today = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    
    if (progress >= 100) return 'completed';
    if (dueDate && dueDate < today && progress < 100) return 'overdue';
    if (progress > 0) return 'in_progress';
    return 'not_started';
  };

  // Filter tasks
  const filteredTasks = myTasks.filter(task => {
    const status = getTaskStatus(task);
    const statusMatch = filterStatus === 'all' || status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Sort tasks by priority and due date
  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'not_started': return AlertCircle;
      case 'in_progress': return Clock;
      case 'completed': return CheckCircle;
      case 'overdue': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const taskStats = {
    total: myTasks.length,
    notStarted: myTasks.filter(t => getTaskStatus(t) === 'not_started').length,
    inProgress: myTasks.filter(t => getTaskStatus(t) === 'in_progress').length,
    completed: myTasks.filter(t => getTaskStatus(t) === 'completed').length,
    overdue: myTasks.filter(t => getTaskStatus(t) === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Tasks</h2>
          <p className="text-gray-600 mt-1">Track your assigned tasks and progress</p>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <Target className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-600">{taskStats.notStarted}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tasks ({sortedTasks.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedTasks.map((task) => {
            const project = mockProjects.find(p => p.id === task.projectId);
            const status = getTaskStatus(task);
            const StatusIcon = getStatusIcon(status);
            const { actualHours, progress } = getTaskProgress(task.id, task.estimatedHours);
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            
            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{task.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status?.replace('_', ' ').toUpperCase()}
                      </span>
                      {task.priority && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-600">{project?.name}</span>
                      {task.isBillable && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Billable
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-3">{task.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      {task.dueDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          {daysUntilDue !== null && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              daysUntilDue < 0 ? 'bg-red-100 text-red-800' :
                              daysUntilDue <= 3 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                               daysUntilDue === 0 ? 'Due today' :
                               `${daysUntilDue} days left`}
                            </span>
                          )}
                        </div>
                      )}

                      {task.estimatedHours && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {actualHours}h / {task.estimatedHours}h
                          </span>
                        </div>
                      )}

                      {task.assignedBy && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Assigned by HOD
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {task.estimatedHours && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              progress >= 100 ? 'bg-green-500' :
                              progress >= 75 ? 'bg-blue-500' :
                              progress >= 50 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedTasks.length === 0 && (
          <div className="p-12 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {filterStatus !== 'all' || filterPriority !== 'all' 
                ? 'Try adjusting your filters to see more tasks.'
                : 'You have no assigned tasks at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;