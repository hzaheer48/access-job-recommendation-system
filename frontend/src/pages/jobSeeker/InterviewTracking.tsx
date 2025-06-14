import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { simulateApiCall, mockInterviewApplications, mockInterviewSchedules } from '../../services/mockData';
import { JobApplication, InterviewStage, ApplicationStatus } from '../../types';
import Loading from '../../components/shared/Loading';

interface InterviewSchedule {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  stage: 'phone' | 'video' | 'onsite' | 'technical' | 'final';
  scheduledDate: string;
  duration: number; // in minutes
  interviewType: 'phone' | 'video' | 'in-person' | 'technical';
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: string;
  outcome?: 'passed' | 'failed' | 'pending';
}

const InterviewTracking: React.FC = () => {
  const { state, setLoading, showModal } = useApp();
  const { user, loading } = state;
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [newInterview, setNewInterview] = useState<Partial<InterviewSchedule>>({
    stage: 'phone',
    interviewType: 'phone',
    duration: 60,
    status: 'scheduled',
    interviewers: []
  });
  const [interviewerInput, setInterviewerInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading({ isLoading: true, message: 'Loading interview data...' });
    
    try {
      await simulateApiCall(null, 800);
      
      // Use centralized mock applications data
      const mockApplications = mockInterviewApplications.map(app => ({
        ...app,
        userId: user?.id || ''
      }));
      
      // Use centralized mock interview schedules
      const mockInterviews = mockInterviewSchedules;
      
      setApplications(mockApplications);
      setInterviews(mockInterviews);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load interview data'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const addInterview = async () => {
    if (!selectedApplication || !newInterview.scheduledDate) {
      showModal({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select an application and schedule date'
      });
      return;
    }

    setLoading({ isLoading: true, message: 'Scheduling interview...' });
    
    try {
      await simulateApiCall(null, 500);
      
      const application = applications.find(app => app.id === selectedApplication);
      if (!application) return;
      
      const interview: InterviewSchedule = {
        id: Date.now().toString(),
        applicationId: selectedApplication,
        jobTitle: application.job.title,
        company: application.job.company,
        stage: newInterview.stage!,
        scheduledDate: newInterview.scheduledDate!,
        duration: newInterview.duration!,
        interviewType: newInterview.interviewType!,
        interviewers: newInterview.interviewers!,
        location: newInterview.location,
        meetingLink: newInterview.meetingLink,
        notes: newInterview.notes,
        status: 'scheduled'
      };
      
      setInterviews(prev => [...prev, interview]);
      setShowAddInterview(false);
      resetNewInterview();
      
      showModal({
        type: 'success',
        title: 'Interview Scheduled',
        message: 'Your interview has been scheduled successfully'
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to schedule interview'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const updateInterviewStatus = async (interviewId: string, status: InterviewSchedule['status'], outcome?: InterviewSchedule['outcome'], feedback?: string) => {
    setLoading({ isLoading: true, message: 'Updating interview...' });
    
    try {
      await simulateApiCall(null, 300);
      
      setInterviews(prev => prev.map(interview => 
        interview.id === interviewId 
          ? { ...interview, status, outcome, feedback }
          : interview
      ));
      
      showModal({
        type: 'success',
        title: 'Interview Updated',
        message: 'Interview status has been updated'
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to update interview'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const deleteInterview = async (interviewId: string) => {
    showModal({
      type: 'confirm',
      title: 'Delete Interview',
      message: 'Are you sure you want to delete this interview?',
      onConfirm: async () => {
        setLoading({ isLoading: true, message: 'Deleting interview...' });
        
        try {
          await simulateApiCall(null, 300);
          
          setInterviews(prev => prev.filter(interview => interview.id !== interviewId));
          
          showModal({
            type: 'success',
            title: 'Interview Deleted',
            message: 'Interview has been deleted'
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete interview'
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const resetNewInterview = () => {
    setNewInterview({
      stage: 'phone',
      interviewType: 'phone',
      duration: 60,
      status: 'scheduled',
      interviewers: []
    });
    setSelectedApplication('');
    setInterviewerInput('');
  };

  const addInterviewer = () => {
    if (interviewerInput.trim() && !newInterview.interviewers?.includes(interviewerInput.trim())) {
      setNewInterview(prev => ({
        ...prev,
        interviewers: [...(prev.interviewers || []), interviewerInput.trim()]
      }));
      setInterviewerInput('');
    }
  };

  const removeInterviewer = (interviewer: string) => {
    setNewInterview(prev => ({
      ...prev,
      interviewers: prev.interviewers?.filter(i => i !== interviewer) || []
    }));
  };

  const getFilteredInterviews = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return interviews.filter(interview => 
          interview.status === 'scheduled' && new Date(interview.scheduledDate) >= now
        );
      case 'completed':
        return interviews.filter(interview => 
          interview.status === 'completed'
        );
      case 'all':
      default:
        return interviews;
    }
  };

  const getStatusColor = (status: InterviewSchedule['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeColor = (outcome?: InterviewSchedule['outcome']) => {
    switch (outcome) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInterviews = getFilteredInterviews();

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
          <h1 className="text-2xl font-bold text-gray-900">Interview Tracking</h1>
          <p className="text-gray-600">Manage and track your interview schedule</p>
        </div>
        <button
          onClick={() => setShowAddInterview(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Schedule Interview
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'upcoming', label: 'Upcoming', count: interviews.filter(i => i.status === 'scheduled' && new Date(i.scheduledDate) >= new Date()).length },
            { key: 'completed', label: 'Completed', count: interviews.filter(i => i.status === 'completed').length },
            { key: 'all', label: 'All', count: interviews.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Interviews List */}
      <div className="space-y-6">
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews {activeTab === 'upcoming' ? 'scheduled' : activeTab}</h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'upcoming' 
                ? 'Schedule your first interview to get started'
                : `No ${activeTab} interviews found`
              }
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => setShowAddInterview(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Schedule Interview
              </button>
            )}
          </div>
        ) : (
          filteredInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{interview.jobTitle}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                    {interview.outcome && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(interview.outcome)}`}>
                        {interview.outcome}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{interview.company}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Stage:</strong> {interview.stage}</p>
                    <p><strong>Date:</strong> {new Date(interview.scheduledDate).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {interview.duration} minutes</p>
                    <p><strong>Type:</strong> {interview.interviewType}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {interview.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => updateInterviewStatus(interview.id, 'completed', 'pending')}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => updateInterviewStatus(interview.id, 'cancelled')}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteInterview(interview.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Interview Details */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {interview.interviewers && interview.interviewers.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Interviewers:</span>
                      <ul className="mt-1 space-y-1">
                        {interview.interviewers.map((interviewer, index) => (
                          <li key={index} className="text-gray-600">• {interviewer}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {interview.location && (
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600 mt-1">{interview.location}</p>
                    </div>
                  )}
                  
                  {interview.meetingLink && (
                    <div>
                      <span className="font-medium text-gray-700">Meeting Link:</span>
                      <a 
                        href={interview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 mt-1 block"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                  
                  {interview.notes && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-600 mt-1">{interview.notes}</p>
                    </div>
                  )}
                  
                  {interview.feedback && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Feedback:</span>
                      <p className="text-gray-600 mt-1">{interview.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Interview Modal */}
      {showAddInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Interview</h3>
              
              <div className="space-y-4">
                {/* Application Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application *
                  </label>
                  <select
                    value={selectedApplication}
                    onChange={(e) => setSelectedApplication(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select an application</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.job.title} - {app.job.company}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interview Stage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Stage *
                  </label>
                  <select
                    value={newInterview.stage || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, stage: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="phone">Phone Screen</option>
                    <option value="video">Video Interview</option>
                    <option value="onsite">Onsite Interview</option>
                    <option value="technical">Technical Interview</option>
                    <option value="final">Final Interview</option>
                  </select>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newInterview.scheduledDate || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newInterview.duration || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={newInterview.interviewType || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, interviewType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="phone">Phone</option>
                    <option value="video">Video</option>
                    <option value="in-person">In-Person</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                {/* Interviewers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interviewers
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={interviewerInput}
                      onChange={(e) => setInterviewerInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addInterviewer()}
                      placeholder="Add interviewer name and role"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={addInterviewer}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {newInterview.interviewers && newInterview.interviewers.length > 0 && (
                    <div className="space-y-2">
                      {newInterview.interviewers.map((interviewer, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                          <span className="text-sm">{interviewer}</span>
                          <button
                            onClick={() => removeInterviewer(interviewer)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newInterview.location || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Office address or meeting room"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={newInterview.meetingLink || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, meetingLink: e.target.value }))}
                    placeholder="Zoom, Google Meet, or other video call link"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newInterview.notes || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the interview"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAddInterview(false);
                    resetNewInterview();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addInterview}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewTracking;