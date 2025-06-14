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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="card-glass backdrop-blur-sm border border-white/20">
            <div className="px-6 py-8 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 bg-clip-text text-transparent">
                    Welcome back, {user?.firstName}! 👋
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    Here's what's happening with your job search today.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V4m8 0h2a2 2 0 012 2v6.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const colors = [
                { bg: 'from-primary-50 to-primary-100', border: 'border-primary-200/50', icon: 'from-primary-500 to-primary-600', text: 'text-primary-600', hover: 'from-primary-500 to-primary-600' },
                { bg: 'from-success-50 to-success-100', border: 'border-success-200/50', icon: 'from-success-500 to-success-600', text: 'text-success-600', hover: 'from-success-500 to-success-600' },
                { bg: 'from-warning-50 to-warning-100', border: 'border-warning-200/50', icon: 'from-warning-500 to-warning-600', text: 'text-warning-600', hover: 'from-warning-500 to-warning-600' },
                { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200/50', icon: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', hover: 'from-indigo-500 to-indigo-600' }
              ];
              const color = colors[index % colors.length];
              
              return (
                <div key={stat.name} className={`group relative bg-gradient-to-br ${color.bg} rounded-2xl p-6 hover:shadow-large transition-all duration-300 hover:-translate-y-1 border ${color.border}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.hover} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${color.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V4m8 0h2a2 2 0 012 2v6.5" />
                        </svg>
                      </div>
                      <div className={`text-2xl font-bold ${color.text}`}>{stat.value}</div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">{stat.name}</h3>
                    <p className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Recommendations */}
          <div className="card-glass backdrop-blur-sm border border-white/20">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    AI Recommendations
                  </h3>
                </div>
                <div className="badge-primary text-xs px-2 py-1">
                  {recommendations.length} new
                </div>
              </div>
              
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <div key={recommendation.job.id} className="group relative bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-5 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{recommendation.job.title}</h4>
                            <p className="text-sm text-gray-600 font-medium">{recommendation.job.company}</p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {recommendation.job.location}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/jobs/${recommendation.job.id}`}
                              className="btn-primary text-xs px-4 py-2 hover:scale-105 transition-transform duration-200"
                            >
                              View Job
                            </Link>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              Math.round(recommendation.score * 100) >= 90 ? 'bg-success-100 text-success-700' :
                              Math.round(recommendation.score * 100) >= 75 ? 'bg-warning-100 text-warning-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                Math.round(recommendation.score * 100) >= 90 ? 'bg-success-500' :
                                Math.round(recommendation.score * 100) >= 75 ? 'bg-warning-500' :
                                'bg-gray-500'
                              }`}></div>
                              {Math.round(recommendation.score * 100)}% match
                            </span>
                          </div>
                        </div>
                        
                        {/* AI Explanation */}
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-800 font-medium mb-1">Why this job matches:</p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            {recommendation.explanation.reasons.slice(0, 2).map((reason, index) => (
                              <li key={index}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Feedback buttons */}
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Was this recommendation helpful?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRecommendationFeedback(recommendation.job.id, 'like')}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg text-success-700 bg-success-50 hover:bg-success-100 transition-colors duration-200"
                            >
                              👍 Relevant
                            </button>
                            <button
                              onClick={() => handleRecommendationFeedback(recommendation.job.id, 'dislike')}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                            >
                              👎 Not Interested
                            </button>
                            <button
                              onClick={() => handleRecommendationFeedback(recommendation.job.id, 'not_relevant')}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                            >
                              Not Relevant
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No recommendations available. Complete your profile to get personalized job suggestions.</p>
                  <Link
                    to="/profile"
                    className="btn-primary text-sm px-6 py-2"
                  >
                    Complete Profile
                  </Link>
                </div>
              )}
              
              <div className="mt-6">
                <Link
                  to="/jobs?tab=recommendations"
                  className="w-full btn-secondary text-sm py-3 hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center"
                >
                  View all recommendations
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="card-glass backdrop-blur-sm border border-white/20">
              <div className="px-6 py-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Recent Applications
                    </h3>
                  </div>
                  <div className="badge-secondary text-xs px-2 py-1">
                    {recentApplications.length} active
                  </div>
                </div>
                
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="group relative bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-5 hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{application.job.title}</h4>
                              <p className="text-sm text-gray-600 font-medium">{application.job.company}</p>
                            </div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                application.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                                application.status === 'under_review' ? 'bg-warning-100 text-warning-700' :
                                application.status === 'interview_scheduled' ? 'bg-success-100 text-success-700' :
                                application.status === 'rejected' ? 'bg-error-100 text-error-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  application.status === 'applied' ? 'bg-blue-500' :
                                  application.status === 'under_review' ? 'bg-warning-500' :
                                  application.status === 'interview_scheduled' ? 'bg-success-500' :
                                  application.status === 'rejected' ? 'bg-error-500' :
                                  'bg-gray-500'
                                }`}></div>
                                {application.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          {application.status === 'interview_scheduled' && (
                            <div className="mt-3 p-3 bg-success-50 rounded-lg border border-success-200">
                              <p className="text-xs text-success-700 font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Interview scheduled
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No applications yet. Start applying to jobs!</p>
                    <Link
                      to="/jobs"
                      className="btn-primary text-sm px-6 py-2"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                )}
                
                <div className="mt-6">
                  <Link
                    to="/applications"
                    className="w-full btn-secondary text-sm py-3 hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center"
                  >
                    View all applications
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-glass backdrop-blur-sm border border-white/20">
              <div className="px-6 py-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/jobs"
                    className="group relative bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-sm font-medium text-gray-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Browse Jobs</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="group relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-4 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-sm font-medium text-white hover:scale-105"
                  >
                    Update Profile
                  </Link>
                  <Link
                    to="/jobs/alerts"
                    className="group relative bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-sm font-medium text-gray-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Job Alerts</span>
                  </Link>
                  <Link
                    to="/skills-analysis"
                    className="group relative bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-sm font-medium text-gray-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">Skill Analysis</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;