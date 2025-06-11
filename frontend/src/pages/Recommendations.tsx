import React, { useState } from 'react';
import {
  SparklesIcon,
  HeartIcon,
  XMarkIcon,
  EyeIcon,
  BookmarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { mockRecommendations } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Recommendations: React.FC = () => {
  const { user } = useAuth();
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [filterBy, setFilterBy] = useState('all');

  const userRecommendations = mockRecommendations.filter(rec => rec.userId === user?.id);

  const handleFeedback = (recommendationId: string, feedback: 'like' | 'dislike') => {
    setFeedbackGiven(prev => new Set([...prev, recommendationId]));
    // In a real app, this would send feedback to improve the AI model
    console.log(`Feedback for ${recommendationId}: ${feedback}`);
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getRecommendationScore = (score: number) => {
    return Math.round(score * 100);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return 'Negotiable';
  };

  const getScoreColor = (score: number) => {
    const percentage = score * 100;
    if (percentage >= 90) return 'text-success-600 bg-success-100';
    if (percentage >= 75) return 'text-primary-600 bg-primary-100';
    if (percentage >= 60) return 'text-warning-600 bg-warning-100';
    return 'text-secondary-600 bg-secondary-100';
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2 flex items-center">
                <SparklesIcon className="h-8 w-8 text-primary-600 mr-3" />
                AI-Powered Recommendations
              </h1>
              <p className="text-secondary-600">
                Personalized job suggestions based on your skills, experience, and preferences
              </p>
            </div>
            <Button variant="outline">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Tune Recommendations
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 rounded-lg p-3">
                <SparklesIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">{userRecommendations.length}</p>
                <p className="text-sm text-secondary-600">New Recommendations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-success-100 rounded-lg p-3">
                <HeartIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">
                  {userRecommendations.filter(rec => getRecommendationScore(rec.score) >= 90).length}
                </p>
                <p className="text-sm text-secondary-600">90%+ Match</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-warning-100 rounded-lg p-3">
                <EyeIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">156</p>
                <p className="text-sm text-secondary-600">Jobs Viewed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-secondary-100 rounded-lg p-3">
                <BookmarkIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-secondary-900">23</p>
                <p className="text-sm text-secondary-600">Jobs Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-secondary-700">Filter by match score:</span>
            <div className="flex space-x-2">
              {[
                { label: 'All', value: 'all' },
                { label: '90%+', value: '90' },
                { label: '80%+', value: '80' },
                { label: '70%+', value: '70' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterBy(filter.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filterBy === filter.value
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-8">
          {userRecommendations
            .filter(rec => {
              if (filterBy === 'all') return true;
              return getRecommendationScore(rec.score) >= parseInt(filterBy);
            })
            .map((recommendation) => (
            <div key={recommendation.id} className="bg-white rounded-lg shadow-sm border border-secondary-200">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={recommendation.job.company.logo}
                      alt={recommendation.job.company.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer mb-2">
                        {recommendation.job.title}
                      </h3>
                      <p className="text-lg text-secondary-600 mb-2">{recommendation.job.company.name}</p>
                      <div className="flex items-center text-secondary-500 space-x-4">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {recommendation.job.location}
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {formatSalary(recommendation.job.salary.min, recommendation.job.salary.max)}
                        </div>
                        <span className="capitalize">{recommendation.job.type.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center px-4 py-2 rounded-full ${getScoreColor(recommendation.score)}`}>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      <span className="font-semibold">
                        {getRecommendationScore(recommendation.score)}% Match
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBookmark(recommendation.job.id)}
                      className="p-3 text-secondary-400 hover:text-primary-600 transition-colors border border-secondary-200 rounded-lg"
                    >
                      {bookmarkedJobs.has(recommendation.job.id) ? (
                        <BookmarkSolidIcon className="h-6 w-6 text-primary-600" />
                      ) : (
                        <BookmarkIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-6 p-6 bg-primary-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Why this job is perfect for you
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation.reasons.map((reason, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium text-primary-900 capitalize">{reason.type}:</span>
                          <span className="text-primary-800 ml-1">{reason.description}</span>
                          <div className="w-full bg-primary-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-500 h-2 rounded-full" 
                              style={{ width: `${reason.weight * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <p className="text-secondary-700 leading-relaxed">
                    {recommendation.job.description}
                  </p>
                </div>

                {/* Skills Match */}
                <div className="mb-6">
                  <h4 className="font-semibold text-secondary-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`badge text-sm py-2 px-3 ${
                          // Simulate skill matching
                          Math.random() > 0.3 ? 'badge-success' : 'badge-secondary'
                        }`}
                      >
                        {skill}
                        {Math.random() > 0.3 && (
                          <span className="ml-1">✓</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
                  <div className="flex space-x-3">
                    <Button size="lg">Apply Now</Button>
                    <Button variant="outline" size="lg">View Details</Button>
                    <Button variant="outline" size="lg">
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Similar Jobs
                    </Button>
                  </div>
                  
                  {!feedbackGiven.has(recommendation.id) && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-secondary-600">Was this helpful?</span>
                      <button
                        onClick={() => handleFeedback(recommendation.id, 'like')}
                        className="p-2 text-secondary-400 hover:text-success-600 transition-colors"
                      >
                        <HeartIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(recommendation.id, 'dislike')}
                        className="p-2 text-secondary-400 hover:text-danger-600 transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  {feedbackGiven.has(recommendation.id) && (
                    <div className="flex items-center text-success-600">
                      <HeartSolidIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">Thank you for your feedback!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {userRecommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <SparklesIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No recommendations yet
              </h3>
              <p className="text-secondary-600 mb-6">
                Complete your profile to get personalized job recommendations
              </p>
              <Button>Complete Profile</Button>
            </div>
          </div>
        )}

        {/* Load More */}
        {userRecommendations.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Recommendations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations; 