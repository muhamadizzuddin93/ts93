import React, { useState } from 'react';
import { Plus, HelpCircle, AlertCircle, CheckCircle, Clock, Paperclip, Send } from 'lucide-react';
import { ITTicket } from '../../types';
import { mockITTickets } from '../../data/mockData';

const ITSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<ITTicket[]>(mockITTickets);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as ITTicket['priority'],
    category: 'other' as ITTicket['category'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: ITTicket = {
      id: Date.now().toString(),
      userId: '1', // Current user
      ...formData,
      status: 'open',
      submittedAt: new Date().toISOString(),
    };

    setTickets([...tickets, newTicket]);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'other',
    });
    setShowNewTicket(false);
  };

  const getStatusColor = (status: ITTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ITTicket['status']) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in_progress': return Clock;
      case 'resolved': return CheckCircle;
      case 'closed': return CheckCircle;
    }
  };

  const getPriorityColor = (priority: ITTicket['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">IT Support</h2>
        <button
          onClick={() => setShowNewTicket(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit IT Support Ticket</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ITTicket['category'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="access">Access/Permissions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as ITTicket['priority'] })}
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
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide detailed information about the issue..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewTicket(false);
                  setFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    category: 'other',
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Tickets</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {tickets.map((ticket) => {
            const StatusIcon = getStatusIcon(ticket.status);
            
            return (
              <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{ticket.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{ticket.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {ticket.category.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(ticket.submittedAt).toLocaleDateString()}</span>
                      {ticket.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigned to IT</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tickets.length === 0 && (
          <div className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
            <p className="text-gray-500 mb-4">Submit your first IT support ticket when you need help.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ITSupportPage;