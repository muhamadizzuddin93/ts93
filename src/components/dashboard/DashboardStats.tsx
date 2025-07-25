import React from 'react';
import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Statistics } from '../../types';

interface DashboardStatsProps {
  stats: Statistics;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Hours This Month',
      value: `${stats.actualHours.toFixed(1)}h`,
      subtitle: `of ${stats.expectedHours}h expected`,
      icon: Clock,
      color: 'blue',
      progress: (stats.actualHours / stats.expectedHours) * 100,
    },
    {
      title: 'Efficiency',
      value: `${stats.efficiency.toFixed(1)}%`,
      subtitle: 'vs last month',
      icon: TrendingUp,
      color: stats.efficiency >= 100 ? 'green' : 'amber',
      progress: Math.min(stats.efficiency, 150),
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      subtitle: 'this month',
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Overtime Hours',
      value: `${stats.overtimeHours.toFixed(1)}h`,
      subtitle: 'this month',
      icon: AlertCircle,
      color: stats.overtimeHours > 20 ? 'red' : 'blue',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      red: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getProgressColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      amber: 'bg-amber-500',
      red: 'bg-red-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={index}
            className={`p-6 rounded-lg border-2 ${getColorClasses(stat.color)} transition-all hover:shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-8 h-8" />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            
            <h3 className="font-semibold text-sm mb-1">{stat.title}</h3>
            <p className="text-xs opacity-75">{stat.subtitle}</p>
            
            {stat.progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColorClasses(stat.color)} transition-all duration-500`}
                    style={{ width: `${Math.min(100, stat.progress)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;