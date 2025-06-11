import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { mockApplications, mockJobs, mockCompanies } from '../data/mockData';
import { ApplicationStatus } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState('most_recent');
  const [showFilters, setShowFilters] = useState(false);

  // Get user's applications with job and company details
  const userApplications = mockApplications
    .filter(app => app.userId === user?.id)
    .map(app => ({
      ...app,
      job: mockJobs.find(job => job.id === app.jobId)!,
      company: mockCompanies.find(company => 
        company.id === mockJobs.find(job => job.id === app.jobId)?.company.id
      ),
    }))
    .filter(app => app.job); // Only include applications with valid job data

  const filteredApplications = userApplications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: ApplicationStatus) => {
    const configs = {
      applied: {
        color: 'text-primary-600',
        bgColor: 'bg-primary-100',
        icon: DocumentIcon,
        label: 'Applied',
      },
      under_review: {
        color: 'text-warning-600',
        bgColor: 'bg-warning-100',
        icon: ClockIcon,
        label: 'Under Review',
      },
      phone_screening: {
        color: 'text-primary-600',
        bgColor: 'bg-primary-100',
        icon: PhoneIcon,
        label: 'Phone Screening',
      },
      technical_interview: {
        color: 'text-secondary-600',
        bgColor: 'bg-secondary-100',
        icon: VideoCameraIcon,
        label: 'Technical Interview',
      },
      final_interview: {
        color: 'text-success-600',
        bgColor: 'bg-success-100',
        icon: VideoCameraIcon,
        label: 'Final Interview',
      },
      offer_made: {
        color: 'text-success-600',
        bgColor: 'bg-success-100',
        icon: CheckCircleIcon,
        label: 'Offer Made',
      },
      accepted: {
        color: 'text-success-600',
        bgColor: 'bg-success-100',
        icon: CheckCircleIcon,
        label: 'Accepted',
      },
      rejected: {
        color: 'text-danger-600',
        bgColor: 'bg-danger-100',
        icon: XCircleIcon,
        label: 'Rejected',
      },
      withdrawn: {
        color: 'text-secondary-600',
        bgColor: 'bg-secondary-100',
        icon: ExclamationCircleIcon,
        label: 'Withdrawn',
      },
    };
    return configs[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const statusCounts = {
    all: userApplications.length,
    applied: userApplications.filter(app => app.status === 'applied').length,
    under_review: userApplications.filter(app => app.status === 'under_review').length,
    phone_screening: userApplications.filter(app => app.status === 'phone_screening').length,
    technical_interview: userApplications.filter(app => app.status === 'technical_interview').length,
    final_interview: userApplications.filter(app => app.status === 'final_interview').length,
    offer_made: userApplications.filter(app => app.status === 'offer_made').length,
    rejected: userApplications.filter(app => app.status === 'rejected').length,
    withdrawn: userApplications.filter(app => app.status === 'withdrawn').length,
  };

  const ApplicationCard = ({ application }: { application: any }) => {
    const statusConfig = getStatusConfig(application.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 hover:shadow-md transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <img
                src={application.job.company.logo}
                alt={application.job.company.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                  {application.job.title}
                </h3>
                <p className="text-secondary-600">{application.job.company.name}</p>
                <p className="text-sm text-secondary-500">{application.job.location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-1 rounded-full ${statusConfig.bgColor}`}>
                <StatusIcon className={`h-4 w-4 ${statusConfig.color} mr-2`} />
                <span className={`text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <span className="text-secondary-500">Applied</span>
              <p className="font-medium text-secondary-900">{formatDate(application.appliedDate)}</p>
            </div>
            <div>
              <span className="text-secondary-500">Last Update</span>
              <p className="font-medium text-secondary-900">{getTimeAgo(application.lastUpdate)}</p>
            </div>
            <div>
              <span className="text-secondary-500">Job Type</span>
              <p className="font-medium text-secondary-900 capitalize">
                {application.job.type.replace('-', ' ')}
              </p>
            </div>
            <div>
              <span className="text-secondary-500">Salary</span>
              <p className="font-medium text-secondary-900">
                {application.job.salary.min && application.job.salary.max 
                  ? `$${application.job.salary.min.toLocaleString()} - $${application.job.salary.max.toLocaleString()}`
                  : 'Not specified'
                }
              </p>
            </div>
          </div>

          {/* Progress Timeline (for active applications) */}
          {!['rejected', 'withdrawn'].includes(application.status) && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-secondary-500 mb-2">
                <span>Application Progress</span>
                <span>Next: {
                  application.status === 'applied' ? 'Initial Review' :
                  application.status === 'under_review' ? 'Phone Screening' :
                  application.status === 'phone_screening' ? 'Technical Interview' :
                  application.status === 'technical_interview' ? 'Final Interview' :
                  application.status === 'final_interview' ? 'Decision' :
                  'Complete'
                }</span>
              </div>
              <div className="flex items-center space-x-2">
                {['applied', 'under_review', 'phone_screening', 'technical_interview', 'final_interview', 'offer_made'].map((status, index) => (
                  <div key={status} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      ['applied', 'under_review', 'phone_screening', 'technical_interview', 'final_interview', 'offer_made']
                        .indexOf(application.status) >= index
                        ? 'bg-primary-500'
                        : 'bg-secondary-200'
                    }`}></div>
                    {index < 5 && (
                      <div className={`w-8 h-0.5 ${
                        ['applied', 'under_review', 'phone_screening', 'technical_interview', 'final_interview', 'offer_made']
                          .indexOf(application.status) > index
                          ? 'bg-primary-500'
                          : 'bg-secondary-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
              <h4 className="text-sm font-medium text-secondary-900 mb-1">Notes</h4>
              <p className="text-sm text-secondary-700">{application.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <EyeIcon className="h-4 w-4 mr-2" />
                View Job
              </Button>
              {['phone_screening', 'technical_interview', 'final_interview'].includes(application.status) && (
                <Button variant="outline" size="sm">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
              <Button variant="outline" size="sm">
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
            
            {application.status === 'offer_made' && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Decline
                </Button>
                <Button size="sm">
                  Accept Offer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">My Applications</h1>
          <p className="text-secondary-600">
            Track and manage your job applications ({userApplications.length} total)
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-lg p-3">
                <DocumentIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">{statusCounts.all}</p>
                <p className="text-sm text-secondary-600">Total Applications</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-warning-100 rounded-lg p-3">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">{statusCounts.under_review}</p>
                <p className="text-sm text-secondary-600">Under Review</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-success-100 rounded-lg p-3">
                <VideoCameraIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">
                  {statusCounts.phone_screening + statusCounts.technical_interview + statusCounts.final_interview}
                </p>
                <p className="text-sm text-secondary-600">Interviews</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-success-100 rounded-lg p-3">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">{statusCounts.offer_made}</p>
                <p className="text-sm text-secondary-600">Offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                className="select"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="applied">Applied ({statusCounts.applied})</option>
                <option value="under_review">Under Review ({statusCounts.under_review})</option>
                <option value="phone_screening">Phone Screening ({statusCounts.phone_screening})</option>
                <option value="technical_interview">Technical Interview ({statusCounts.technical_interview})</option>
                <option value="final_interview">Final Interview ({statusCounts.final_interview})</option>
                <option value="offer_made">Offer Made ({statusCounts.offer_made})</option>
                <option value="rejected">Rejected ({statusCounts.rejected})</option>
                <option value="withdrawn">Withdrawn ({statusCounts.withdrawn})</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select"
              >
                <option value="most_recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="company_az">Company A-Z</option>
                <option value="status">Status</option>
              </select>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <DocumentIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                {userApplications.length === 0 ? 'No applications yet' : 'No applications match your filters'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {userApplications.length === 0 
                  ? 'Start applying to jobs to see your applications here'
                  : 'Try adjusting your search criteria or filters'
                }
              </p>
              {userApplications.length === 0 && (
                <Button>
                  Browse Jobs
                </Button>
              )}
              {userApplications.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications; 