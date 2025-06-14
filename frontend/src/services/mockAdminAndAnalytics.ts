import { DashboardMetrics, SystemActivity } from '../types';

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  totalJobs: 156,
  activeJobs: 134,
  totalApplications: 3421,
  applicationsByStatus: {
    applied: 1240,
    under_review: 456,
    interview_scheduled: 123,
    interviewed: 89,
    offer_extended: 34,
    accepted: 67,
    rejected: 1289,
    withdrawn: 123,
  },
  topSearchQueries: [
    { query: 'React Developer', count: 234, trend: 'up' },
    { query: 'Full Stack', count: 189, trend: 'stable' },
    { query: 'Python', count: 156, trend: 'down' },
    { query: 'DevOps', count: 134, trend: 'up' },
    { query: 'Data Scientist', count: 98, trend: 'up' },
  ],
  popularJobCategories: [
    { category: 'Software Development', count: 45, applicationRate: 23.4 },
    { category: 'Data Science', count: 23, applicationRate: 18.7 },
    { category: 'DevOps', count: 18, applicationRate: 31.2 },
    { category: 'Design', count: 15, applicationRate: 15.8 },
    { category: 'Product Management', count: 12, applicationRate: 28.9 },
  ],
  systemPerformance: {
    responseTime: 245,
    uptime: 99.8,
    errorRate: 0.2,
    recommendationAccuracy: 87.3,
  },
};

// Mock System Activities
export const mockSystemActivities: SystemActivity[] = [
  {
    id: 'activity1',
    type: 'user_registration',
    userId: 'user2',
    description: 'New user registered: jane.smith@example.com',
    timestamp: '2024-01-22T15:30:00Z',
    metadata: { email: 'jane.smith@example.com' },
  },
  {
    id: 'activity2',
    type: 'job_posted',
    description: 'New job posted: Frontend Developer at Digital Innovations',
    timestamp: '2024-01-22T14:20:00Z',
    metadata: { jobId: 'job2', company: 'Digital Innovations' },
  },
  {
    id: 'activity3',
    type: 'application_submitted',
    userId: 'user1',
    description: 'Application submitted for Senior Full Stack Developer',
    timestamp: '2024-01-22T13:15:00Z',
    metadata: { jobId: 'job1', applicationId: 'app1' },
  },
  {
    id: 'activity4',
    type: 'login',
    userId: 'user1',
    description: 'User logged in: john.doe@example.com',
    timestamp: '2024-01-22T12:45:00Z',
    metadata: { ip: '192.168.1.1' },
  },
  {
    id: 'activity5',
    type: 'search',
    userId: 'user1',
    description: 'Job search performed: "React Developer"',
    timestamp: '2024-01-22T12:30:00Z',
    metadata: { query: 'React Developer', results: 12 },
  },
];