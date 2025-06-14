import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockJobs, simulateApiCall } from '../../services/mockData';
import { Job, JobType, ExperienceLevel } from '../../types';
import Loading from '../../components/shared/Loading';

const AdminJobs: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'company' | 'posted' | 'applications'>('posted');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [''],
    benefits: [''],
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    jobType: 'full-time' as JobType,
    experienceLevel: 'mid' as ExperienceLevel,
    industry: '',
    skills: [''],
    applicationDeadline: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, statusFilter, industryFilter, sortBy, sortOrder]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 600);
      setJobs(mockJobs);
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
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && job.isActive) ||
        (statusFilter === 'inactive' && !job.isActive);
      
      const matchesIndustry = industryFilter === 'all' || job.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesIndustry;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'posted':
          comparison = new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
          break;
        case 'applications':
          comparison = a.applicationCount - b.applicationCount;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredJobs(filtered);
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    
    showModal({
      type: 'confirm',
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Job`,
      message: `Are you sure you want to ${action} this job posting?`,
      onConfirm: async () => {
        setLoading({ isLoading: true, message: `${action.charAt(0).toUpperCase() + action.slice(1)}ing job...` });
        
        try {
          await simulateApiCall(null, 800);
          
          setJobs(prev => prev.map(job => 
            job.id === jobId 
              ? { ...job, isActive: !currentStatus }
              : job
          ));
          
          showModal({
            type: 'success',
            title: 'Job Updated',
            message: `Job has been successfully ${action}d.`,
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: `Failed to ${action} job`,
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const handleDeleteJob = async (jobId: string) => {
    showModal({
      type: 'confirm',
      title: 'Delete Job',
      message: 'Are you sure you want to delete this job posting? This action cannot be undone.',
      onConfirm: async () => {
        setLoading({ isLoading: true, message: 'Deleting job...' });
        
        try {
          await simulateApiCall(null, 1000);
          
          setJobs(prev => prev.filter(job => job.id !== jobId));
          
          showModal({
            type: 'success',
            title: 'Job Deleted',
            message: 'Job has been successfully deleted.',
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete job',
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.description) {
      showModal({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading({ isLoading: true, message: 'Creating job...' });
    
    try {
      await simulateApiCall(null, 1000);
      
      const jobToCreate: Job = {
        id: `job_${Date.now()}`,
        title: newJob.title,
        company: newJob.company,
        description: newJob.description,
        requirements: newJob.requirements.filter(req => req.trim() !== ''),
        benefits: newJob.benefits.filter(benefit => benefit.trim() !== ''),
        location: newJob.location,
        salaryRange: { min: newJob.salaryMin, max: newJob.salaryMax },
        jobType: newJob.jobType,
        experienceLevel: newJob.experienceLevel,
        industry: newJob.industry,
        postedDate: new Date().toISOString(),
        applicationDeadline: newJob.applicationDeadline || undefined,
        isActive: true,
        skills: newJob.skills.filter(skill => skill.trim() !== ''),
        applicationCount: 0
      };
      
      setJobs(prev => [jobToCreate, ...prev]);
      setShowCreateModal(false);
      setNewJob({
        title: '',
        company: '',
        description: '',
        requirements: [''],
        benefits: [''],
        location: '',
        salaryMin: 0,
        salaryMax: 0,
        jobType: 'full-time',
        experienceLevel: 'mid',
        industry: '',
        skills: [''],
        applicationDeadline: ''
      });
      
      showModal({
        type: 'success',
        title: 'Job Created',
        message: 'Job posting has been successfully created.',
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to create job',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const addArrayField = (field: 'requirements' | 'benefits' | 'skills') => {
    setNewJob(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'requirements' | 'benefits' | 'skills', index: number, value: string) => {
    setNewJob(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'requirements' | 'benefits' | 'skills', index: number) => {
    setNewJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getUniqueIndustries = () => {
    const industries = jobs.map(job => job.industry);
    return [...new Set(industries)].sort();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading jobs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Job Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage job postings and applications</p>
        <div className="mt-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Create New Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-semibold">💼</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Jobs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{jobs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-md flex items-center justify-center">
                <span className="text-green-600 dark:text-green-300 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {jobs.filter(j => j.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-md flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 font-semibold">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applications</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {jobs.reduce((sum, job) => sum + job.applicationCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-300 font-semibold">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Applications</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + job.applicationCount, 0) / jobs.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Industries</option>
              {getUniqueIndustries().map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'title' | 'company' | 'posted' | 'applications')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="posted">Posted Date</option>
              <option value="title">Job Title</option>
              <option value="company">Company</option>
              <option value="applications">Applications</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Salary Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.jobType} • {job.experienceLevel}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">Posted: {new Date(job.postedDate).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{job.company}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.location}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{job.industry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.applicationCount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      job.isActive 
                        ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleJobStatus(job.id, job.isActive)}
                        className={`px-3 py-1 text-xs rounded-md ${
                          job.isActive
                            ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700'
                            : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700'
                        }`}
                      >
                        {job.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="px-3 py-1 text-xs bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Job</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company *</label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. TechCorp Solutions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                  <input
                    type="text"
                    value={newJob.industry}
                    onChange={(e) => setNewJob(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. Technology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                  <select
                    value={newJob.jobType}
                    onChange={(e) => setNewJob(prev => ({ ...prev, jobType: e.target.value as JobType }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
                  <select
                    value={newJob.experienceLevel}
                    onChange={(e) => setNewJob(prev => ({ ...prev, experienceLevel: e.target.value as ExperienceLevel }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="entry">Entry</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Salary</label>
                  <input
                    type="number"
                    value={newJob.salaryMin}
                    onChange={(e) => setNewJob(prev => ({ ...prev, salaryMin: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. 80000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Salary</label>
                  <input
                    type="number"
                    value={newJob.salaryMax}
                    onChange={(e) => setNewJob(prev => ({ ...prev, salaryMax: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. 120000"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description *</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the job role, responsibilities, and what you're looking for..."
                />
              </div>

              {/* Requirements */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements</label>
                {newJob.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g. 5+ years of experience in web development"
                    />
                    <button
                      onClick={() => removeArrayField('requirements', index)}
                      className="px-2 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('requirements')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  + Add Requirement
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benefits</label>
                {newJob.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateArrayField('benefits', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g. Health insurance"
                    />
                    <button
                      onClick={() => removeArrayField('benefits', index)}
                      className="px-2 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('benefits')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  + Add Benefit
                </button>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills</label>
                {newJob.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateArrayField('skills', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g. JavaScript"
                    />
                    <button
                      onClick={() => removeArrayField('skills', index)}
                      className="px-2 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('skills')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  + Add Skill
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Deadline (Optional)</label>
                <input
                  type="date"
                  value={newJob.applicationDeadline}
                  onChange={(e) => setNewJob(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJob}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;