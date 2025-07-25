import React, { useState } from 'react';
import { Upload, Calendar, Clock, Save, AlertCircle } from 'lucide-react';
import { BatchUpdate } from '../../types';
import { mockProjects, mockTasks } from '../../data/mockData';

const BatchUpdatePage: React.FC = () => {
  const [batchUpdates, setBatchUpdates] = useState<BatchUpdate[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'full_day' as BatchUpdate['timeSlot'],
    projectId: '',
    taskId: '',
    description: '',
  });

  const availableTasks = mockTasks.filter(task => task.projectId === formData.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId || !formData.taskId || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newBatchUpdate: BatchUpdate = {
      id: Date.now().toString(),
      userId: '1', // Current user
      ...formData,
      createdAt: new Date().toISOString(),
    };

    setBatchUpdates([...batchUpdates, newBatchUpdate]);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'full_day',
      projectId: '',
      taskId: '',
      description: '',
    });
  };

  const getTimeSlotLabel = (slot: BatchUpdate['timeSlot']) => {
    switch (slot) {
      case 'morning': return 'Morning (4 hours)';
      case 'afternoon': return 'Afternoon (4 hours)';
      case 'full_day': return 'Full Day (8 hours)';
    }
  };

  const getTimeSlotHours = (slot: BatchUpdate['timeSlot']) => {
    switch (slot) {
      case 'morning': return 4;
      case 'afternoon': return 4;
      case 'full_day': return 8;
    }
  };

  const applyBatchUpdates = () => {
    if (batchUpdates.length === 0) {
      alert('No batch updates to apply');
      return;
    }

    // In a real application, this would send the batch updates to the server
    alert(`Applied ${batchUpdates.length} batch update(s) successfully!`);
    setBatchUpdates([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Batch Update</h2>
          <p className="text-gray-600 mt-1">Quickly assign time blocks to projects and tasks</p>
        </div>
        {batchUpdates.length > 0 && (
          <button
            onClick={applyBatchUpdates}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Apply {batchUpdates.length} Update{batchUpdates.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Batch Update Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Create Batch Update</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Slot *
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as BatchUpdate['timeSlot'] })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="morning">Morning Session (4 hours)</option>
                <option value="afternoon">Afternoon Session (4 hours)</option>
                <option value="full_day">Full Day (8 hours)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  setFormData({ ...formData, projectId: e.target.value, taskId: '' });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a project</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task *
              </label>
              <select
                value={formData.taskId}
                onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!formData.projectId}
                required
              >
                <option value="">Select a task</option>
                {availableTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the work to be done during this time slot..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add to Batch
            </button>
          </div>
        </form>
      </div>

      {/* Pending Batch Updates */}
      {batchUpdates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Pending Batch Updates ({batchUpdates.length})
              </h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Review and apply these batch updates to your timesheet
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {batchUpdates.map((update, index) => {
              const project = mockProjects.find(p => p.id === update.projectId);
              const task = mockTasks.find(t => t.id === update.taskId);
              
              return (
                <div key={update.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {index + 1}
                        </span>
                        <h4 className="text-lg font-medium text-gray-900">
                          {project?.name} - {task?.name}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {getTimeSlotLabel(update.timeSlot)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-600">
                            {getTimeSlotHours(update.timeSlot)} hours
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600">{update.description}</p>
                    </div>

                    <button
                      onClick={() => setBatchUpdates(batchUpdates.filter(b => b.id !== update.id))}
                      className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How Batch Update Works</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Select a date and time slot (morning, afternoon, or full day)</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Choose the project and task you want to assign to that time slot</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Add multiple batch updates before applying them all at once</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Review your pending updates and click "Apply" to add them to your timesheet</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BatchUpdatePage;