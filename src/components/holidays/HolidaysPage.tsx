import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { PublicHoliday } from '../../types';
import { mockPublicHolidays } from '../../data/mockData';

const HolidaysPage: React.FC = () => {
  const [holidays, setHolidays] = useState<PublicHoliday[]>(mockPublicHolidays);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<PublicHoliday | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: 'both' as PublicHoliday['location'],
    recurring: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHoliday) {
      setHolidays(holidays.map(h => 
        h.id === editingHoliday.id 
          ? { ...editingHoliday, ...formData }
          : h
      ));
      setEditingHoliday(null);
    } else {
      const newHoliday: PublicHoliday = {
        id: Date.now().toString(),
        ...formData,
      };
      setHolidays([...holidays, newHoliday]);
    }
    
    setFormData({ name: '', date: '', location: 'both', recurring: true });
    setShowAddForm(false);
  };

  const handleEdit = (holiday: PublicHoliday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      location: holiday.location,
      recurring: holiday.recurring,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      setHolidays(holidays.filter(h => h.id !== id));
    }
  };

  const getLocationLabel = (location: PublicHoliday['location']) => {
    switch (location) {
      case 'location_a': return 'Location A';
      case 'location_b': return 'Location B';
      case 'both': return 'Both Locations';
    }
  };

  const getLocationBadgeColor = (location: PublicHoliday['location']) => {
    switch (location) {
      case 'location_a': return 'bg-blue-100 text-blue-800';
      case 'location_b': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Public Holidays Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Holiday
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Christmas Day"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as PublicHoliday['location'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="both">Both Locations</option>
                  <option value="location_a">Location A Only</option>
                  <option value="location_b">Location B Only</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-8">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  Recurring annually
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingHoliday(null);
                  setFormData({ name: '', date: '', location: 'both', recurring: true });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Holidays List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Holidays Calendar</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{holiday.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationBadgeColor(holiday.location)}`}>
                      {getLocationLabel(holiday.location)}
                    </span>
                    {holiday.recurring && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Annual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(holiday.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {holidays.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No holidays defined</h3>
            <p className="text-gray-500 mb-4">Add public holidays to help track expected working hours.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Holiday
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaysPage;