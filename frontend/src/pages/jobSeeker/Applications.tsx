import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockApplications, simulateApiCall } from '../../services/mockData';
import { JobApplication, ApplicationStatus } from '../../types';
import Loading from '../../components/shared/Loading';

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  interview_scheduled: 'bg-purple-100 text-purple-800',
  interviewed: 'bg-indigo-100 text-indigo-800',
  offer_extended: 'bg-green-100 text-green-800',
  accepted: 'bg-green-200 text-green-900',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  applied: 'Applied',
  under_review: 'Under Review',
  interview_scheduled: 'Interview Scheduled',
  interviewed: 'Interviewed',
  offer_extended: 'Offer Extended',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn'
};

const Applications: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'company'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, selectedStatus, sortBy, sortOrder]);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 600);
      
      const userApplications = mockApplications.filter(app => app.userId === user?.id);
      setApplications(userApplications);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load applications',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = applications;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }

    // Sort applications
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'company':
          comparison = a.job.company.localeCompare(b.job.company);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredApplications(filtered);
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    showModal({
      type: 'confirm',
      title: 'Withdraw Application',
      message: 'Are you sure you want to withdraw this application? This action cannot be undone.',
      onConfirm: async () => {
        setLoading({ isLoading: true, message: 'Withdrawing application...' });
        
        try {
          await simulateApiCall(null, 800);
          
          setApplications(prev => 
            prev.map(app => 
              app.id === applicationId 
                ? { ...app, status: 'withdrawn' as ApplicationStatus }
                : app
            )
          );
          
          showModal({
            type: 'success',
            title: 'Application Withdrawn',
            message: 'Your application has been successfully withdrawn.',
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Failed to withdraw application',
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const getApplicationProgress = (status: ApplicationStatus): number => {
    const progressMap = {
      applied: 20,
      under_review: 40,
      interview_scheduled: 60,
      interviewed: 80,
      offer_extended: 90,
      accepted: 100,
      rejected: 0,
      withdrawn: 0
    };
    return progressMap[status];
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return '📝';
      case 'under_review':
        return '👀';
      case 'interview_scheduled':
        return '📅';
      case 'interviewed':
        return '🎯';
      case 'offer_extended':
        return '🎉';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'withdrawn':
        return '🚫';
      default:
        return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading applications..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Applications</h1>
      
        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Status Filter */}
          <div className="card-glass backdrop-blur-sm border border-white/20 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm"
            >
              <option value="all">All Applications</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="card-glass backdrop-blur-sm border border-white/20 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Sort by</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'company')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm"
              >
                <option value="date">Date</option>
                <option value="status">Status</option>
                <option value="company">Company</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors bg-white/80 backdrop-blur-sm"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="card-glass backdrop-blur-sm border border-white/20 p-6 text-center">
              <div className="text-2xl font-bold text-primary-600">{applications.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="card-glass backdrop-blur-sm border border-white/20 p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => ['interview_scheduled', 'interviewed', 'offer_extended', 'accepted'].includes(app.status)).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredApplications.map((application) => {
              const progress = getApplicationProgress(application.status);
              const statusIcon = getStatusIcon(application.status);
              
              return (
                <div key={application.id} className="group card-glass backdrop-blur-sm border border-white/20 hover:shadow-large transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                            {application.job.company.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              <Link 
                                to={`/jobs/${application.jobId}`} 
                                className="hover:text-primary-600 transition-colors duration-200"
                              >
                                {application.job.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 font-medium">{application.job.company}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 9a2 2 0 002 2h3a2 2 0 002-2L16 7m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1" />
                              </svg>
                              Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:items-end gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{statusIcon}</span>
                          <span className={`px-4 py-2 rounded-xl text-sm font-medium ${statusColors[application.status]}`}>
                            {statusLabels[application.status]}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                progress === 0 ? 'bg-red-500' : 
                                progress === 100 ? 'bg-green-500' : 
                                'bg-gradient-to-r from-primary-500 to-primary-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {application.status === 'applied' || application.status === 'under_review' ? (
                          <button
                            onClick={() => handleWithdrawApplication(application.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                          >
                            Withdraw Application
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-glass backdrop-blur-sm border border-white/20 text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start applying to jobs to see your applications here. Track your progress and manage your job search effectively.
            </p>
            <Link
              to="/jobs"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Jobs
              </span>
            </Link>
          </div>
        )}
    </div>
  );
};

export default Applications;