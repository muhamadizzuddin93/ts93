import React, { useState } from 'react';
import { Download, Filter, Calendar, Users, FolderOpen } from 'lucide-react';
import { mockTimesheetEntries, mockProjects, mockUsers } from '../../data/mockData';

const ReportsPage: React.FC = () => {
  const [filterBy, setFilterBy] = useState<'department' | 'project' | 'employee'>('department');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [reportData, setReportData] = useState<any[]>([]);

  const generateReport = () => {
    let filteredEntries = mockTimesheetEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      
      return entryDate >= fromDate && entryDate <= toDate;
    });

    // Apply additional filters based on selection
    if (selectedFilter) {
      filteredEntries = filteredEntries.filter(entry => {
        if (filterBy === 'department') {
          const user = mockUsers.find(u => u.id === entry.userId);
          return user?.department === selectedFilter;
        } else if (filterBy === 'project') {
          return entry.projectId === selectedFilter;
        } else if (filterBy === 'employee') {
          return entry.userId === selectedFilter;
        }
        return true;
      });
    }

    // Process data for display
    const processedData = filteredEntries.map(entry => {
      const user = mockUsers.find(u => u.id === entry.userId);
      const project = mockProjects.find(p => p.id === entry.projectId);
      
      return {
        date: entry.date,
        employee: user?.name || 'Unknown',
        department: user?.department || 'Unknown',
        project: project?.name || 'Unknown',
        hours: entry.hoursWorked,
        overtimeHours: entry.overtimeHours || 0,
        description: entry.description,
        status: entry.status,
      };
    });

    setReportData(processedData);
  };

  const exportToExcel = () => {
    // Simulate Excel export
    const csvContent = [
      ['Date', 'Employee', 'Department', 'Project', 'Hours', 'Overtime Hours', 'Description', 'Status'],
      ...reportData.map(row => [
        row.date,
        row.employee,
        row.department,
        row.project,
        row.hours,
        row.overtimeHours,
        row.description,
        row.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilterOptions = () => {
    switch (filterBy) {
      case 'department':
        return [...new Set(mockUsers.map(u => u.department))];
      case 'project':
        return mockProjects.map(p => ({ id: p.id, name: p.name }));
      case 'employee':
        return mockUsers.map(u => ({ id: u.id, name: u.name }));
      default:
        return [];
    }
  };

  const totalHours = reportData.reduce((sum, row) => sum + row.hours, 0);
  const totalOvertimeHours = reportData.reduce((sum, row) => sum + row.overtimeHours, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Generate Reports</h2>
          <button
            onClick={exportToExcel}
            disabled={reportData.length === 0}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter By
            </label>
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value as any);
                setSelectedFilter('');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="department">Department</option>
              <option value="project">Project</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filterBy === 'department' ? 'Department' : 
               filterBy === 'project' ? 'Project' : 'Employee'}
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {getFilterOptions().map((option) => (
                <option 
                  key={typeof option === 'string' ? option : option.id} 
                  value={typeof option === 'string' ? option : option.id}
                >
                  {typeof option === 'string' ? option : option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={generateReport}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Generate Report
        </button>
      </div>

      {reportData.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overtime Hours</p>
                  <p className="text-2xl font-bold text-amber-600">{totalOvertimeHours.toFixed(1)}</p>
                </div>
                <Users className="w-8 h-8 text-amber-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Entries</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.length}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Report Data</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(row.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.employee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.hours}h</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.overtimeHours > 0 ? `${row.overtimeHours}h` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.status === 'approved' ? 'bg-green-100 text-green-800' :
                          row.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;