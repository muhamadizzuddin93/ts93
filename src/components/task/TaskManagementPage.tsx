import React, { useState } from 'react';
import { Plus, Calendar, Clock, Flag, Users, CheckSquare, Edit, Trash2, Mail } from 'lucide-react';
import { Task, Project } from '../../types';
import { mockTasks, mockProjects, mockUsers } from '../../data/mockData';

const TaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks.filter(t => t.taskType === 'project'));
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
    estimatedHours: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    assignedTo: [] as string[],
  });

  const teamMembers = mockUsers.filter(user => user.role === 'employee');
  const activeProjects = mockProjects.filter(p => p.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.projectId || !formData.estimatedHours) {
      alert('Please fill in all required fields');
      return;
    }

    const taskData = {
      ...formData,
      estimatedHours: parseFloat(formData.estimatedHours),
      isBillable: mockProjects.find(p => p.id === formData.projectId)?.isBillable || false,
      taskType: 'project' as const,
      createdBy: '6', // IT Admin
      assignedBy: '2', // Current HOD
    };

    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...editingTask, ...taskData }
          : t
      ));
      alert('Task updated successfully!');
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        status: 'not_started',
        ...taskData,
      };
      setTasks([...tasks, newTask]);
      
      // Send email notifications to assigned users
      formData.assignedTo.forEach(userId => {
        const user = mockUsers.find(u => u.id === userId);
        const project = mockProjects.find(p => p.id === formData.projectId);
        console.log(`📧 Email sent to ${user?.email}: New task "${formData.name}" assigned in project "${project?.name}". Due: ${formData.dueDate}`);
      });
      
      alert(`Task created successfully! Email notifications sent to ${formData.assignedTo.length} assignee(s).`);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      projectId: '',
      estimatedHours: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: [],
    });
    setShowCreateForm(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description || '',
      projectId: task.projectId,
      estimatedHours: task.estimatedHours?.toString() || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      assignedTo: task.assignedTo || [],
    });
    setShowCreateForm(true);
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
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

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Task Management</h2>
          <p className="text-gray-600 mt-1">Create and manage tasks for your team</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Create/Edit Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a project</option>
                  {activeProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the task requirements..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Hours *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="8"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {teamMembers.map((user) => (
                  <label key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.assignedTo.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, assignedTo: [...formData.assignedTo, user.id] });
                        } else {
                          setFormData({ ...formData, assignedTo: formData.assignedTo.filter(id => id !== user.id) });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                {editingTask ? 'Update Task' : 'Create & Notify'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tasks ({tasks.length})</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const project = mockProjects.find(p => p.id === task.projectId);
            const assignedUsers = teamMembers.filter(user => task.assignedTo?.includes(user.id));
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            
            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{task.name}</h4>
                      {task.priority && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority.toUpperCase()}
                        </span>
                      )}
                      {task.status && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
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
                      {task.estimatedHours && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {task.estimatedHours}h estimated
                          </span>
                        </div>
                      )}

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

                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {assignedUsers.length} assignee(s)
                        </span>
                      </div>
                    </div>

                    {/* Assigned Users */}
                    {assignedUsers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {assignedUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded-full">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-800">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-xs text-blue-800">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="p-12 text-center">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks created yet</h3>
            <p className="text-gray-500 mb-4">Create your first task to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagementPage;