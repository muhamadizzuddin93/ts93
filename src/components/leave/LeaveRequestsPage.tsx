import React, { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Paperclip } from 'lucide-react';
import { LeaveRequest } from '../../types';
import { mockLeaveRequests, mockUsers } from '../../data/mockData';

const LeaveRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'annual_leave' as LeaveRequest['leaveType'],
    startDate: '',
    endDate: '',
    reason: '',
  });

  const currentUser = mockUsers[0]; // Current user

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...formData,
      totalDays,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setRequests([...requests, newRequest]);
    setFormData({
      leaveType: 'annual_leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setShowNewRequest(false);
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved_hod': return 'bg-blue-100 text-blue-800';
      case 'approved_hr': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'approved_hod': return CheckCircle;
      case 'approved_hr': return CheckCircle;
      case 'rejected': return XCircle;
    }
  };

  const getLeaveTypeLabel = (type: LeaveRequest['leaveType']) => {
    switch (type) {
      case 'annual_leave': return 'Annual Leave';
      case 'medical_leave': return 'Medical Leave';
      case 'unpaid_leave': return 'Unpaid Leave';
      case 'time_off': return 'Time Off';
    }
  };

  const getLeaveBalance = (type: LeaveRequest['leaveType']) => {
    switch (type) {
      case 'annual_leave': return currentUser.annualLeaveBalance;
      case 'medical_leave': return currentUser.medicalLeaveBalance;
      case 'unpaid_leave': return currentUser.unpaidLeaveBalance;
      case 'time_off': return currentUser.timeOffBalance;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Leave Requests</h2>
        <button
          onClick={() => setShowNewRequest(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Annual Leave</p>
              <p className="text-2xl font-bold text-blue-600">{currentUser.annualLeaveBalance}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medical Leave</p>
              <p className="text-2xl font-bold text-green-600">{currentUser.medicalLeaveBalance}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid Leave</p>
              <p className="text-2xl font-bold text-red-600">{currentUser.unpaidLeaveBalance}</p>
            </div>
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time Off</p>
              <p className="text-2xl font-bold text-purple-600">{currentUser.timeOffBalance}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* New Request Form */}
      {showNewRequest && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Leave Request</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveRequest['leaveType'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="annual_leave">Annual Leave ({currentUser.annualLeaveBalance} days left)</option>
                  <option value="medical_leave">Medical Leave ({currentUser.medicalLeaveBalance} days left)</option>
                  <option value="unpaid_leave">Unpaid Leave</option>
                  <option value="time_off">Time Off ({currentUser.timeOffBalance} days left)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Balance
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold text-gray-900">
                    {getLeaveBalance(formData.leaveType)} days
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide reason for leave..."
                required
              />
            </div>

            {formData.leaveType === 'medical_leave' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Certificate (Required for Medical Leave)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Upload medical certificate
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowNewRequest(false);
                  setFormData({
                    leaveType: 'annual_leave',
                    startDate: '',
                    endDate: '',
                    reason: '',
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Request History</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {requests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            
            return (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {getLeaveTypeLabel(request.leaveType)}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {request.totalDays} day{request.totalDays > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Submitted {new Date(request.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{request.reason}</p>

                    {/* Approval Timeline */}
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-2 ${
                        request.hodApprovedAt ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          request.hodApprovedAt ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-xs">HOD Approval</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${
                        request.hrApprovedAt ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          request.hrApprovedAt ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-xs">HR Approval</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {requests.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests</h3>
            <p className="text-gray-500 mb-4">Submit your first leave request when you need time off.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestsPage;