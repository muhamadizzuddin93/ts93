import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, Paperclip, Upload, FileText } from 'lucide-react';
import { OvertimeRequest, OvertimeEntry } from '../../types';
import { mockOvertimeRequests, mockTimesheetEntries, mockProjects, mockTasks } from '../../data/mockData';

const OvertimePage: React.FC = () => {
  const [requests, setRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedPeriod, setSelectedPeriod] = useState<'first_half' | 'second_half'>('first_half');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Get overtime entries from timesheet data
  const getOvertimeEntriesForPeriod = (year: number, period: 'first_half' | 'second_half') => {
    const startMonth = period === 'first_half' ? 1 : 7;
    const endMonth = period === 'first_half' ? 6 : 12;
    
    return mockTimesheetEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth() + 1;
        
        return entryYear === year && 
               entryMonth >= startMonth && 
               entryMonth <= endMonth && 
               entry.isOvertime && 
               entry.overtimeHours && 
               entry.overtimeHours > 0;
      })
      .map(entry => {
        const project = mockProjects.find(p => p.id === entry.projectId);
        const task = mockTasks.find(t => t.id === entry.taskId);
        
        return {
          id: entry.id,
          date: entry.date,
          projectName: project?.name || 'Unknown Project',
          taskName: task?.name || 'Unknown Task',
          hours: entry.overtimeHours || 0,
          description: entry.description,
          reason: entry.isWeekend ? 'weekend' : 
                 entry.isHoliday ? 'holiday' : 
                 'excess_hours'
        } as OvertimeEntry;
      });
  };

  const getStatusColor = (status: OvertimeRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved_hod': return 'bg-blue-100 text-blue-800';
      case 'approved_finance': return 'bg-indigo-100 text-indigo-800';
      case 'approved_management': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: OvertimeRequest['status']) => {
    switch (status) {
      case 'pending': return 'Pending HOD Approval';
      case 'approved_hod': return 'Approved by HOD';
      case 'approved_finance': return 'Approved by Finance';
      case 'approved_management': return 'Fully Approved';
      case 'rejected': return 'Rejected';
    }
  };

  const getStatusIcon = (status: OvertimeRequest['status']) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'approved_hod':
      case 'approved_finance':
        return CheckCircle;
      case 'approved_management': return CheckCircle;
      case 'rejected': return XCircle;
    }
  };

  const getPeriodLabel = (period: 'first_half' | 'second_half') => {
    return period === 'first_half' ? '1st Half' : '2nd Half';
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'weekend': return 'Weekend Work';
      case 'holiday': return 'Holiday Work';
      case 'excess_hours': return 'Excess Hours';
      default: return reason;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'weekend': return 'bg-blue-100 text-blue-800';
      case 'holiday': return 'bg-red-100 text-red-800';
      case 'excess_hours': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    
    setAttachments([...attachments, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = () => {
    const overtimeEntries = getOvertimeEntriesForPeriod(selectedYear, selectedPeriod);
    const totalHours = overtimeEntries.reduce((sum, entry) => sum + entry.hours, 0);

    if (totalHours === 0) {
      alert('No overtime hours found for the selected period');
      return;
    }

    const newRequest: OvertimeRequest = {
      id: Date.now().toString(),
      userId: '1',
      period: `${selectedYear}-${selectedPeriod === 'first_half' ? 'H1' : 'H2'}`,
      periodType: selectedPeriod,
      year: selectedYear,
      totalOvertimeHours: totalHours,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      attachments: attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        fileName: file.name,
        fileType: file.type === 'application/pdf' ? 'pdf' : 'image',
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      })),
      overtimeEntries
    };

    setRequests([...requests, newRequest]);
    setShowNewRequest(false);
    setAttachments([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Overtime Requests</h2>
        <button
          onClick={() => setShowNewRequest(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Clock className="w-4 h-4 mr-2" />
          New Request
        </button>
      </div>

      {/* New Request Form */}
      {showNewRequest && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Overtime Request</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2025}>2025</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period *
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as 'first_half' | 'second_half')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="first_half">1st Half (Jan - Jun)</option>
                  <option value="second_half">2nd Half (Jul - Dec)</option>
                </select>
              </div>
            </div>

            {/* Overtime Summary */}
            {(() => {
              const overtimeEntries = getOvertimeEntriesForPeriod(selectedYear, selectedPeriod);
              const totalHours = overtimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
              
              return (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Overtime Summary - {selectedYear} {getPeriodLabel(selectedPeriod)}
                  </h4>
                  
                  {overtimeEntries.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-blue-600">{totalHours} hours</div>
                        <div className="text-sm text-gray-600">{overtimeEntries.length} overtime entries</div>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {overtimeEntries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{entry.projectName} - {entry.taskName}</div>
                              <div className="text-xs text-gray-600">{new Date(entry.date).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{entry.hours}h</div>
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getReasonColor(entry.reason)}`}>
                                {getReasonLabel(entry.reason)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No overtime hours found for this period</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendance Report (PDF/Images) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-sm text-gray-600">
                    Click to upload attendance reports
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (Max 10MB each)
                </p>
              </div>

              {/* Uploaded Files */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Uploaded Files:</h5>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewRequest(false);
                  setAttachments([]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={attachments.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
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
                        {request.year} - {getPeriodLabel(request.periodType)}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusLabel(request.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Submitted {new Date(request.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Overtime Entries Details */}
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

                    {/* Attachments */}
                    {request.attachments && request.attachments.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h5>
                        <div className="flex flex-wrap gap-2">
                          {request.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                              <Paperclip className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-700">{attachment.fileName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Approval Timeline */}
                    <div className="mt-4">
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
                          request.financeApprovedAt ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-3 h-3 rounded-full ${
                            request.financeApprovedAt ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs">Finance Approval</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${
                          request.managementApprovedAt ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-3 h-3 rounded-full ${
                            request.managementApprovedAt ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs">Management Approval</span>
                        </div>
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
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No overtime requests</h3>
            <p className="text-gray-500 mb-4">Submit your first overtime request for approval.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OvertimePage;