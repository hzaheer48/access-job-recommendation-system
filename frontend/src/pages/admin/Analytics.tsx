import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDashboardMetrics, simulateApiCall } from '../../services/mockData';
import { DashboardMetrics } from '../../types';
import Loading from '../../components/shared/Loading';

const AdminAnalytics: React.FC = () => {
  const { showModal } = useApp();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 800);
      setMetrics(mockDashboardMetrics);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load analytics data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <Loading inline message="Loading analytics..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">No analytics data available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 dark:from-white dark:to-primary-400 bg-clip-text text-transparent">
                  Analytics Dashboard 📊
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive system analytics and performance metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
                  className="px-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/20 dark:border-gray-600/30 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}% active
              </p>
            </div>
          </div>
        </div>

        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-semibold">💼</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.activeJobs.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metrics.totalJobs} total posted
              </p>
            </div>
          </div>
        </div>

        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-semibold">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Applications</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.totalApplications.toLocaleString()}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {Math.round((metrics.applicationsByStatus.accepted / metrics.totalApplications) * 100)}% success rate
              </p>
            </div>
          </div>
        </div>

        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-medium transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ML Accuracy</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.systemPerformance.recommendationAccuracy}%</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {metrics.systemPerformance.responseTime}ms avg response
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Status Distribution */}
        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
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
                accepted: 'bg-emerald-500',
                rejected: 'bg-red-500',
                withdrawn: 'bg-gray-500'
              };

              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {statusLabels[status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{count.toLocaleString()}</span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Search Queries */}
        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Search Queries</h3>
          <div className="space-y-4">
            {metrics.topSearchQueries.map((query, index) => {
              const trendIcon = {
                up: '📈',
                down: '📉',
                stable: '➡️'
              };
              
              const trendColor = {
                up: 'text-green-600 dark:text-green-400',
                down: 'text-red-600 dark:text-red-400',
                stable: 'text-gray-600 dark:text-gray-400'
              };

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">#{index + 1}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{query.query}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{query.count}</span>
                    <span className={`text-xs ${trendColor[query.trend]}`}>
                      {trendIcon[query.trend]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Popular Job Categories */}
        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Job Categories</h3>
          <div className="space-y-4">
            {metrics.popularJobCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{category.category}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{category.count} active jobs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{category.applicationRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">application rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Performance</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{metrics.systemPerformance.uptime}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.uptime}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Time</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{metrics.systemPerformance.responseTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min((500 - metrics.systemPerformance.responseTime) / 500 * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Error Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{metrics.systemPerformance.errorRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.errorRate * 10}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ML Accuracy</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{metrics.systemPerformance.recommendationAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.recommendationAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Export and Actions */}
      <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Download detailed analytics reports</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => showModal({
                type: 'info',
                title: 'Export Started',
                message: 'Your analytics report is being generated and will be downloaded shortly.',
              })}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              Export CSV
            </button>
            <button
              onClick={() => showModal({
                type: 'info',
                title: 'Export Started',
                message: 'Your detailed analytics report is being generated and will be downloaded shortly.',
              })}
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;