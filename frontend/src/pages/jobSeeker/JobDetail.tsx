import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockJobs, mockRecommendations, mockApplications, simulateApiCall } from '../../services/mockData';
import { Job, JobRecommendation, ApplicationStatus } from '../../types';
import Loading from '../../components/shared/Loading';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  
  const [job, setJob] = useState<Job | null>(null);
  const [recommendation, setRecommendation] = useState<JobRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (id) {
      loadJobDetail(id);
    }
  }, [id]);

  const loadJobDetail = async (jobId: string) => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 600);
      
      const foundJob = mockJobs.find(j => j.id === jobId);
      if (!foundJob) {
        showModal({
          type: 'error',
          title: 'Job Not Found',
          message: 'The job you are looking for does not exist.',
        });
        navigate('/jobs');
        return;
      }

      setJob(foundJob);
      
      // Check if there's a recommendation for this job
      const jobRecommendation = mockRecommendations.find(r => r.job.id === jobId);
      if (jobRecommendation) {
        setRecommendation(jobRecommendation);
      }

      // Check if user has already applied
      const existingApplication = mockApplications.find(
        app => app.jobId === jobId && app.userId === user?.id
      );
      setHasApplied(!!existingApplication);

      // Mock bookmarked status
      setIsBookmarked(Math.random() > 0.7);
      
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load job details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!applicationData.coverLetter.trim()) {
      showModal({
        type: 'error',
        title: 'Cover Letter Required',
        message: 'Please provide a cover letter for your application.',
      });
      return;
    }

    setLoading({ isLoading: true, message: 'Submitting application...' });
    
    try {
      await simulateApiCall(null, 1000);
      
      setHasApplied(true);
      setShowApplicationModal(false);
      
      showModal({
        type: 'success',
        title: 'Application Submitted!',
        message: 'Your application has been successfully submitted. We\'ll notify you of any updates.',
      });
      
      setApplicationData({ coverLetter: '', additionalInfo: '' });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Application Failed',
        message: 'Failed to submit your application. Please try again.',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const handleBookmark = async () => {
    setLoading({ isLoading: true, message: isBookmarked ? 'Removing bookmark...' : 'Saving job...' });
    
    try {
      await simulateApiCall(null, 500);
      setIsBookmarked(!isBookmarked);
      
      showModal({
        type: 'success',
        title: isBookmarked ? 'Bookmark Removed' : 'Job Bookmarked',
        message: isBookmarked ? 'Job removed from your bookmarks.' : 'Job saved to your bookmarks!',
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to update bookmark status',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading job details..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
          <p className="mt-2 text-gray-600">The job you are looking for does not exist.</p>
          <Link to="/jobs" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-md">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-primary-600 hover:text-primary-700"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Job Header */}
            <div className="flex items-start space-x-4 mb-6">
              {job.companyLogo && (
                <img 
                  src={job.companyLogo} 
                  alt={job.company}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.jobType.replace('-', ' ')}</span>
                  <span>📈 {job.experienceLevel}</span>
                  <span>⏰ Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Salary Range</h3>
              <p className="text-2xl font-bold text-green-900">
                ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">per year</p>
            </div>

            {/* AI Match Score */}
            {recommendation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-800">AI Match Analysis</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {Math.round(recommendation.score * 100)}% Match
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Why this job fits you:</h4>
                    <ul className="space-y-1">
                      {recommendation.explanation.reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Skills Match:</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.explanation.skillsMatch.matched.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {recommendation.explanation.skillsMatch.missing.length > 0 && (
                    <div>
                      <h4 className="font-medium text-orange-800 mb-1">Skills to develop:</h4>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.explanation.skillsMatch.missing.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs font-medium"
                          >
                            → {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            {/* Application Status */}
            {hasApplied ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-800 font-medium">Application Submitted</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You've already applied for this position.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowApplicationModal(true)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium mb-4 transition-colors"
              >
                Apply Now
              </button>
            )}

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className={`w-full px-4 py-2 rounded-lg font-medium mb-6 transition-colors ${
                isBookmarked
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isBookmarked ? '★ Bookmarked' : '☆ Save Job'}
            </button>

            {/* Job Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Applications:</span>
                <span className="font-medium">{job.applicationCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Views:</span>
                <span className="font-medium">{Math.floor(job.applicationCount * 5.2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Posted:</span>
                <span className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Similar Jobs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Similar Jobs</h3>
              <div className="space-y-3">
                {mockJobs
                  .filter(j => j.id !== job.id && j.jobType === job.jobType)
                  .slice(0, 3)
                  .map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      to={`/jobs/${similarJob.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{similarJob.title}</h4>
                      <p className="text-gray-600 text-xs">{similarJob.company}</p>
                      <p className="text-gray-500 text-xs">{similarJob.location}</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Apply for {job.title}</h3>
              <p className="text-gray-600">at {job.company}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                  placeholder="Explain why you're interested in this role and how your skills match the requirements..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={applicationData.additionalInfo}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail; 