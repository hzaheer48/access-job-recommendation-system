import React, { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { mockUsers, mockJobs, mockApplications } from '../../data/mockData';

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Calculate metrics
  const totalUsers = mockUsers.filter(user => user.role === 'job_seeker').length;
  const totalJobs = mockJobs.length;
  const totalApplications = mockApplications.length;
  const activeJobs = mockJobs.filter(job => job.status === 'active').length;

  // Mock analytics data for charts
  const userGrowthData = [
    { month: 'Jan', users: 120, jobs: 45 },
    { month: 'Feb', users: 185, jobs: 62 },
    { month: 'Mar', users: 230, jobs: 78 },
    { month: 'Apr', users: 290, jobs: 95 },
    { month: 'May', users: 340, jobs: 112 },
    { month: 'Jun', users: 400, jobs: 128 },
  ];

  const applicationStatusData = [
    { status: 'Applied', count: 245, percentage: 35 },
    { status: 'Under Review', count: 180, percentage: 26 },
    { status: 'Interview', count: 120, percentage: 17 },
    { status: 'Offer', count: 85, percentage: 12 },
    { status: 'Rejected', count: 70, percentage: 10 },
  ];

  const topCompanies = [
    { name: 'TechCorp Inc.', jobs: 12, applications: 145 },
    { name: 'InnovateTech', jobs: 8, applications: 98 },
    { name: 'DataDrive Solutions', jobs: 6, applications: 76 },
    { name: 'CloudFirst Systems', jobs: 5, applications: 62 },
    { name: 'Digital Dynamics', jobs: 4, applications: 45 },
  ];

  const metrics = [
    {
      title: 'Total Users',
      value: totalUsers,
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Active Jobs',
      value: activeJobs,
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: BriefcaseIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Applications',
      value: totalApplications,
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: DocumentTextIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      title: 'Success Rate',
      value: '23.5%',
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: ChartBarIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Analytics Dashboard</h1>
              <p className="text-secondary-600">Platform performance and key metrics</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center">
                <div className={`${metric.bgColor} rounded-lg p-3`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{metric.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-secondary-900">{metric.value}</p>
                    <div className={`ml-2 flex items-center text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {metric.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Growth Trends</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                  <span className="text-secondary-600">Users</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                  <span className="text-secondary-600">Jobs</span>
                </div>
              </div>
            </div>
            
            {/* Simple Bar Chart Representation */}
            <div className="space-y-4">
              {userGrowthData.map((data, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 text-sm text-secondary-600">{data.month}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="w-full bg-secondary-200 rounded-full h-3">
                          <div 
                            className="bg-primary-500 h-3 rounded-full" 
                            style={{ width: `${(data.users / 400) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-secondary-600 w-12">{data.users}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1">
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div 
                            className="bg-success-500 h-2 rounded-full" 
                            style={{ width: `${(data.jobs / 128) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-secondary-500 w-12">{data.jobs}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">Application Status</h3>
            <div className="space-y-4">
              {applicationStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      index === 0 ? 'bg-primary-500' :
                      index === 1 ? 'bg-warning-500' :
                      index === 2 ? 'bg-success-500' :
                      index === 3 ? 'bg-secondary-500' :
                      'bg-danger-500'
                    }`}></div>
                    <span className="text-sm font-medium text-secondary-900">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-secondary-600">{item.count}</span>
                    <div className="w-20 bg-secondary-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-primary-500' :
                          index === 1 ? 'bg-warning-500' :
                          index === 2 ? 'bg-success-500' :
                          index === 3 ? 'bg-secondary-500' :
                          'bg-danger-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-secondary-500 w-8">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Companies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">Top Companies</h3>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900">{company.name}</div>
                      <div className="text-sm text-secondary-500">{company.jobs} active jobs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-secondary-900">{company.applications}</div>
                    <div className="text-sm text-secondary-500">applications</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-4 w-4 text-success-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">25 new users registered</p>
                  <p className="text-xs text-secondary-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <BriefcaseIcon className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">8 new jobs posted</p>
                  <p className="text-xs text-secondary-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">142 applications submitted</p>
                  <p className="text-xs text-secondary-500">6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                  <EyeIcon className="h-4 w-4 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-900">1,250 job views today</p>
                  <p className="text-xs text-secondary-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 