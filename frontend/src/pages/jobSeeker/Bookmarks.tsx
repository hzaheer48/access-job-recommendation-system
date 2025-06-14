import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockBookmarks, simulateApiCall } from '../../services/mockData';
import { JobBookmark } from '../../types';
import Loading from '../../components/shared/Loading';

const Bookmarks: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  
  const [bookmarks, setBookmarks] = useState<JobBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'title'>('date');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 500);
      const userBookmarks = mockBookmarks.filter(bookmark => bookmark.userId === user?.id);
      setBookmarks(userBookmarks);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load bookmarks',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    showModal({
      type: 'confirm',
      title: 'Remove Bookmark',
      message: 'Are you sure you want to remove this job from your bookmarks?',
      onConfirm: async () => {
        setLoading({ isLoading: true, message: 'Removing bookmark...' });
        
        try {
          await simulateApiCall(null, 500);
          setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
          
          showModal({
            type: 'success',
            title: 'Bookmark Removed',
            message: 'Job has been removed from your bookmarks.',
          });
        } catch (error) {
          showModal({
            type: 'error',
            title: 'Error',
            message: 'Failed to remove bookmark',
          });
        } finally {
          setLoading({ isLoading: false });
        }
      }
    });
  };

  const filteredAndSortedBookmarks = bookmarks
    .filter(bookmark => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        bookmark.job.title.toLowerCase().includes(query) ||
        bookmark.job.company.toLowerCase().includes(query) ||
        bookmark.job.location.toLowerCase().includes(query) ||
        bookmark.job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'company':
          return a.job.company.localeCompare(b.job.company);
        case 'title':
          return a.job.title.localeCompare(b.job.title);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading bookmarks..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your bookmarked job opportunities</p>
      </div>

      {bookmarks.length > 0 ? (
        <>
          {/* Search and Sort Controls */}
          <div className="card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/20 dark:bg-gray-800/50 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-lg">
                <label htmlFor="search" className="sr-only">Search bookmarks</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by job title, company, location, or skills..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'company' | 'title')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="date">Date Saved</option>
                  <option value="company">Company</option>
                  <option value="title">Job Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAndSortedBookmarks.length} of {bookmarks.length} saved jobs
              {searchQuery && (
                <span> matching "{searchQuery}"</span>
              )}
            </p>
          </div>

          {/* Bookmarks Grid */}
          {filteredAndSortedBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="group card-glass backdrop-blur-sm border border-white/20 dark:border-gray-700/20 dark:bg-gray-800/50 hover:shadow-large transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {bookmark.job.companyLogo && (
                          <img 
                            src={bookmark.job.companyLogo} 
                            alt={bookmark.job.company}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            <Link 
                              to={`/jobs/${bookmark.jobId}`}
                              className="hover:text-primary-600 truncate block"
                            >
                              {bookmark.job.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">{bookmark.job.company}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span>📍 {bookmark.job.location}</span>
                            <span>💼 {bookmark.job.jobType.replace('-', ' ')}</span>
                            <span>💰 ${bookmark.job.salaryRange.min.toLocaleString()} - ${bookmark.job.salaryRange.max.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-4"
                        title="Remove bookmark"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {bookmark.job.description}
                    </p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {bookmark.job.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {bookmark.job.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs">
                            +{bookmark.job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span>Saved {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>Posted {new Date(bookmark.job.postedDate).toLocaleDateString()}</span>
                      </div>
                      <Link
                        to={`/jobs/${bookmark.jobId}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No saved jobs match your search criteria.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/jobs"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <svg className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse More Jobs
              </Link>
              <Link
                to="/jobs?tab=recommendations"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <svg className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                View Recommendations
              </Link>
              <Link
                to="/applications"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <svg className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Applications
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved jobs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start bookmarking jobs you're interested in to keep track of them here.
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Jobs
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;