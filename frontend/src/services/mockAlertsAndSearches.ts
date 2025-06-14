import { JobAlert, SavedSearch, JobBookmark } from '../types';
import { mockJobs } from './mockJobs';

// Mock Job Alerts
export const mockJobAlerts: JobAlert[] = [
  {
    id: 'alert1',
    userId: 'user1',
    name: 'Full Stack Developer Jobs',
    criteria: {
      keywords: ['full stack', 'developer'],
      location: 'San Francisco',
      salaryRange: { min: 80000, max: 120000 },
      jobTypes: ['full-time'],
      experienceLevel: 'mid',
      workArrangement: 'remote',
    },
    isActive: true,
    frequency: 'daily',
    lastTriggered: '2024-01-22T08:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'alert2',
    userId: 'user1',
    name: 'Remote React Jobs',
    criteria: {
      keywords: ['react', 'frontend'],
      location: 'Remote',
      jobTypes: ['full-time', 'contract'],
      workArrangement: 'remote',
    },
    isActive: true,
    frequency: 'weekly',
    createdAt: '2024-01-18T14:00:00Z',
  },
];

// Mock Saved Searches
export const mockSavedSearches: SavedSearch[] = [
  {
    id: 'search1',
    userId: 'user1',
    name: 'Senior Developer Positions',
    criteria: {
      keywords: ['senior', 'developer'],
      location: 'San Francisco',
      experienceLevel: 'senior',
      jobTypes: ['full-time'],
    },
    createdAt: '2024-01-16T12:00:00Z',
    lastUsed: '2024-01-22T10:30:00Z',
  },
];

// Mock Job Bookmarks
export const mockBookmarks: JobBookmark[] = [
  {
    id: 'bookmark1',
    userId: 'user1',
    jobId: 'job3',
    createdAt: '2024-01-20T16:00:00Z',
    notes: 'Interesting entry-level position for Python',
    job: mockJobs[2],
  },
  {
    id: 'bookmark2',
    userId: 'user1',
    jobId: 'job4',
    createdAt: '2024-01-21T11:00:00Z',
    notes: 'Great DevOps role, might apply later',
    job: mockJobs[3],
  },
];

// Mock Additional Job Alerts
export const mockAdditionalJobAlerts: any[] = [
  {
    id: 'alert3',
    userId: 'user1',
    name: 'JavaScript Developer Jobs',
    criteria: {
      keywords: ['javascript', 'developer'],
      location: 'San Francisco',
      jobTypes: ['full-time'],
      experienceLevel: 'mid',
      salaryRange: { min: 70000, max: 110000 }
    },
    frequency: 'daily',
    isActive: true,
    createdAt: '2024-01-12T09:00:00Z',
    lastTriggered: '2024-01-22T08:00:00Z'
  },
  {
    id: 'alert4',
    userId: 'user1',
    name: 'Remote Backend Jobs',
    criteria: {
      keywords: ['backend', 'node.js', 'python'],
      location: 'remote',
      jobTypes: ['full-time', 'contract'],
      experienceLevel: 'senior',
      salaryRange: { min: 100000, max: 150000 }
    },
    frequency: 'weekly',
    isActive: false,
    createdAt: '2024-01-10T14:30:00Z',
    lastTriggered: '2024-01-18T09:00:00Z'
  }
];

// Mock Additional Saved Searches
export const mockAdditionalSavedSearches: any[] = [
  {
    id: 'search2',
    userId: 'user1',
    name: 'Frontend Developer Remote',
    criteria: {
      keywords: ['frontend', 'react'],
      location: 'remote',
      jobTypes: ['full-time'],
      workArrangement: 'remote'
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastUsed: '2024-01-20T15:30:00Z'
  }
];