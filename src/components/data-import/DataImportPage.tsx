import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Users, Briefcase, CheckSquare } from 'lucide-react';

const DataImportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'tasks'>('users');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      setUploadStatus('error');
      setUploadMessage('Please upload a CSV file');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage(`Uploading ${type} data...`);

    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      setUploadMessage(`${type} data imported successfully!`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadMessage('');
      }, 3000);
    }, 2000);
  };

  const downloadTemplate = (type: string) => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'users':
        csvContent = 'name,email,role,department,location,managerId,annualLeaveBalance,medicalLeaveBalance\n' +
                    'John Doe,john.doe@company.com,employee,Engineering,location_a,manager_id,14,10\n' +
                    'Jane Smith,jane.smith@company.com,manager,Engineering,location_a,,18,12';
        filename = 'users_template.csv';
        break;
      case 'projects':
        csvContent = 'name,department,status,startDate,endDate,isBillable\n' +
                    'Website Redesign,Engineering,active,2024-01-01,,true\n' +
                    'Mobile App,Engineering,active,2024-02-01,,true';
        filename = 'projects_template.csv';
        break;
      case 'tasks':
        csvContent = 'projectId,name,description,estimatedHours,isBillable,taskType\n' +
                    'project_1,UI Design,Design user interface,40,true,project\n' +
                    'project_1,Frontend Development,Develop frontend,80,true,project';
        filename = 'tasks_template.csv';
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Data Import</h2>
        <p className="text-gray-600 mt-1">Import data from CSV files to migrate existing information</p>
      </div>

      {/* Status Message */}
      {uploadStatus !== 'idle' && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          uploadStatus === 'success' ? 'bg-green-50 border border-green-200' :
          uploadStatus === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          {getStatusIcon()}
          <span className={`font-medium ${getStatusColor()}`}>{uploadMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Projects</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Users</h3>
                <p className="text-gray-600">Upload a CSV file containing user information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">1. Download Template</h4>
                  <button
                    onClick={() => downloadTemplate('users')}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Users Template
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">2. Upload CSV File</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600">Click to upload users CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileUpload(e, 'Users')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Fields:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>name:</strong> Full name of the user</li>
                  <li>• <strong>email:</strong> Email address (must be unique)</li>
                  <li>• <strong>role:</strong> employee, manager, hr, finance, management, it_admin</li>
                  <li>• <strong>department:</strong> Department name</li>
                  <li>• <strong>location:</strong> location_a or location_b</li>
                  <li>• <strong>managerId:</strong> ID of the manager (optional)</li>
                  <li>• <strong>annualLeaveBalance:</strong> Annual leave days remaining</li>
                  <li>• <strong>medicalLeaveBalance:</strong> Medical leave days remaining</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Projects</h3>
                <p className="text-gray-600">Upload a CSV file containing project information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">1. Download Template</h4>
                  <button
                    onClick={() => downloadTemplate('projects')}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Projects Template
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">2. Upload CSV File</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600">Click to upload projects CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileUpload(e, 'Projects')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Fields:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>name:</strong> Project name</li>
                  <li>• <strong>department:</strong> Department responsible for the project</li>
                  <li>• <strong>status:</strong> active, completed, or on_hold</li>
                  <li>• <strong>startDate:</strong> Project start date (YYYY-MM-DD)</li>
                  <li>• <strong>endDate:</strong> Project end date (optional)</li>
                  <li>• <strong>isBillable:</strong> true or false</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Tasks</h3>
                <p className="text-gray-600">Upload a CSV file containing task information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">1. Download Template</h4>
                  <button
                    onClick={() => downloadTemplate('tasks')}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Tasks Template
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">2. Upload CSV File</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600">Click to upload tasks CSV</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileUpload(e, 'Tasks')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Fields:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>projectId:</strong> ID of the parent project</li>
                  <li>• <strong>name:</strong> Task name</li>
                  <li>• <strong>description:</strong> Task description (optional)</li>
                  <li>• <strong>estimatedHours:</strong> Estimated hours to complete</li>
                  <li>• <strong>isBillable:</strong> true or false</li>
                  <li>• <strong>taskType:</strong> project, annual_leave, medical_leave, unpaid_leave, or time_off</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Guidelines */}
      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Import Guidelines</h3>
            <ul className="space-y-1 text-yellow-800">
              <li>• Always download and use the provided templates</li>
              <li>• Ensure all required fields are filled</li>
              <li>• Use the exact format specified for dates (YYYY-MM-DD)</li>
              <li>• Boolean fields should be 'true' or 'false' (lowercase)</li>
              <li>• Email addresses must be unique across all users</li>
              <li>• Project IDs must exist before importing tasks</li>
              <li>• Large files may take some time to process</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImportPage;