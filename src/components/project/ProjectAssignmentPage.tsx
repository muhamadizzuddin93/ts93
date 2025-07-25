import React, { useState } from 'react';
import { Plus, Users, Briefcase, Calendar, Edit, Trash2, UserPlus } from 'lucide-react';
import { Project, User } from '../../types';
import { mockProjects, mockUsers } from '../../data/mockData';

const ProjectAssignmentPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Get team members (employees under current HOD)
  const teamMembers = mockUsers.filter(user => user.role === 'employee');

  const handleAssignUsers = () => {
    if (!selectedProject || selectedUsers.length === 0) {
      alert('Please select a project and at least one user');
      return;
    }

    setProjects(projects.map(project => {
      if (project.id === selectedProject) {
        const newAssignedUsers = [...new Set([...project.assignedUsers, ...selectedUsers])];
        return { ...project, assignedUsers: newAssignedUsers };
      }
      return project;
    }));

    // Send email notifications (mock)
    selectedUsers.forEach(userId => {
      const user = mockUsers.find(u => u.id === userId);
      const project = projects.find(p => p.id === selectedProject);
      console.log(`📧 Email sent to ${user?.email}: You have been assigned to project "${project?.name}"`);
    });

    alert(`Successfully assigned ${selectedUsers.length} user(s) to the project. Email notifications sent!`);
    
    setSelectedProject('');
    setSelectedUsers([]);
    setShowAssignForm(false);
  };

  const handleRemoveUser = (projectId: string, userId: string) => {
    if (confirm('Are you sure you want to remove this user from the project?')) {
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            assignedUsers: project.assignedUsers.filter(id => id !== userId)
          };
        }
        return project;
      }));
    }
  };

  const getProjectStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Project Assignment</h2>
          <p className="text-gray-600 mt-1">Assign team members to projects</p>
        </div>
        <button
          onClick={() => setShowAssignForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Users
        </button>
      </div>

      {/* Assignment Form */}
      {showAssignForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Users to Project</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Project *
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a project</option>
                {projects.filter(p => p.status === 'active').map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Team Members *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {teamMembers.map((user) => (
                  <label key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignForm(false);
                  setSelectedProject('');
                  setSelectedUsers([]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign Users
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => {
          const assignedTeamMembers = teamMembers.filter(user => 
            project.assignedUsers.includes(user.id)
          );

          return (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProjectStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {project.isBillable && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Billable
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{project.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{assignedTeamMembers.length} member(s)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Team Members */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Assigned Team Members:</h4>
                {assignedTeamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assignedTeamMembers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(project.id, user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No team members assigned to this project</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects available</h3>
          <p className="text-gray-500">Contact IT Admin to create projects.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectAssignmentPage;