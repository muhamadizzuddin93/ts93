import React, { useState } from 'react';
import { Plus, Save, Clock, Calendar, Award, Zap } from 'lucide-react';
import { Project, Task, TimesheetEntry, PublicHoliday } from '../../types';
import { mockProjects, mockTasks, mockPublicHolidays } from '../../data/mockData';

interface TimesheetEntryProps {
  entries: TimesheetEntry[];
  onAddEntry: (entry: Omit<TimesheetEntry, 'id'>) => void;
}

const TimesheetEntryComponent: React.FC<TimesheetEntryProps> = ({ entries, onAddEntry }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);

  const availableTasks = mockTasks.filter(task => task.projectId === selectedProject);

  // Check if date is weekend
  const isWeekend = (date: string) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  // Check if date is public holiday
  const isPublicHoliday = (date: string, userLocation: 'location_a' | 'location_b') => {
    return mockPublicHolidays.some(holiday => 
      holiday.date === date && 
      (holiday.location === 'both' || holiday.location === userLocation)
    );
  };

  // Get holiday name if it's a holiday
  const getHolidayName = (date: string, userLocation: 'location_a' | 'location_b') => {
    const holiday = mockPublicHolidays.find(holiday => 
      holiday.date === date && 
      (holiday.location === 'both' || holiday.location === userLocation)
    );
    return holiday?.name;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !selectedTask || !hours || !description) {
      alert('Please fill in all required fields');
      return;
    }

    const hoursNum = parseFloat(hours);
    const userLocation = 'location_a'; // This should come from user context
    const isHolidayWork = isPublicHoliday(selectedDate, userLocation);
    const isWeekendWork = isWeekend(selectedDate);
    
    let overtimeHours = 0;
    let autoOvertimeReason = '';
    let isOvertime = false;

    // Automatic overtime detection
    if (isHolidayWork) {
      // All hours on holidays are overtime
      overtimeHours = hoursNum;
      isOvertime = true;
      autoOvertimeReason = `Public holiday work (${getHolidayName(selectedDate, userLocation)}) - all hours counted as overtime`;
    } else if (isWeekendWork) {
      // All hours on weekends are overtime
      overtimeHours = hoursNum;
      isOvertime = true;
      autoOvertimeReason = 'Weekend work - all hours counted as overtime';
    } else if (hoursNum > 8) {
      // Regular day with excess hours
      overtimeHours = hoursNum - 8;
      isOvertime = true;
      autoOvertimeReason = `Excess hours beyond standard 8-hour workday`;
    }

    onAddEntry({
      userId: '1', // Current user ID
      date: selectedDate,
      projectId: selectedProject,
      taskId: selectedTask,
      hoursWorked: hoursNum,
      description,
      status: 'draft',
      isOvertime,
      overtimeHours: overtimeHours > 0 ? overtimeHours : undefined,
      submittedAt: new Date().toISOString(),
      isBillable: mockTasks.find(t => t.id === selectedTask)?.isBillable || false,
      taskType: mockTasks.find(t => t.id === selectedTask)?.taskType || 'project',
      isHoliday: isHolidayWork,
      isWeekend: isWeekendWork,
      autoOvertimeReason: autoOvertimeReason || undefined
    });

    // Show achievement notification
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);

    // Reset form
    setSelectedProject('');
    setSelectedTask('');
    setHours('');
    setDescription('');
  };

  const todayEntries = entries.filter(entry => entry.date === selectedDate);
  const totalHours = todayEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const totalOvertimeHours = todayEntries.reduce((sum, entry) => sum + (entry.overtimeHours || 0), 0);

  const selectedDateIsWeekend = isWeekend(selectedDate);
  const selectedDateIsHoliday = isPublicHoliday(selectedDate, 'location_a');
  const holidayName = getHolidayName(selectedDate, 'location_a');

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span className="font-medium">+25 XP earned!</span>
          </div>
          <p className="text-sm mt-1">Great job logging your time!</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Time Entry</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(selectedDate).toLocaleDateString()}</span>
            {selectedDateIsWeekend && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Weekend
              </span>
            )}
            {selectedDateIsHoliday && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Holiday: {holidayName}
              </span>
            )}
          </div>
        </div>

        {/* Weekend/Holiday Alert */}
        {(selectedDateIsWeekend || selectedDateIsHoliday) && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  {selectedDateIsHoliday ? 'Public Holiday Detected' : 'Weekend Work Detected'}
                </p>
                <p className="text-sm text-amber-700">
                  All hours logged on this date will automatically be counted as overtime hours.
                  {selectedDateIsHoliday && ` (${holidayName})`}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="8.0"
                required
              />
              {hours && parseFloat(hours) > 8 && !selectedDateIsWeekend && !selectedDateIsHoliday && (
                <p className="text-sm text-amber-600 mt-1">
                  ⚠️ {parseFloat(hours) - 8} hours will be counted as overtime
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  setSelectedTask('');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a project</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task *
              </label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedProject}
                required
              >
                <option value="">Select a task</option>
                {availableTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                    {task.dueDate && (
                      <span className="text-gray-500">
                        {' '}(Due: {new Date(task.dueDate).toLocaleDateString()})
                      </span>
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What did you work on today?"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </button>
          </div>
        </form>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">{totalHours.toFixed(1)}h</span>
            </div>
            {totalOvertimeHours > 0 && (
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="text-lg font-bold text-amber-600">{totalOvertimeHours.toFixed(1)}h OT</span>
              </div>
            )}
          </div>
        </div>

        {todayEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No entries for today yet</p>
        ) : (
          <div className="space-y-3">
            {todayEntries.map((entry) => {
              const project = mockProjects.find(p => p.id === entry.projectId);
              const task = mockTasks.find(t => t.id === entry.taskId);
              
              return (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{project?.name}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-700">{task?.name}</span>
                      {entry.isBillable && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Billable
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                    {entry.autoOvertimeReason && (
                      <p className="text-xs text-amber-600 mt-1 italic">
                        {entry.autoOvertimeReason}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{entry.hoursWorked}h</div>
                    {entry.isOvertime && entry.overtimeHours && (
                      <div className="text-xs text-amber-600">+{entry.overtimeHours}h OT</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimesheetEntryComponent;