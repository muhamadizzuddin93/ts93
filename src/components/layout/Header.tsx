import React from 'react';
import { Bell, Search, LogOut, RefreshCw } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onRoleSwitch: (role: User['role']) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onRoleSwitch }) => {
  const roles = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'hr', label: 'HR Admin' },
    { value: 'finance', label: 'Finance' },
    { value: 'management', label: 'Management' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Role Switcher for Demo */}
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <select
              value={user.role}
              onChange={(e) => onRoleSwitch(e.target.value as User['role'])}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-900">{user.name}</span>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;