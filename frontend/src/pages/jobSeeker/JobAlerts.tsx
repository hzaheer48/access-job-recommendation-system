import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateApiCall, mockAdditionalJobAlerts } from '../../services/mockData';
import { JobAlert, SearchCriteria, JobType, ExperienceLevel } from '../../types';
import Loading from '../../components/shared/Loading';

const JobAlerts: React.FC = () => {
  const { state, setLoading, showModal } = useApp();
  const { user, loading } = state;
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<JobAlert>>({
    name: '',
    criteria: {
      keywords: [],
      location: '',
      jobTypes: [],
      salaryRange: { min: 0, max: 0 }
    },
    frequency: 'daily',
    isActive: true
  });
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading({ isLoading: true, message: 'Loading job alerts...' });
    
    try {
      await simulateApiCall(null, 800);
      
      // Use centralized mock job alerts data
      const mockAlerts = mockAdditionalJobAlerts.map(alert => ({
        ...alert,
        userId: user?.id || ''
      }));
      
      setAlerts(mockAlerts);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load job alerts'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const createAlert = async () => {
    if (!newAlert.name?.trim()) {
      showModal({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a name for the alert'
      });
      return;
    }

    setLoading({ isLoading: true, message: 'Creating job alert...' });
    
    try {
      await simulateApiCall(null, 500);
      
      const alert: JobAlert = {
        id: Date.now().toString(),
        userId: user?.id || '',
        name: newAlert.name!,
        criteria: newAlert.criteria!,
        frequency: newAlert.frequency!,
        isActive: newAlert.isActive!,
        createdAt: new Date().toISOString(),
        lastTriggered: undefined
      };
      
      setAlerts(prev => [...prev, alert]);
      setShowCreateAlert(false);
      resetNewAlert();
      
      showModal({
        type: 'success',
        title: 'Alert Created',
        message: 'Your job alert has been created successfully'
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to create job alert'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const toggleAlert = async (alertId: string) => {
    setLoading({ isLoading: true, message: 'Updating alert...' });
    
    try {
      await simulateApiCall(null, 300);
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isActive: !alert.isActive }
          : alert
      ));
      
      showModal({
        type: 'success',
        title: 'Alert Updated',
        message: 'Alert status has been updated'
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to update alert'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const deleteAlert = async (alertId: string) => {
    showModal({
      type: 'confirm',
      title: 'Delete Alert',
      message: 'Are you sure you want to delete this job alert?',
      onConfirm: async () => {
        setLoading({ isLoading: true, message: 'Deleting alert...' });
        
        try {
          await simulateApiCall(null, 300);
          
          setAlerts(prev => prev.filter(alert => alert.id !== alertId));
          
          showModal({
            type: 'success',
            title: 'Alert Deleted',
            message: 'Job alert has been deleted'
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete alert'
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const resetNewAlert = () => {
    setNewAlert({
      name: '',
      criteria: {
        keywords: [],
        location: '',
        jobTypes: [],
        salaryRange: { min: 0, max: 0 }
      },
      frequency: 'daily',
      isActive: true
    });
    setKeywordInput('');
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !newAlert.criteria?.keywords?.includes(keywordInput.trim())) {
      setNewAlert(prev => ({
        ...prev,
        criteria: {
          ...prev.criteria!,
          keywords: [...(prev.criteria?.keywords || []), keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setNewAlert(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria!,
        keywords: prev.criteria?.keywords?.filter(k => k !== keyword) || []
      }
    }));
  };

  const addJobType = (jobType: JobType) => {
    if (!newAlert.criteria?.jobTypes?.includes(jobType)) {
      setNewAlert(prev => ({
        ...prev,
        criteria: {
          ...prev.criteria!,
          jobTypes: [...(prev.criteria?.jobTypes || []), jobType]
        }
      }));
    }
  };

  const removeJobType = (jobType: JobType) => {
    setNewAlert(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria!,
        jobTypes: prev.criteria?.jobTypes?.filter(t => t !== jobType) || []
      }
    }));
  };

  if (loading.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message={loading.message} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Alerts</h1>
          <p className="text-gray-600 dark:text-gray-300">Get notified when new jobs match your criteria</p>
        </div>
        <button
          onClick={() => setShowCreateAlert(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Create Alert
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No job alerts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first job alert to get notified about relevant opportunities</p>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{alert.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p><strong>Frequency:</strong> {alert.frequency}</p>
                    <p><strong>Created:</strong> {new Date(alert.createdAt).toLocaleDateString()}</p>
                    {alert.lastTriggered && (
                      <p><strong>Last triggered:</strong> {new Date(alert.lastTriggered).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      alert.isActive
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {alert.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Alert Criteria */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Alert Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {alert.criteria.keywords && alert.criteria.keywords.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.criteria.keywords.map((keyword) => (
                          <span key={keyword} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.criteria.location && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{alert.criteria.location}</span>
                    </div>
                  )}
                  
                  {alert.criteria.jobTypes && alert.criteria.jobTypes.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Job Types:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.criteria.jobTypes.map((type) => (
                          <span key={type} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                            {type.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.criteria.experienceLevel && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{alert.criteria.experienceLevel}</span>
                    </div>
                  )}
                  
                  {alert.criteria.salaryRange && (alert.criteria.salaryRange.min > 0 || alert.criteria.salaryRange.max > 0) && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Salary:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        ${alert.criteria.salaryRange.min.toLocaleString()} - ${alert.criteria.salaryRange.max.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Job Alert</h3>
              
              <div className="space-y-4">
                {/* Alert Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alert Name *
                  </label>
                  <input
                    type="text"
                    value={newAlert.name || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Frontend Developer Jobs"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keywords
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      placeholder="Add keyword and press Enter"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {newAlert.criteria?.keywords && newAlert.criteria.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newAlert.criteria.keywords.map((keyword) => (
                        <span key={keyword} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newAlert.criteria?.location || ''}
                    onChange={(e) => setNewAlert(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria!, location: e.target.value }
                    }))}
                    placeholder="City, state, or remote"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Job Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Types
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(['full-time', 'part-time', 'contract', 'freelance', 'internship'] as JobType[]).map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAlert.criteria?.jobTypes?.includes(type) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addJobType(type);
                            } else {
                              removeJobType(type);
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{type.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={newAlert.criteria?.experienceLevel || ''}
                    onChange={(e) => setNewAlert(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria!, experienceLevel: e.target.value as ExperienceLevel }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Level</option>
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newAlert.criteria?.salaryRange?.min || ''}
                      onChange={(e) => setNewAlert(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria!,
                          salaryRange: {
                            ...prev.criteria?.salaryRange!,
                            min: parseInt(e.target.value) || 0
                          }
                        }
                      }))}
                      placeholder="Min salary"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      value={newAlert.criteria?.salaryRange?.max || ''}
                      onChange={(e) => setNewAlert(prev => ({
                        ...prev,
                        criteria: {
                          ...prev.criteria!,
                          salaryRange: {
                            ...prev.criteria?.salaryRange!,
                            max: parseInt(e.target.value) || 0
                          }
                        }
                      }))}
                      placeholder="Max salary"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Frequency
                  </label>
                  <select
                    value={newAlert.frequency || 'daily'}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, frequency: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newAlert.isActive || false}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Activate alert immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    setShowCreateAlert(false);
                    resetNewAlert();
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createAlert}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAlerts;