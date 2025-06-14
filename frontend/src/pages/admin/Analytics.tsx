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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading analytics..." />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive system analytics and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-blue-600 font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">
                {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}% active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <span className="text-green-600 font-semibold">💼</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.activeJobs.toLocaleString()}</p>
              <p className="text-sm text-gray-600">
                {metrics.totalJobs} total posted
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <span className="text-purple-600 font-semibold">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalApplications.toLocaleString()}</p>
              <p className="text-sm text-blue-600">
                {Math.round((metrics.applicationsByStatus.accepted / metrics.totalApplications) * 100)}% success rate
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">ML Accuracy</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.systemPerformance.recommendationAccuracy}%</p>
              <p className="text-sm text-green-600">
                {metrics.systemPerformance.responseTime}ms avg response
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
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
                    <span className="text-sm font-medium text-gray-700">
                      {statusLabels[status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{count.toLocaleString()}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Search Queries */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Search Queries</h3>
          <div className="space-y-4">
            {metrics.topSearchQueries.map((query, index) => {
              const trendIcon = {
                up: '📈',
                down: '📉',
                stable: '➡️'
              };
              
              const trendColor = {
                up: 'text-green-600',
                down: 'text-red-600',
                stable: 'text-gray-600'
              };

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">#{index + 1}</span>
                    <span className="text-sm text-gray-700">{query.query}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{query.count}</span>
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
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Job Categories</h3>
          <div className="space-y-4">
            {metrics.popularJobCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{category.category}</p>
                  <p className="text-xs text-gray-500">{category.count} active jobs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{category.applicationRate}%</p>
                  <p className="text-xs text-gray-500">application rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Uptime</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.systemPerformance.uptime}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.uptime}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Response Time</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.systemPerformance.responseTime}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min((500 - metrics.systemPerformance.responseTime) / 500 * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Error Rate</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.systemPerformance.errorRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.errorRate * 10}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">ML Accuracy</span>
                <span className="text-sm font-semibold text-gray-900">{metrics.systemPerformance.recommendationAccuracy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${metrics.systemPerformance.recommendationAccuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
            <p className="text-sm text-gray-600">Download detailed analytics reports</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => showModal({
                type: 'info',
                title: 'Export Started',
                message: 'Your analytics report is being generated and will be downloaded shortly.',
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Export CSV
            </button>
            <button
              onClick={() => showModal({
                type: 'info',
                title: 'Export Started',
                message: 'Your detailed analytics report is being generated and will be downloaded shortly.',
              })}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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