import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BookmarkIcon,
  ShareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { mockJobs } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  // In a real app, this would fetch from API
  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Job Not Found</h1>
          <p className="text-secondary-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return 'Negotiable';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleApply = () => {
    if (!user) {
      // Redirect to login
      return;
    }
    setShowApplicationModal(true);
  };

  const submitApplication = () => {
    // In a real app, this would submit to API
    setApplicationSubmitted(true);
    setShowApplicationModal(false);
    setTimeout(() => setApplicationSubmitted(false), 5000);
  };

  const shareJob = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job opportunity at ${job.company.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Jobs
          </Link>
        </div>

        {/* Success Message */}
        {applicationSubmitted && (
          <div className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-success-600 mr-3" />
              <div>
                <h3 className="text-success-800 font-medium">Application Submitted!</h3>
                <p className="text-success-700 text-sm">
                  Your application has been sent to {job.company.name}. They'll review it and get back to you soon.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-secondary-600 mb-4">
                      <Link
                        to={`/companies/${job.company.id}`}
                        className="text-lg font-medium hover:text-primary-600"
                      >
                        {job.company.name}
                      </Link>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-1" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-secondary-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Posted {getTimeAgo(job.postedDate)}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        {job.applicationCount} applicants
                      </div>
                      <span className="capitalize">{job.type.replace('-', ' ')}</span>
                      <span className="capitalize">{job.experienceLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-3 text-secondary-400 hover:text-primary-600 transition-colors border border-secondary-200 rounded-lg"
                  >
                    {isBookmarked ? (
                      <BookmarkSolidIcon className="h-6 w-6 text-primary-600" />
                    ) : (
                      <BookmarkIcon className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={shareJob}
                    className="p-3 text-secondary-400 hover:text-primary-600 transition-colors border border-secondary-200 rounded-lg"
                  >
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-secondary-50 rounded-lg">
                <div className="text-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold text-secondary-900">
                    {formatSalary(job.salary.min, job.salary.max)}
                  </div>
                  <div className="text-sm text-secondary-600">Annual Salary</div>
                </div>
                <div className="text-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold text-secondary-900">
                    {job.company.size || '100-500'}
                  </div>
                  <div className="text-sm text-secondary-600">Company Size</div>
                </div>
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold text-secondary-900 capitalize">
                    {job.type.replace('-', ' ')}
                  </div>
                  <div className="text-sm text-secondary-600">Employment Type</div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Job Description</h2>
              <div className="prose prose-secondary max-w-none">
                <p className="text-secondary-700 leading-relaxed mb-6">
                  {job.description}
                </p>
                
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-secondary-700">Lead development of new features and maintain existing codebase</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-secondary-700">Collaborate with cross-functional teams to define, design, and ship new features</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-secondary-700">Write clean, maintainable code following best practices</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-secondary-700">Mentor junior developers and conduct code reviews</span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Required Qualifications</h3>
                <ul className="space-y-2 mb-6">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-secondary-700">{req}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-secondary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge-primary text-sm py-2 px-4"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Button
                onClick={handleApply}
                size="lg"
                fullWidth
                className="mb-4"
              >
                Apply for this Job
              </Button>
              <p className="text-sm text-secondary-600 text-center">
                Quick apply with your AccessJobs profile
              </p>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                About {job.company.name}
              </h3>
              <div className="space-y-4">
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <p className="text-sm text-secondary-700 leading-relaxed">
                  {job.company.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Industry:</span>
                    <span className="text-secondary-900">{job.company.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Size:</span>
                    <span className="text-secondary-900">{job.company.size || '100-500'} employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Founded:</span>
                    <span className="text-secondary-900">{job.company.founded || '2010'}</span>
                  </div>
                </div>
                <Link to={`/companies/${job.company.id}`}>
                  <Button variant="outline" size="sm" fullWidth>
                    View Company Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Similar Jobs
              </h3>
              <div className="space-y-4">
                {mockJobs.filter(j => j.id !== job.id).slice(0, 3).map((similarJob) => (
                  <div key={similarJob.id} className="border-b border-secondary-100 pb-4 last:border-b-0">
                    <Link to={`/jobs/${similarJob.id}`}>
                      <h4 className="font-medium text-secondary-900 hover:text-primary-600 mb-1">
                        {similarJob.title}
                      </h4>
                    </Link>
                    <p className="text-sm text-secondary-600 mb-2">{similarJob.company.name}</p>
                    <div className="flex items-center justify-between text-xs text-secondary-500">
                      <span>{similarJob.location}</span>
                      <span>{formatSalary(similarJob.salary.min, similarJob.salary.max)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Job */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button className="flex items-center text-sm text-secondary-600 hover:text-secondary-900">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                Report this job
              </button>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        <Modal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          title={`Apply for ${job.title}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="border-b border-secondary-200 pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-secondary-900">{job.title}</h3>
                  <p className="text-secondary-600">{job.company.name}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Your Profile</h4>
              <div className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-secondary-600">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                rows={6}
                className="input"
                placeholder="Tell the employer why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowApplicationModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitApplication}>
                Submit Application
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default JobDetails; 