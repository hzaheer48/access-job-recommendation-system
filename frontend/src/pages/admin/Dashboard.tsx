import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockDashboardMetrics, mockSystemActivities, simulateApiCall } from '../../services/mockData';
import { DashboardMetrics, SystemActivity } from '../../types';
import Loading from '../../components/shared/Loading';

const Dashboard: React.FC = () => {
  const { state, showModal } = useApp();
  const { user } = state;
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 800);
      setMetrics(mockDashboardMetrics);
      setActivities(mockSystemActivities.slice(0, 10));
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return '👤';
      case 'job_posted':
        return '💼';
      case 'application_submitted':
        return '📝';
      case 'login':
        return '🔐';
      case 'search':
        return '🔍';
      default:
        return '📊';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration':
        return 'text-green-600';
      case 'job_posted':
        return 'text-blue-600';
      case 'application_submitted':
        return 'text-purple-600';
      case 'login':
        return 'text-gray-600';
      case 'search':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <Loading inline message="Loading dashboard..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">No dashboard data available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 dark:from-white dark:to-primary-300 bg-clip-text text-transparent">
                    Admin Dashboard 📊
                  </h1>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    System overview and key metrics
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Filter */}
          <div className="mb-8">
            <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time Period
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  {['7d', '30d', '90d'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period as '7d' | '30d' | '90d')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        timeframe === period
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md transform scale-105'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-600'
                      }`}
                    >
                      {period === '7d' && '📅 Last 7 days'}
                      {period === '30d' && '📊 Last 30 days'}
                      {period === '90d' && '📈 Last 90 days'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
              {metrics.totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1">
              +{metrics.activeUsers} active today
            </p>
          </div>
        </div>

        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V4m8 0h2a2 2 0 012 2v6.5" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Active Jobs
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
              {metrics.activeJobs.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {metrics.totalJobs} total posted
            </p>
          </div>
        </div>

        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Applications
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
              {metrics.totalApplications.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {Math.round((metrics.applicationsByStatus.accepted / metrics.totalApplications) * 100)}% success rate
            </p>
          </div>
        </div>

        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              System Health
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
              {metrics.systemPerformance.uptime}%
            </p>
            <p className="text-sm text-green-600 mt-1">
              {metrics.systemPerformance.responseTime}ms avg response
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(metrics.applicationsByStatus).map(([status, count]) => {
              const percentage = (count / metrics.totalApplications) * 100;
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
              
              const statusColors = {
                applied: 'bg-blue-500',
                under_review: 'bg-yellow-500',
                interview_scheduled: 'bg-purple-500',
                interviewed: 'bg-indigo-500',
                offer_extended: 'bg-green-500',
                accepted: 'bg-green-600',
                rejected: 'bg-red-500',
                withdrawn: 'bg-gray-500'
              };

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{statusLabels[status as keyof typeof statusLabels]}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Job Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Job Categories</h3>
          <div className="space-y-4">
            {metrics.popularJobCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-900 dark:text-white font-medium">{category.category}</span>
                    <span className="text-gray-600 dark:text-gray-300">{category.count} jobs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(category.count / metrics.popularJobCategories[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      {category.applicationRate}% app rate
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <Link to="/admin/analytics" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Performance</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Uptime</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.systemPerformance.uptime}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.uptime}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Response Time</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.systemPerformance.responseTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.systemPerformance.responseTime < 200 ? 'bg-green-500' :
                    metrics.systemPerformance.responseTime < 500 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((1000 - metrics.systemPerformance.responseTime) / 1000 * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Error Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.systemPerformance.errorRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metrics.systemPerformance.errorRate < 1 ? 'bg-green-500' :
                    metrics.systemPerformance.errorRate < 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(100 - metrics.systemPerformance.errorRate * 20, 10)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">AI Recommendation Accuracy</span>
                <span className="font-medium text-gray-900 dark:text-white">{metrics.systemPerformance.recommendationAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.recommendationAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            Manage Users
          </Link>
          <Link
            to="/admin/jobs"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            Manage Jobs
          </Link>
          <Link
            to="/admin/analytics"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Settings
          </Link>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;