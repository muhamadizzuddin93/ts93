import React from 'react';
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  FileText,
  DollarSign,
  MapPin,
  CheckSquare,
  HelpCircle,
  Upload,
  AlertTriangle,
  Briefcase,
  UserPlus,
  FolderPlus,
  PlusSquare,
  Trophy,
  Target,
  Kanban
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeSection, onSectionChange }) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'gamification', label: 'Achievements', icon: Trophy },
      { id: 'timesheet', label: 'Timesheet', icon: Clock },
      { id: 'batch-update', label: 'Batch Update', icon: Upload },
      { id: 'leave-requests', label: 'Leave Requests', icon: Calendar },
      { id: 'it-support', label: 'IT Support', icon: HelpCircle },
    ];

    const roleSpecificItems = {
      employee: [
        { id: 'overtime', label: 'Overtime Requests', icon: DollarSign },
        { id: 'my-tasks', label: 'My Tasks', icon: Target },
      ],
      manager: [
        { id: 'team-timesheets', label: 'Team Timesheets', icon: Users },
        { id: 'project-assignment', label: 'Project Assignment', icon: Briefcase },
        { id: 'task-management', label: 'Task Management', icon: CheckSquare },
        { id: 'team-tasks-kanban', label: 'Team Tasks (Kanban)', icon: Kanban },
        { id: 'approvals', label: 'Approvals', icon: CheckSquare },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'variance-analysis', label: 'Variance Analysis', icon: AlertTriangle },
      ],
      hr: [
        { id: 'employees', label: 'Employee Management', icon: Users },
        { id: 'holidays', label: 'Public Holidays', icon: Calendar },
        { id: 'leave-management', label: 'Leave Management', icon: Calendar },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'data-import', label: 'Data Import', icon: Upload },
      ],
      finance: [
        { id: 'overtime-finance', label: 'Overtime Approval', icon: DollarSign },
        { id: 'payroll', label: 'Payroll Reports', icon: FileText },
        { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
        { id: 'variance-analysis', label: 'Variance Analysis', icon: AlertTriangle },
        { id: 'billable-hours', label: 'Billable Hours', icon: DollarSign },
      ],
      management: [
        { id: 'executive-dashboard', label: 'Executive Dashboard', icon: BarChart3 },
        { id: 'company-reports', label: 'Company Reports', icon: FileText },
        { id: 'final-approvals', label: 'Final Approvals', icon: CheckSquare },
        { id: 'variance-analysis', label: 'Variance Analysis', icon: AlertTriangle },
      ],
      it_admin: [
        { id: 'user-management', label: 'User Management', icon: UserPlus },
        { id: 'project-management', label: 'Project Management', icon: FolderPlus },
        { id: 'task-creation', label: 'Task Creation', icon: PlusSquare },
        { id: 'it-tickets', label: 'IT Tickets', icon: HelpCircle },
        { id: 'system-reports', label: 'System Reports', icon: FileText },
        { id: 'data-import', label: 'Data Import', icon: Upload },
      ],
    };

    return [
      ...commonItems,
      ...roleSpecificItems[user.role],
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TimeTracker</h1>
            <p className="text-sm text-gray-500">Enterprise Edition</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          {user.location === 'location_a' ? 'Location A' : 'Location B'}
        </div>
        
        {/* Gamification Stats */}
        <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Level {user.level}</span>
            <span className="text-blue-600 font-medium">{user.totalPoints} XP</span>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-gray-600">{user.badges.length} badges</span>
            <span className="text-gray-400">•</span>
            <span className="text-xs text-orange-600">{user.streak} day streak</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;