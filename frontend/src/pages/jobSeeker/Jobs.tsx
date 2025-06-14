import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockJobs, mockRecommendations, simulateApiCall, mockAdditionalSavedSearches } from '../../services/mockData';
import { Job, JobRecommendation, JobType, ExperienceLevel, SavedSearch, SearchCriteria } from '../../types';
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
  const [industryFilter, setIndustryFilter] = useState('');
  const [workArrangementFilter, setWorkArrangementFilter] = useState<'remote' | 'hybrid' | 'onsite' | '' | 'any'>('');
  const [companyFilter, setCompanyFilter] = useState('');
  
  // Advanced features
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary' | 'company'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [paginatedJobs, setPaginatedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'recommendations') {
      setActiveTab('recommendations');
    }
    loadJobs();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, locationFilter, jobTypeFilter, experienceFilter, salaryMin, salaryMax, industryFilter, workArrangementFilter, companyFilter, sortBy, sortOrder]);

  useEffect(() => {
    applyPagination();
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    loadSavedSearches();
  }, []);

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
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = !locationFilter || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesJobType = !jobTypeFilter || job.jobType === jobTypeFilter;
      
      const matchesExperience = !experienceFilter || job.experienceLevel === experienceFilter;
      
      const matchesSalary = (!salaryMin || job.salaryRange.min >= parseInt(salaryMin)) &&
        (!salaryMax || job.salaryRange.max <= parseInt(salaryMax));

      const matchesIndustry = !industryFilter || 
        job.industry.toLowerCase().includes(industryFilter.toLowerCase());

      const matchesWorkArrangement = !workArrangementFilter || 
        (workArrangementFilter === 'remote' && job.location.toLowerCase().includes('remote')) ||
        (workArrangementFilter === 'hybrid' && job.location.toLowerCase().includes('hybrid')) ||
        (workArrangementFilter === 'onsite' && !job.location.toLowerCase().includes('remote') && !job.location.toLowerCase().includes('hybrid'));

      const matchesCompany = !companyFilter || 
        job.company.toLowerCase().includes(companyFilter.toLowerCase());

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && 
             matchesSalary && matchesIndustry && matchesWorkArrangement && matchesCompany;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
          break;
        case 'salary':
          comparison = a.salaryRange.max - b.salaryRange.max;
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'relevance':
        default:
          // For relevance, we could implement a scoring system
          comparison = a.applicationCount - b.applicationCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const applyPagination = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedJobs(filteredJobs.slice(startIndex, endIndex));
  };

  const loadSavedSearches = async () => {
    try {
      await simulateApiCall(null, 300);
      // Use centralized mock saved searches
      const mockSavedSearches = mockAdditionalSavedSearches.map(search => ({
        ...search,
        userId: user?.id || ''
      }));
      setSavedSearches(mockSavedSearches);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
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
    setIndustryFilter('');
    setWorkArrangementFilter('');
    setCompanyFilter('');
  };

  const saveCurrentSearch = async () => {
    if (!searchName.trim()) return;
    
    setLoading({ isLoading: true, message: 'Saving search...' });
    
    try {
      await simulateApiCall(null, 500);
      
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        userId: user?.id || '',
        name: searchName,
        criteria: {
          keywords: searchQuery ? [searchQuery] : [],
          location: locationFilter,
          jobTypes: jobTypeFilter ? [jobTypeFilter] : [],
          experienceLevel: experienceFilter || undefined,
          industry: industryFilter || undefined,
          workArrangement: workArrangementFilter || undefined,
          salaryRange: (salaryMin || salaryMax) ? {
            min: parseInt(salaryMin) || 0,
            max: parseInt(salaryMax) || 999999
          } : undefined
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };
      
      setSavedSearches(prev => [...prev, newSearch]);
      setShowSaveSearch(false);
      setSearchName('');
      
      showModal({
        type: 'success',
        title: 'Search Saved',
        message: 'Your search criteria has been saved successfully.'
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to save search'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const loadSavedSearch = (search: SavedSearch) => {
    const { criteria } = search;
    setSearchQuery(criteria.keywords?.join(' ') || '');
    setLocationFilter(criteria.location || '');
    setJobTypeFilter(criteria.jobTypes?.[0] || '');
    setExperienceFilter(criteria.experienceLevel || '');
    setIndustryFilter(criteria.industry || '');
    setWorkArrangementFilter((criteria.workArrangement as 'remote' | 'hybrid' | 'onsite' | '' | 'any') || '');
    if (criteria.salaryRange) {
      setSalaryMin(criteria.salaryRange.min.toString());
      setSalaryMax(criteria.salaryRange.max.toString());
    }
  };

  const deleteSavedSearch = async (searchId: string) => {
    showModal({
      type: 'confirm',
      title: 'Delete Saved Search',
      message: 'Are you sure you want to delete this saved search?',
      onConfirm: async () => {
        setLoading({ isLoading: true, message: 'Deleting search...' });
        try {
          await simulateApiCall(null, 300);
          setSavedSearches(prev => prev.filter(s => s.id !== searchId));
          showModal({
            type: 'success',
            title: 'Search Deleted',
            message: 'Saved search has been deleted.'
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete search'
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 dark:from-white dark:to-primary-300 bg-clip-text text-transparent">
                  Find Your Next Job 🚀
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Discover opportunities that match your skills and preferences</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V4m8 0h2a2 2 0 012 2v6.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            All Jobs ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Recommended ({recommendations.length})
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveSearch(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Saved Searches</h4>
                <div className="space-y-2">
                  {savedSearches.map((search) => (
                    <div key={search.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2">
                      <button
                        onClick={() => loadSavedSearch(search)}
                        className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1 text-left"
                      >
                        {search.name}
                      </button>
                      <button
                        onClick={() => deleteSavedSearch(search.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, company, keywords..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  placeholder="Technology, Finance..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Work Arrangement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Arrangement
                </label>
                <select
                  value={workArrangementFilter}
                  onChange={(e) => setWorkArrangementFilter(e.target.value as 'remote' | 'hybrid' | 'onsite' | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Arrangements</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  placeholder="Company name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          {/* Sort and Results Info */}
          <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort by
                    </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'salary' | 'company')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date Posted</option>
                    <option value="salary">Salary</option>
                    <option value="company">Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Order
                    </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredJobs.length} jobs found
                </div>
            </div>
          </div>

          {paginatedJobs.length > 0 ? (
            <div className="space-y-6">
              {paginatedJobs.map((job) => {
                const recommendation = activeTab === 'recommendations' ? 
                  recommendations.find(r => r.job.id === job.id) : null;
                
                return (
                  <div key={job.id} className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          {job.companyLogo ? (
                            <img 
                              src={job.companyLogo} 
                              alt={job.company}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {job.company.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-200">
                              <Link 
                                to={`/jobs/${job.id}`}
                                className="hover:text-primary-600"
                              >
                                {job.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V4m8 0h2a2 2 0 012 2v6.5" />
                            </svg>
                            {job.jobType.replace('-', ' ')}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            {job.experienceLevel}
                          </div>
                          <div className="flex items-center font-semibold text-green-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                          {job.description}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="badge-primary text-xs px-3 py-1 hover:scale-105 transition-transform duration-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* AI Recommendation */}
                        {recommendation && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-4">
                            <div className="flex items-center mb-2">
                              <span className="badge-success text-xs px-3 py-1 animate-pulse">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {Math.round(recommendation.score * 100)}% Match
                              </span>
                              <span className="ml-2 text-sm text-green-700 dark:text-green-400 font-semibold">
                                AI Recommended for you
                              </span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                              {recommendation.explanation.reasons[0]}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Posted {new Date(job.postedDate).toLocaleDateString()} • {job.applicationCount} applications
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleBookmarkJob(job.id)}
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                            <Link
                              to={`/jobs/${job.id}`}
                              className="btn-primary px-6 py-2 rounded-xl hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Showing <span className="font-semibold text-primary-600">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                          <span className="font-semibold text-primary-600">
                            {Math.min(currentPage * itemsPerPage, filteredJobs.length)}
                          </span>{' '}
                          of <span className="font-semibold text-primary-600">{filteredJobs.length}</span> results
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span className="ml-1">Previous</span>
                        </button>
                        
                        <div className="flex items-center space-x-1 mx-4">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 5) {
                              page = i + 1;
                            } else if (currentPage <= 3) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              page = totalPages - 4 + i;
                            } else {
                              page = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                  page === currentPage
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <span className="mr-1">Next</span>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Jump */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Quick jump to page:</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                              const page = parseInt(e.target.value);
                              if (page >= 1 && page <= totalPages) {
                                handlePageChange(page);
                              }
                            }}
                            className="w-16 px-3 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">of {totalPages}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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

      {/* Save Search Modal */}
      {showSaveSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Save Current Search</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter a name for this search..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveSearch(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentSearch}
                disabled={!searchName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Jobs;