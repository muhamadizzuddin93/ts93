import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/dashboard/DashboardStats';
import GamificationDashboard from './components/gamification/GamificationDashboard';
import TimesheetEntry from './components/timesheet/TimesheetEntry';
import MyTasksPage from './components/tasks/MyTasksPage';
import ReportsPage from './components/reports/ReportsPage';
import HolidaysPage from './components/holidays/HolidaysPage';
import OvertimePage from './components/overtime/OvertimePage';
import ITSupportPage from './components/it-support/ITSupportPage';
import LeaveRequestsPage from './components/leave/LeaveRequestsPage';
import BatchUpdatePage from './components/batch-update/BatchUpdatePage';
import VarianceAnalysisPage from './components/variance/VarianceAnalysisPage';
import DataImportPage from './components/data-import/DataImportPage';
import TeamTimesheetsPage from './components/team/TeamTimesheetsPage';
import ProjectAssignmentPage from './components/project/ProjectAssignmentPage';
import TaskManagementPage from './components/task/TaskManagementPage';
import ApprovalsPage from './components/approvals/ApprovalsPage';
import TeamTasksKanban from './components/task/TeamTasksKanban';
import { TimesheetEntry as TimesheetEntryType, Statistics } from './types';
import { mockTimesheetEntries } from './data/mockData';

function App() {
  const { user, loading, logout, switchRole } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntryType[]>(mockTimesheetEntries);

  const mockStats: Statistics = {
    expectedHours: 160,
    actualHours: 142.5,
    overtimeHours: 18.0,
    efficiency: 89.1,
    completedTasks: 12,
    activeProjects: 3,
    billableHours: 120.5,
    nonBillableHours: 22.0,
    leaveHours: 16.0,
  };

  const handleAddTimesheetEntry = (entry: Omit<TimesheetEntryType, 'id'>) => {
    const newEntry: TimesheetEntryType = {
      ...entry,
      id: Date.now().toString(),
    };
    setTimesheetEntries([...timesheetEntries, newEntry]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TimeTracker...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>
            </div>
            <DashboardStats stats={mockStats} />
          </div>
        );
      
      case 'gamification':
        return <GamificationDashboard user={user} />;
      
      case 'timesheet':
        return (
          <TimesheetEntry 
            entries={timesheetEntries} 
            onAddEntry={handleAddTimesheetEntry}
          />
        );
      
      case 'my-tasks':
        return <MyTasksPage />;
      
      case 'batch-update':
        return <BatchUpdatePage />;
      
      case 'leave-requests':
        return <LeaveRequestsPage />;
      
      case 'it-support':
        return <ITSupportPage />;
      
      case 'reports':
        return <ReportsPage />;
      
      case 'holidays':
        return <HolidaysPage />;
      
      case 'overtime':
        return <OvertimePage />;
      
      case 'variance-analysis':
        return <VarianceAnalysisPage />;
      
      case 'data-import':
        return <DataImportPage />;

      // Manager specific pages
      case 'team-timesheets':
        return <TeamTimesheetsPage />;
      
      case 'project-assignment':
        return <ProjectAssignmentPage />;
      
      case 'task-management':
        return <TaskManagementPage />;
      
      case 'approvals':
        return <ApprovalsPage />;

      case 'team-tasks-kanban':
        return <TeamTasksKanban />;
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <p className="text-gray-600">This section is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        user={user} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          user={user} 
          onLogout={logout} 
          onRoleSwitch={switchRole}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;