import React, { useState } from 'react';
import {
  BookmarkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  MapPinIcon,
  CalendarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { mockJobs, mockBookmarks } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Bookmarks: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('most_recent');
  
  // Get user's bookmarked jobs
  const userBookmarks = mockBookmarks
    .filter(bookmark => bookmark.userId === user?.id)
    .map(bookmark => ({
      ...bookmark,
      job: mockJobs.find(job => job.id === bookmark.jobId)!,
    }))
    .filter(bookmark => bookmark.job);

  const filteredBookmarks = userBookmarks.filter(bookmark =>
    searchQuery === '' ||
    bookmark.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return 'Negotiable';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Saved Jobs</h1>
          <p className="text-secondary-600">
            {userBookmarks.length} jobs saved for later review
          </p>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select"
            >
              <option value="most_recent">Recently Saved</option>
              <option value="job_posted">Recently Posted</option>
              <option value="salary_high">Salary: High to Low</option>
              <option value="company_az">Company A-Z</option>
            </select>
          </div>
        </div>

        {/* Bookmarked Jobs */}
        {filteredBookmarks.length > 0 ? (
          <div className="space-y-6">
            {filteredBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-lg shadow-sm border border-secondary-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={bookmark.job.company.logo}
                        alt={bookmark.job.company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 cursor-pointer">
                          {bookmark.job.title}
                        </h3>
                        <p className="text-secondary-600">{bookmark.job.company.name}</p>
                        <div className="flex items-center text-sm text-secondary-500 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {bookmark.job.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-secondary-500">
                        Saved {getTimeAgo(bookmark.savedAt || bookmark.createdDate)}
                      </div>
                      <button className="p-2 text-secondary-400 hover:text-danger-600 transition-colors">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-secondary-700 text-sm leading-relaxed line-clamp-2">
                      {bookmark.job.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.job.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="badge-primary text-xs">
                        {skill}
                      </span>
                    ))}
                    {bookmark.job.skills.length > 4 && (
                      <span className="badge-secondary text-xs">
                        +{bookmark.job.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="capitalize">{bookmark.job.type.replace('-', ' ')}</span>
                      <span className="capitalize">{bookmark.job.experienceLevel}</span>
                      <span>{formatSalary(bookmark.job.salary.min, bookmark.job.salary.max)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Posted {getTimeAgo(bookmark.job.postedDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-secondary-500 space-x-4">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {bookmark.job.views} views
                      </div>
                      <span>{bookmark.job.applicationCount} applicants</span>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <BookmarkIcon className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                {userBookmarks.length === 0 ? 'No saved jobs yet' : 'No jobs match your search'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {userBookmarks.length === 0 
                  ? 'Save interesting jobs while browsing to review them later'
                  : 'Try adjusting your search terms'
                }
              </p>
              {userBookmarks.length === 0 && (
                <Button>
                  Browse Jobs
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks; 