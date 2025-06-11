import React from 'react';
import {
  UsersIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  EyeIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { mockJobs, mockUsers, mockApplications, mockCompanies } from '../../data/mockData';
import Button from '../../components/common/Button';

const AdminDashboard: React.FC = () => {
  // Calculate statistics
  const totalUsers = mockUsers.filter(user => user.role === 'job_seeker').length;
  const totalJobs = mockJobs.length;
  const totalCompanies = mockCompanies.length;
  const totalApplications = mockApplications.length;
  
  const activeJobs = mockJobs.filter(job => job.status === 'active').length;
  const pendingApplications = mockApplications.filter(app => app.status === 'under_review').length;
  const thisMonthApplications = mockApplications.filter(app => {
    const appDate = new Date(app.appliedDate);
    const now = new Date();
    return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
  }).length;

  const recentJobs = mockJobs.slice(0, 5);
  const recentApplications = mockApplications.slice(0, 5);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: UsersIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: BriefcaseIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Total Companies',
      value: totalCompanies,
      icon: BuildingOfficeIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
      change: '+3%',
      changeType: 'increase',
    },
    {
      title: 'Applications',
      value: thisMonthApplications,
      icon: DocumentTextIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
      change: '+15%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Admin Dashboard</h1>
          <p className="text-secondary-600">Overview of platform activity and management tools</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-success-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">Recent Job Postings</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-secondary-900">{job.title}</p>
                        <p className="text-sm text-secondary-500">{job.company.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <EyeIcon className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm text-secondary-600">{job.views}</span>
                      </div>
                      <p className="text-xs text-secondary-500">
                        {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">Recent Applications</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {mockUsers.find(u => u.id === application.userId)?.firstName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          {mockUsers.find(u => u.id === application.userId)?.firstName} {mockUsers.find(u => u.id === application.userId)?.lastName}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {mockJobs.find(j => j.id === application.jobId)?.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'applied' ? 'bg-primary-100 text-primary-800' :
                        application.status === 'under_review' ? 'bg-warning-100 text-warning-800' :
                        application.status === 'offer_made' ? 'bg-success-100 text-success-800' :
                        'bg-secondary-100 text-secondary-800'
                      }`}>
                        {application.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-secondary-500 mt-1">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Status Overview */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900">Application Status Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900">
                  {mockApplications.filter(app => app.status === 'applied').length}
                </p>
                <p className="text-sm text-secondary-600">New Applications</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="h-8 w-8 text-warning-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900">
                  {mockApplications.filter(app => app.status === 'under_review').length}
                </p>
                <p className="text-sm text-secondary-600">Under Review</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="h-8 w-8 text-success-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900">
                  {mockApplications.filter(app => app.status === 'offer_made').length}
                </p>
                <p className="text-sm text-secondary-600">Offers Extended</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ChartBarIcon className="h-8 w-8 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold text-secondary-900">
                  {Math.round((mockApplications.filter(app => app.status === 'offer_made').length / totalApplications) * 100)}%
                </p>
                <p className="text-sm text-secondary-600">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button fullWidth>
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Manage Jobs
              </Button>
              <Button variant="outline" fullWidth>
                <UsersIcon className="h-5 w-5 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" fullWidth>
                <ChartBarIcon className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 