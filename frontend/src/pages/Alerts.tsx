import React, { useState } from 'react';
import {
  BellIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { mockAlerts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Alerts: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [alertForm, setAlertForm] = useState({
    name: '',
    query: '',
    location: '',
    jobTypes: [] as string[],
    experienceLevel: '',
    salaryMin: '',
    frequency: 'daily',
    isActive: true,
  });

  const userAlerts = mockAlerts.filter(alert => alert.userId === user?.id);

  const handleCreateAlert = () => {
    setAlertForm({
      name: '',
      query: '',
      location: '',
      jobTypes: [],
      experienceLevel: '',
      salaryMin: '',
      frequency: 'daily',
      isActive: true,
    });
    setShowCreateModal(true);
  };

  const handleEditAlert = (alert: any) => {
    setAlertForm({
      name: alert.name,
      query: alert.query || '',
      location: alert.location || '',
      jobTypes: alert.jobTypes || [],
      experienceLevel: alert.experienceLevel || '',
      salaryMin: alert.salaryMin?.toString() || '',
      frequency: alert.frequency,
      isActive: alert.isActive,
    });
    setEditingAlert(alert);
    setShowCreateModal(true);
  };

  const handleSaveAlert = () => {
    // In a real app, this would save to backend
    console.log('Saving alert:', alertForm);
    setShowCreateModal(false);
    setEditingAlert(null);
  };

  const handleDeleteAlert = (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      // In a real app, this would delete from backend
      console.log('Deleting alert:', alertId);
    }
  };

  const toggleAlert = (alertId: string, isActive: boolean) => {
    // In a real app, this would update the backend
    console.log(`${isActive ? 'Activating' : 'Deactivating'} alert:`, alertId);
  };

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Job Alerts</h1>
              <p className="text-secondary-600">
                Get notified when new jobs match your criteria ({userAlerts.length} active alerts)
              </p>
            </div>
            <Button onClick={handleCreateAlert}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-lg p-3">
                <BellIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">{userAlerts.length}</p>
                <p className="text-sm text-secondary-600">Total Alerts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-success-100 rounded-lg p-3">
                <ClockIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">
                  {userAlerts.filter(alert => alert.isActive).length}
                </p>
                <p className="text-sm text-secondary-600">Active Alerts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-warning-100 rounded-lg p-3">
                <MagnifyingGlassIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">42</p>
                <p className="text-sm text-secondary-600">Jobs Found Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        {userAlerts.length > 0 ? (
          <div className="space-y-6">
            {userAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-lg shadow-sm border border-secondary-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900">{alert.name}</h3>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={alert.isActive}
                            onChange={(e) => toggleAlert(alert.id, e.target.checked)}
                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className={`ml-2 text-sm ${alert.isActive ? 'text-success-600' : 'text-secondary-500'}`}>
                            {alert.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {alert.query && (
                          <div className="flex items-center text-sm text-secondary-600">
                            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                            Keywords: "{alert.query}"
                          </div>
                        )}
                        {alert.location && (
                          <div className="flex items-center text-sm text-secondary-600">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            Location: {alert.location}
                          </div>
                        )}
                        {alert.salaryMin && (
                          <div className="flex items-center text-sm text-secondary-600">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                            Minimum salary: ${parseInt(alert.salaryMin).toLocaleString()}
                          </div>
                        )}
                        {alert.jobTypes && alert.jobTypes.length > 0 && (
                          <div className="flex items-start text-sm text-secondary-600">
                            <ClockIcon className="h-4 w-4 mr-2 mt-0.5" />
                            <div>
                              Job types: {alert.jobTypes.map(type => type.replace('-', ' ')).join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditAlert(alert)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-2 text-secondary-400 hover:text-danger-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <span>Frequency: {alert.frequency}</span>
                      <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                      <span>Last triggered: {alert.lastTriggered ? new Date(alert.lastTriggered).toLocaleDateString() : 'Never'}</span>
                    </div>
                    <div className="text-sm text-secondary-500">
                      {alert.matchCount || 0} jobs found this week
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <BellIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No job alerts yet</h3>
              <p className="text-secondary-600 mb-6">
                Create alerts to get notified when new jobs match your preferences
              </p>
              <Button onClick={handleCreateAlert}>
                Create Your First Alert
              </Button>
            </div>
          </div>
        )}

        {/* Create/Edit Alert Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingAlert(null);
          }}
          title={editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}
          size="lg"
        >
          <div className="space-y-6">
            <Input
              label="Alert Name"
              value={alertForm.name}
              onChange={(e) => setAlertForm({ ...alertForm, name: e.target.value })}
              placeholder="e.g., Frontend Developer Jobs"
            />

            <Input
              label="Keywords (Optional)"
              value={alertForm.query}
              onChange={(e) => setAlertForm({ ...alertForm, query: e.target.value })}
              placeholder="e.g., React, JavaScript, Frontend"
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />

            <Input
              label="Location (Optional)"
              value={alertForm.location}
              onChange={(e) => setAlertForm({ ...alertForm, location: e.target.value })}
              placeholder="e.g., San Francisco, CA or Remote"
              leftIcon={<MapPinIcon className="h-5 w-5" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Job Types
                </label>
                <div className="space-y-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        checked={alertForm.jobTypes.includes(type)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...alertForm.jobTypes, type]
                            : alertForm.jobTypes.filter(t => t !== type);
                          setAlertForm({ ...alertForm, jobTypes: newTypes });
                        }}
                      />
                      <span className="ml-2 text-sm text-secondary-700 capitalize">
                        {type.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Experience Level
                </label>
                <select
                  value={alertForm.experienceLevel}
                  onChange={(e) => setAlertForm({ ...alertForm, experienceLevel: e.target.value })}
                  className="select"
                >
                  <option value="">Any Level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level} className="capitalize">
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Minimum Salary (Optional)"
                type="number"
                value={alertForm.salaryMin}
                onChange={(e) => setAlertForm({ ...alertForm, salaryMin: e.target.value })}
                placeholder="e.g. 75000"
                leftIcon={<CurrencyDollarIcon className="h-5 w-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Notification Frequency
                </label>
                <select
                  value={alertForm.frequency}
                  onChange={(e) => setAlertForm({ ...alertForm, frequency: e.target.value })}
                  className="select"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={alertForm.isActive}
                onChange={(e) => setAlertForm({ ...alertForm, isActive: e.target.checked })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-secondary-700">
                Activate this alert immediately
              </span>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAlert(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAlert}>
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Alerts; 