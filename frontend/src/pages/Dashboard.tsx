import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  BookmarkIcon,
  BellIcon,
  ChartBarIcon,
  SparklesIcon,
  HeartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { mockRecommendations, mockApplications } from '../data/mockData';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

  const handleFeedback = (recommendationId: string, feedback: 'like' | 'dislike') => {
    setFeedbackGiven(prev => new Set([...prev, recommendationId]));
    // In a real app, this would send feedback to the backend
    console.log(`Feedback for ${recommendationId}: ${feedback}`);
  };

  const userApplications = mockApplications.filter(app => app.userId === user?.id);
  const userRecommendations = mockRecommendations.filter(rec => rec.userId === user?.id);

  const stats = [
    {
      title: 'Applications Sent',
      value: userApplications.length,
      icon: DocumentTextIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Under Review',
      value: userApplications.filter(app => app.status === 'under_review').length,
      icon: ChartBarIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      title: 'Interviews',
      value: userApplications.filter(app => 
        ['phone_screening', 'technical_interview', 'final_interview'].includes(app.status)
      ).length,
      icon: BriefcaseIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Saved Jobs',
      value: 5, // This would come from bookmarks
      icon: BookmarkIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
  ];

  const getRecommendationScore = (score: number) => {
    return Math.round(score * 100);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return 'Negotiable';
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-secondary-600">
            Here are your personalized job recommendations and latest updates.
          </p>
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
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <SparklesIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h2 className="text-xl font-semibold text-secondary-900">
                      AI-Powered Recommendations
                    </h2>
                  </div>
                  <span className="badge-primary">
                    {getRecommendationScore(userRecommendations[0]?.score || 0)}% Match
                  </span>
                </div>
                <p className="text-secondary-600 mt-2">
                  Jobs tailored specifically for your skills and preferences
                </p>
              </div>

              <div className="p-6 space-y-6">
                {userRecommendations.slice(0, 3).map((recommendation) => (
                  <div key={recommendation.id} className="border border-secondary-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={recommendation.job.company.logo}
                          alt={recommendation.job.company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                            {recommendation.job.title}
                          </h3>
                          <p className="text-secondary-600">{recommendation.job.company.name}</p>
                          <p className="text-sm text-secondary-500">{recommendation.job.location}</p>
                        </div>
                      </div>
                      <span className="badge-success">
                        {getRecommendationScore(recommendation.score)}% Match
                      </span>
                    </div>

                    {/* Why Recommended */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-secondary-700 mb-2">
                        Why this job is perfect for you:
                      </h4>
                      <div className="space-y-1">
                        {recommendation.reasons.map((reason, index) => (
                          <div key={index} className="flex items-center text-sm text-secondary-600">
                            <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                            {reason.description}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
                      <span className="capitalize">{recommendation.job.type.replace('-', ' ')}</span>
                      <span>{formatSalary(recommendation.job.salary.min, recommendation.job.salary.max)}</span>
                      <span className="capitalize">{recommendation.job.experienceLevel}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm">Apply Now</Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      
                      {!feedbackGiven.has(recommendation.id) && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-secondary-500">Helpful?</span>
                          <button
                            onClick={() => handleFeedback(recommendation.id, 'like')}
                            className="p-1 text-secondary-400 hover:text-success-600 transition-colors"
                          >
                            <HeartIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(recommendation.id, 'dislike')}
                            className="p-1 text-secondary-400 hover:text-danger-600 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      {feedbackGiven.has(recommendation.id) && (
                        <div className="flex items-center text-xs text-success-600">
                          <HeartSolidIcon className="h-4 w-4 mr-1" />
                          Thank you for your feedback!
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <Link to="/recommendations">
                    <Button variant="outline">View All Recommendations</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">Recent Applications</h3>
              </div>
              <div className="p-6 space-y-4">
                {userApplications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-900 text-sm">
                        {application.job.title}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {application.job.company.name}
                      </p>
                    </div>
                    <span className={`badge text-xs ${
                      application.status === 'under_review' ? 'badge-warning' :
                      application.status === 'applied' ? 'badge-primary' :
                      'badge-success'
                    }`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
                <Link to="/applications">
                  <Button variant="outline" size="sm" fullWidth>
                    View All Applications
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link to="/jobs">
                  <Button variant="outline" size="sm" fullWidth>
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    Browse All Jobs
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="sm" fullWidth>
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
                <Link to="/alerts">
                  <Button variant="outline" size="sm" fullWidth>
                    <BellIcon className="h-4 w-4 mr-2" />
                    Manage Alerts
                  </Button>
                </Link>
                <Link to="/bookmarks">
                  <Button variant="outline" size="sm" fullWidth>
                    <BookmarkIcon className="h-4 w-4 mr-2" />
                    Saved Jobs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-primary-100 text-sm mb-4">
                Add more details to get better job recommendations
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-primary-400 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="secondary" size="sm" fullWidth>
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 