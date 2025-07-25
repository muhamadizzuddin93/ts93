import React, { useState } from 'react';
import { Users, Calendar, Clock, CheckCircle, AlertCircle, Filter, Download } from 'lucide-react';
import { TimesheetEntry, User } from '../../types';
import { mockTimesheetEntries, mockUsers, mockProjects, mockTasks } from '../../data/mockData';

const TeamTimesheetsPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'submitted' | 'approved'>('all');

  // Get team members (employees under current HOD)
  const teamMembers = mockUsers.filter(user => user.role === 'employee');
  
  // Filter timesheet entries
  const filteredEntries = mockTimesheetEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const [year, month] = selectedMonth.split('-');
    const entryMonth = entryDate.getMonth() + 1;
    const entryYear = entryDate.getFullYear();
    
    const monthMatch = entryMonth === parseInt(month) && entryYear === parseInt(year);
    const employeeMatch = selectedEmployee === 'all' || entry.userId === selectedEmployee;
    const statusMatch = statusFilter === 'all' || entry.status === statusFilter;
    
    return monthMatch && employeeMatch && statusMatch;
  });

  const getStatusColor = (status: TimesheetEntry['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: TimesheetEntry['status']) => {
    switch (status) {
      case 'draft': return AlertCircle;
      case 'submitted': return Clock;
      case 'approved': return CheckCircle;
    }
  };

  const handleApprove = (entryId: string) => {
    // In real app, this would call an API
    alert(`Timesheet entry ${entryId} approved!`);
  };

  const handleReject = (entryId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Timesheet entry ${entryId} rejected. Reason: ${reason}`);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Employee', 'Project', 'Task', 'Hours', 'Overtime', 'Status', 'Description'],
      ...filteredEntries.map(entry => {
        const user = mockUsers.find(u => u.id === entry.userId);
        const project = mockProjects.find(p => p.id === entry.projectId);
        const task = mockTasks.find(t => t.id === entry.taskId);
        
        return [
          entry.date,
          user?.name || 'Unknown',
          project?.name || 'Unknown',
          task?.name || 'Unknown',
          entry.hoursWorked,
          entry.overtimeHours || 0,
          entry.status,
          entry.description
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-timesheets-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const totalOvertimeHours = filteredEntries.reduce((sum, entry) => sum + (entry.overtimeHours || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Team Timesheets</h2>
          <p className="text-gray-600 mt-1">Review and approve your team's timesheet entries</p>
        </div>
        <button
          onClick={exportData}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-amber-600">{totalOvertimeHours.toFixed(1)}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-green-600">{filteredEntries.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-purple-600">{teamMembers.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Employees</option>
              {teamMembers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timesheet Entries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Timesheet Entries</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.map((entry) => {
                const user = mockUsers.find(u => u.id === entry.userId);
                const project = mockProjects.find(p => p.id === entry.projectId);
                const task = mockTasks.find(t => t.id === entry.taskId);
                const StatusIcon = getStatusIcon(entry.status);
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.hoursWorked}h
                      {entry.overtimeHours && (
                        <span className="text-amber-600 ml-1">
                          (+{entry.overtimeHours}h OT)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {entry.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entry.status === 'submitted' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(entry.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(entry.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEntries.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No timesheet entries found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more entries.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTimesheetsPage;