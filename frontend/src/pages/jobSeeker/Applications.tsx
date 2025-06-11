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
      
      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Link to={`/jobs/${application.jobId}`} className="hover:text-primary-600">
                      {application.job.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600">{application.job.company}</p>
                  <p className="text-sm text-gray-500">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications found.</p>
          <Link to="/jobs" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-md">
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default Applications; 