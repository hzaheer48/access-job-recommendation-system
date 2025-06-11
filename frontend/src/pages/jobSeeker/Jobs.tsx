import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockJobs, mockRecommendations, simulateApiCall } from '../../services/mockData';
import { Job, JobRecommendation, JobType, ExperienceLevel } from '../../types';
import Loading from '../../components/shared/Loading';

const Jobs: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'recommendations'>('all');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | ''>('');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel | ''>('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'recommendations') {
      setActiveTab('recommendations');
    }
    loadJobs();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, locationFilter, jobTypeFilter, experienceFilter, salaryMin, salaryMax]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 800);
      setJobs(mockJobs);
      setRecommendations(mockRecommendations);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load jobs',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = !locationFilter || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesJobType = !jobTypeFilter || job.jobType === jobTypeFilter;
      
      const matchesExperience = !experienceFilter || job.experienceLevel === experienceFilter;
      
      const matchesSalary = (!salaryMin || job.salaryRange.min >= parseInt(salaryMin)) &&
        (!salaryMax || job.salaryRange.max <= parseInt(salaryMax));

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesSalary;
    });

    setFilteredJobs(filtered);
  };

  const handleBookmarkJob = async (jobId: string) => {
    setLoading({ isLoading: true, message: 'Saving job...' });
    
    try {
      await simulateApiCall(null, 500);
      showModal({
        type: 'success',
        title: 'Job Saved',
        message: 'Job has been added to your bookmarks!',
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to save job',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setJobTypeFilter('');
    setExperienceFilter('');
    setSalaryMin('');
    setSalaryMax('');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading jobs..." />
      </div>
    );
  }

  const displayJobs = activeTab === 'recommendations' ? recommendations.map(r => r.job) : filteredJobs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find Your Next Job</h1>
        <p className="text-gray-600">Discover opportunities that match your skills and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Jobs ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recommended ({recommendations.length})
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, company, keywords..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="City, state, or remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value as JobType | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value as ExperienceLevel | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          {displayJobs.length > 0 ? (
            <div className="space-y-6">
              {displayJobs.map((job) => {
                const recommendation = activeTab === 'recommendations' ? 
                  recommendations.find(r => r.job.id === job.id) : null;
                
                return (
                  <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          {job.companyLogo && (
                            <img 
                              src={job.companyLogo} 
                              alt={job.company}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              <Link 
                                to={`/jobs/${job.id}`}
                                className="hover:text-primary-600"
                              >
                                {job.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>📍 {job.location}</span>
                          <span>💼 {job.jobType.replace('-', ' ')}</span>
                          <span>📈 {job.experienceLevel}</span>
                          <span>💰 ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}</span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {job.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* AI Recommendation */}
                        {recommendation && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                            <div className="flex items-center mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {Math.round(recommendation.score * 100)}% Match
                              </span>
                              <span className="ml-2 text-sm text-green-700 font-medium">
                                Recommended for you
                              </span>
                            </div>
                            <p className="text-sm text-green-700">
                              {recommendation.explanation.reasons[0]}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Posted {new Date(job.postedDate).toLocaleDateString()} • {job.applicationCount} applications
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleBookmarkJob(job.id)}
                              className="text-gray-400 hover:text-primary-600"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                            <Link
                              to={`/jobs/${job.id}`}
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs; 