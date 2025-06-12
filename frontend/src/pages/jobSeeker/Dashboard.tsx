import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockRecommendations, mockApplications, mockBookmarks, simulateApiCall } from '../../services/mockData';
import { JobRecommendation, JobApplication, JobBookmark } from '../../types';
import Loading from '../../components/shared/Loading';

const Dashboard: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [recentBookmarks, setRecentBookmarks] = useState<JobBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 800);
      
      // Load user-specific data
      const userApplications = mockApplications.filter(app => app.userId === user?.id);
      const userBookmarks = mockBookmarks.filter(bookmark => bookmark.userId === user?.id);
      
      setRecommendations(mockRecommendations.slice(0, 3));
      setRecentApplications(userApplications.slice(0, 3));
      setRecentBookmarks(userBookmarks.slice(0, 3));
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, showModal]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRecommendationFeedback = async (jobId: string, feedback: 'like' | 'dislike' | 'not_relevant') => {
    setLoading({ isLoading: true, message: 'Saving feedback...' });
    
    try {
      await simulateApiCall(null, 500);
      
      showModal({
        type: 'success',
        title: 'Feedback Saved',
        message: 'Thank you for your feedback! This helps us improve your recommendations.',
      });
      
      // Remove the recommendation from the list to simulate learning
      setRecommendations(prev => prev.filter(rec => rec.job.id !== jobId));
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to save feedback',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading your dashboard..." />
      </div>
    );
  }

  const stats = [
    { name: 'Job Applications', value: recentApplications.length, change: '+2 this week', changeType: 'positive' },
    { name: 'Saved Jobs', value: recentBookmarks.length, change: '+1 today', changeType: 'positive' },
    { name: 'Profile Views', value: '12', change: '+4 this week', changeType: 'positive' },
    { name: 'Interview Invites', value: '2', change: '+1 this week', changeType: 'positive' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your job search today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recommended for You</h2>
              <Link
                to="/jobs?tab=recommendations"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {recommendation.job.title}
                        </h3>
                        <p className="text-sm text-gray-600">{recommendation.job.company}</p>
                        <p className="text-sm text-gray-500">{recommendation.job.location}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {Math.round(recommendation.score * 100)}% Match
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Link
                          to={`/jobs/${recommendation.job.id}`}
                          className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                    
                    {/* AI Explanation */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-xs text-blue-800 font-medium mb-1">Why this job matches:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {recommendation.explanation.reasons.slice(0, 2).map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleRecommendationFeedback(recommendation.job.id, 'like')}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        👍 Relevant
                      </button>
                      <button
                        onClick={() => handleRecommendationFeedback(recommendation.job.id, 'dislike')}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        👎 Not Interested
                      </button>
                      <button
                        onClick={() => handleRecommendationFeedback(recommendation.job.id, 'not_relevant')}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                      >
                        Not Relevant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recommendations available. Complete your profile to get personalized job suggestions.</p>
                <Link
                  to="/profile"
                  className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                <Link
                  to="/applications"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.job.title}</p>
                        <p className="text-sm text-gray-600">{application.job.company}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'interview_scheduled' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No applications yet. Start applying to jobs!</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/jobs"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Update Profile
                </Link>
                <Link
                  to="/jobs/alerts"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Job Alerts
                </Link>
                <Link
                  to="/skills-analysis"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Skill Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 