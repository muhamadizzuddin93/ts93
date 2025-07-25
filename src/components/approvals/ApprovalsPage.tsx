import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Users, FileText } from 'lucide-react';
import { LeaveRequest, OvertimeRequest } from '../../types';
import { mockLeaveRequests, mockOvertimeRequests, mockUsers } from '../../data/mockData';

const ApprovalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leave' | 'overtime'>('leave');
  
  // Filter requests that need HOD approval
  const pendingLeaveRequests = mockLeaveRequests.filter(req => req.status === 'pending');
  const pendingOvertimeRequests = mockOvertimeRequests.filter(req => req.status === 'pending');

  const handleLeaveApproval = (requestId: string, approved: boolean) => {
    const action = approved ? 'approved' : 'rejected';
    const request = mockLeaveRequests.find(r => r.id === requestId);
    const user = mockUsers.find(u => u.id === request?.userId);
    
    if (approved) {
      console.log(`📧 Email sent to ${user?.email}: Your ${request?.leaveType.replace('_', ' ')} request has been approved by HOD`);
      alert(`Leave request approved! Email notification sent to ${user?.name}.`);
    } else {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        console.log(`📧 Email sent to ${user?.email}: Your ${request?.leaveType.replace('_', ' ')} request has been rejected. Reason: ${reason}`);
        alert(`Leave request rejected. Email notification sent to ${user?.name}.`);
      }
    }
  };

  const handleOvertimeApproval = (requestId: string, approved: boolean) => {
    const action = approved ? 'approved' : 'rejected';
    const request = mockOvertimeRequests.find(r => r.id === requestId);
    const user = mockUsers.find(u => u.id === request?.userId);
    
    if (approved) {
      console.log(`📧 Email sent to ${user?.email}: Your overtime request for ${request?.period} has been approved by HOD`);
      alert(`Overtime request approved! Email notification sent to ${user?.name}.`);
    } else {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        console.log(`📧 Email sent to ${user?.email}: Your overtime request for ${request?.period} has been rejected. Reason: ${reason}`);
        alert(`Overtime request rejected. Email notification sent to ${user?.name}.`);
      }
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Approvals</h2>
        <p className="text-gray-600 mt-1">Review and approve leave and overtime requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Leave Requests</p>
              <p className="text-2xl font-bold text-blue-600">{pendingLeaveRequests.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Overtime Requests</p>
              <p className="text-2xl font-bold text-amber-600">{pendingOvertimeRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('leave')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leave'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Leave Requests ({pendingLeaveRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('overtime')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overtime'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Overtime Requests ({pendingOvertimeRequests.length})</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'leave' && (
            <div className="space-y-4">
              {pendingLeaveRequests.length > 0 ? (
                pendingLeaveRequests.map((request) => {
                  const user = mockUsers.find(u => u.id === request.userId);
                  
                  return (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {getLeaveTypeLabel(request.leaveType)}
                            </h4>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{user?.name}</span>
                            </div>
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
                          </div>

                          <p className="text-gray-600 mb-3">{request.reason}</p>

                          <div className="text-sm text-gray-500">
                            Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleLeaveApproval(request.id, true)}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveApproval(request.id, false)}
                            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending leave requests</h3>
                  <p className="text-gray-500">All leave requests have been processed.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overtime' && (
            <div className="space-y-4">
              {pendingOvertimeRequests.length > 0 ? (
                pendingOvertimeRequests.map((request) => {
                  const user = mockUsers.find(u => u.id === request.userId);
                  
                  return (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              Overtime Request - {request.period}
                            </h4>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{user?.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {request.totalOvertimeHours}h overtime
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {request.overtimeEntries.length} entries
                              </span>
                            </div>
                          </div>

                          {/* Overtime Breakdown */}
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Overtime Breakdown:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                              <div className="bg-blue-50 p-2 rounded">
                                <span className="font-medium">Weekend:</span> {request.overtimeEntries.filter(e => e.reason === 'weekend').reduce((sum, e) => sum + e.hours, 0)}h
                              </div>
                              <div className="bg-red-50 p-2 rounded">
                                <span className="font-medium">Holiday:</span> {request.overtimeEntries.filter(e => e.reason === 'holiday').reduce((sum, e) => sum + e.hours, 0)}h
                              </div>
                              <div className="bg-orange-50 p-2 rounded">
                                <span className="font-medium">Excess:</span> {request.overtimeEntries.filter(e => e.reason === 'excess_hours').reduce((sum, e) => sum + e.hours, 0)}h
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500">
                            Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleOvertimeApproval(request.id, true)}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleOvertimeApproval(request.id, false)}
                            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending overtime requests</h3>
                  <p className="text-gray-500">All overtime requests have been processed.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;