import React, { useState } from 'react';
import { Calendar, Clock, Flag, Users, Plus, Edit } from 'lucide-react';
import { Task, User } from '../../types';
import { mockTasks, mockProjects, mockUsers, mockTimesheetEntries } from '../../data/mockData';

const TeamTasksKanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks.filter(t => t.taskType === 'project'));
  
  const teamMembers = mockUsers.filter(user => user.role === 'employee');
  
  // Get task progress
  const getTaskProgress = (taskId: string, estimatedHours?: number) => {
    const taskEntries = mockTimesheetEntries.filter(entry => entry.taskId === taskId);
    const actualHours = taskEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
    
    if (!estimatedHours || estimatedHours === 0) return { actualHours, progress: 0 };
    
    const progress = Math.min((actualHours / estimatedHours) * 100, 100);
    return { actualHours, progress };
  };

  // Determine task status
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

  // Group tasks by status
  const tasksByStatus = {
    not_started: tasks.filter(task => getTaskStatus(task) === 'not_started'),
    in_progress: tasks.filter(task => getTaskStatus(task) === 'in_progress'),
    completed: tasks.filter(task => getTaskStatus(task) === 'completed'),
    overdue: tasks.filter(task => getTaskStatus(task) === 'overdue'),
  };

  const columns = [
    { id: 'not_started', title: 'Not Started', color: 'bg-gray-100', count: tasksByStatus.not_started.length },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100', count: tasksByStatus.in_progress.length },
    { id: 'completed', title: 'Completed', color: 'bg-green-100', count: tasksByStatus.completed.length },
    { id: 'overdue', title: 'Overdue', color: 'bg-red-100', count: tasksByStatus.overdue.length },
  ];

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

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const project = mockProjects.find(p => p.id === task.projectId);
    const assignedUsers = teamMembers.filter(user => task.assignedTo?.includes(user.id));
    const { actualHours, progress } = getTaskProgress(task.id, task.estimatedHours);
    const daysUntilDue = getDaysUntilDue(task.dueDate);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm">{task.name}</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <Edit className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-gray-600 mb-2">{project?.name}</div>

        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        {/* Priority and Due Date */}
        <div className="flex items-center justify-between mb-3">
          {task.priority && (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
              <Flag className="w-3 h-3 mr-1" />
              {task.priority.toUpperCase()}
            </span>
          )}
          
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className={`text-xs ${
                daysUntilDue !== null && daysUntilDue < 0 ? 'text-red-600' :
                daysUntilDue !== null && daysUntilDue <= 3 ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {task.estimatedHours && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{actualHours}h / {task.estimatedHours}h</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
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

        {/* Assigned Users */}
        {assignedUsers.length > 0 && (
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-gray-500" />
            <div className="flex -space-x-1">
              {assignedUsers.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white"
                  title={user.name}
                >
                  <span className="text-xs font-medium text-blue-800">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              ))}
              {assignedUsers.length > 3 && (
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-xs font-medium text-gray-600">
                    +{assignedUsers.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Team Tasks - Kanban View</h2>
          <p className="text-gray-600 mt-1">Visual overview of team task progress</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4">
            <div className={`${column.color} rounded-lg p-3 mb-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                  {column.count}
                </span>
              </div>
            </div>

            <div className="space-y-3 min-h-96">
              {tasksByStatus[column.id as keyof typeof tasksByStatus].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {tasksByStatus[column.id as keyof typeof tasksByStatus].length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No tasks in this column</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tasksByStatus.in_progress.length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{tasksByStatus.overdue.length}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTasksKanban;