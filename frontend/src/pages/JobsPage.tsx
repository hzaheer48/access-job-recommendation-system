import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BookmarkIcon,
  EyeIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { mockJobs, searchJobs } from '../data/mockData';
import { Job, SearchCriteria } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const JobsPage: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    query: '',
    location: '',
    salaryMin: undefined,
    jobTypes: [],
    experienceLevel: undefined,
  });
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [selectedFilters, setSelectedFilters] = useState({
    jobTypes: [] as string[],
    experienceLevel: '',
    salaryRange: '',
    industries: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('most_recent');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const handleSearch = () => {
    const results = searchJobs(searchCriteria);
    setFilteredJobs(results);
  };

  const handleInputChange = (field: keyof SearchCriteria, value: any) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
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

  const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Negotiable';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design'];

  const JobCard: React.FC<{ job: Job; isBookmarked: boolean }> = ({ job, isBookmarked }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-secondary-200">
      <div className="p-6">
        {/* Job Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <img
              src={job.company.logo || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=48&h=48&fit=crop&crop=center'}
              alt={job.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                {job.title}
              </h3>
              <p className="text-secondary-600">{job.company.name}</p>
              <div className="flex items-center text-sm text-secondary-500 mt-1">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {job.location}
              </div>
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(job.id)}
            className="p-2 text-secondary-400 hover:text-primary-600 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="h-5 w-5 text-primary-600" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <p className="text-secondary-700 text-sm leading-relaxed line-clamp-3">
            {job.description}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="badge-primary text-xs">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="badge-secondary text-xs">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Job Meta */}
        <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
          <div className="flex items-center space-x-4">
            <span className="capitalize">{job.type.replace('-', ' ')}</span>
            <span className="capitalize">{job.experienceLevel}</span>
            <span>{formatSalary(job.salary.min, job.salary.max)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{getTimeAgo(job.postedDate)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-secondary-500 space-x-4">
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {job.views} views
            </div>
            <span>{job.applicationCount} applicants</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-secondary-600">Discover {mockJobs.length}+ jobs that match your skills and preferences</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchCriteria.query || ''}
                onChange={(e) => handleInputChange('query', e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <Input
              placeholder="Location"
              value={searchCriteria.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              leftIcon={<MapPinIcon className="h-5 w-5" />}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSearch} className="flex-1">
                Search Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="px-3"
              >
                <FunnelIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Job Types */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Job Type
                  </label>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                          checked={selectedFilters.jobTypes.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...selectedFilters.jobTypes, type]
                              : selectedFilters.jobTypes.filter(t => t !== type);
                            setSelectedFilters(prev => ({ ...prev, jobTypes: newTypes }));
                            handleInputChange('jobTypes', newTypes);
                          }}
                        />
                        <span className="ml-2 text-sm text-secondary-700 capitalize">
                          {type.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Experience Level
                  </label>
                  <select
                    className="select"
                    value={selectedFilters.experienceLevel}
                    onChange={(e) => {
                      setSelectedFilters(prev => ({ ...prev, experienceLevel: e.target.value }));
                      handleInputChange('experienceLevel', e.target.value || undefined);
                    }}
                  >
                    <option value="">Any Level</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level} className="capitalize">
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Minimum Salary
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 75000"
                    value={searchCriteria.salaryMin || ''}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    leftIcon={<CurrencyDollarIcon className="h-5 w-5" />}
                  />
                </div>

                {/* Industries */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Industry
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {industries.map(industry => (
                      <label key={industry} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                          checked={selectedFilters.industries.includes(industry)}
                          onChange={(e) => {
                            const newIndustries = e.target.checked
                              ? [...selectedFilters.industries, industry]
                              : selectedFilters.industries.filter(i => i !== industry);
                            setSelectedFilters(prev => ({ ...prev, industries: newIndustries }));
                          }}
                        />
                        <span className="ml-2 text-sm text-secondary-700">
                          {industry}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedFilters({
                      jobTypes: [],
                      experienceLevel: '',
                      salaryRange: '',
                      industries: [],
                    });
                    setSearchCriteria({
                      query: '',
                      location: '',
                      salaryMin: undefined,
                      jobTypes: [],
                      experienceLevel: undefined,
                    });
                    setFilteredJobs(mockJobs);
                  }}
                  className="text-sm text-secondary-600 hover:text-secondary-900"
                >
                  Clear all filters
                </button>
                <Button onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-secondary-600">
              Showing <span className="font-medium">{filteredJobs.length}</span> jobs
            </p>
            {(selectedFilters.jobTypes.length > 0 || selectedFilters.experienceLevel || searchCriteria.query || searchCriteria.location) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-500">Filters:</span>
                {selectedFilters.jobTypes.map(type => (
                  <span key={type} className="badge-secondary text-xs">
                    {type.replace('-', ' ')}
                  </span>
                ))}
                {selectedFilters.experienceLevel && (
                  <span className="badge-secondary text-xs capitalize">
                    {selectedFilters.experienceLevel}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              className="select w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="most_recent">Most Recent</option>
              <option value="salary_high">Salary: High to Low</option>
              <option value="salary_low">Salary: Low to High</option>
              <option value="most_relevant">Most Relevant</option>
              <option value="company_az">Company A-Z</option>
            </select>
            
            <div className="flex rounded-lg border border-secondary-300">
              <button
                onClick={() => setViewType('grid')}
                className={`px-3 py-2 text-sm ${viewType === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-secondary-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`px-3 py-2 text-sm border-l border-secondary-300 ${viewType === 'list' ? 'bg-primary-50 text-primary-600' : 'text-secondary-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isBookmarked={bookmarkedJobs.has(job.id)}
            />
          ))}
        </div>

        {/* Load More Button */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <MagnifyingGlassIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No jobs found
              </h3>
              <p className="text-secondary-600 mb-6">
                Try adjusting your search criteria or browse all available positions.
              </p>
              <Button onClick={() => {
                setSearchCriteria({});
                setSelectedFilters({
                  jobTypes: [],
                  experienceLevel: '',
                  salaryRange: '',
                  industries: [],
                });
                setFilteredJobs(mockJobs);
              }}>
                View All Jobs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage; 