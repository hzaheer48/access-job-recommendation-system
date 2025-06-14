import { JobApplication, JobRecommendation } from '../types';
import { mockJobs } from './mockJobs';

// Mock Job Applications
export const mockApplications: JobApplication[] = [
  {
    id: 'app1',
    jobId: 'job1',
    userId: 'user1',
    status: 'under_review',
    appliedDate: '2024-01-19T15:30:00Z',
    coverLetter: 'I am excited to apply for the Senior Full Stack Developer position...',
    notes: 'Really interested in this role',
    interviewStages: [
      {
        id: 'stage1',
        type: 'phone',
        scheduledDate: '2024-01-25T10:00:00Z',
        completed: false,
        notes: 'Initial screening call',
      },
    ],
    job: mockJobs[0],
  },
  {
    id: 'app2',
    jobId: 'job2',
    userId: 'user1',
    status: 'applied',
    appliedDate: '2024-01-21T09:15:00Z',
    notes: 'Applied after seeing on job board',
    interviewStages: [],
    job: mockJobs[1],
  },
];

// Mock Job Recommendations
export const mockRecommendations: JobRecommendation[] = [
  {
    job: mockJobs[0],
    score: 0.95,
    explanation: {
      skillsMatch: {
        matched: ['JavaScript', 'React', 'Node.js'],
        missing: ['PostgreSQL', 'AWS'],
        percentage: 60,
      },
      experienceMatch: {
        relevantExperience: ['Frontend Development', 'Web Development'],
        yearsMatch: false,
      },
      locationPreference: true,
      salaryMatch: true,
      reasons: [
        'Strong match for JavaScript and React skills',
        'Location matches your preferences',
        'Salary within your desired range',
      ],
    },
  },
  {
    job: mockJobs[1],
    score: 0.88,
    explanation: {
      skillsMatch: {
        matched: ['React', 'TypeScript', 'CSS'],
        missing: ['Jest'],
        percentage: 75,
      },
      experienceMatch: {
        relevantExperience: ['Frontend Development'],
        yearsMatch: true,
      },
      locationPreference: true,
      salaryMatch: true,
      reasons: [
        'Perfect match for React and TypeScript skills',
        'Experience level aligns with requirements',
        'Company culture fits your preferences',
      ],
    },
  },
];

// Mock Interview Applications
export const mockInterviewApplications: any[] = [
  {
    id: 'app1',
    userId: 'user1',
    jobId: 'job1',
    status: 'interview_scheduled',
    appliedDate: '2024-01-15T10:00:00Z',
    notes: 'Progressing well through interview stages',
    interviewStages: [],
    job: {
       id: 'job1',
       title: 'Senior Frontend Developer',
       company: 'TechCorp Inc.',
       description: 'Senior Frontend Developer position',
       requirements: [],
       benefits: [],
       location: 'San Francisco, CA',
       salaryRange: { min: 100000, max: 150000 },
       jobType: 'full-time',
       experienceLevel: 'senior',
       industry: 'Technology',
       postedDate: '2024-01-15T10:00:00Z',
       isActive: true,
       skills: ['React', 'TypeScript'],
       applicationCount: 25
     }
  },
  {
    id: 'app2',
    userId: 'user1',
    jobId: 'job2',
    status: 'interview_scheduled',
    appliedDate: '2024-01-10T14:30:00Z',
    notes: 'Final round scheduled',
    interviewStages: [],
    job: {
       id: 'job2',
       title: 'Full Stack Developer',
       company: 'StartupXYZ',
       description: 'Full Stack Developer position',
       requirements: [],
       benefits: [],
       location: 'Remote',
       salaryRange: { min: 90000, max: 130000 },
       jobType: 'full-time',
       experienceLevel: 'mid',
       industry: 'Technology',
       postedDate: '2024-01-10T14:30:00Z',
       isActive: true,
       skills: ['JavaScript', 'Node.js'],
       applicationCount: 18
     }
  }
];

// Mock Interview Schedules
export const mockInterviewSchedules: any[] = [
  {
    id: 'interview1',
    applicationId: 'app1',
    type: 'technical',
    scheduledDate: '2024-01-25T14:00:00Z',
    duration: 60,
    interviewer: 'John Smith',
    interviewerEmail: 'john.smith@techcorp.com',
    meetingLink: 'https://zoom.us/j/123456789',
    notes: 'Technical interview focusing on React and system design',
    status: 'scheduled'
  },
  {
    id: 'interview2',
    applicationId: 'app2',
    type: 'final',
    scheduledDate: '2024-01-28T10:00:00Z',
    duration: 45,
    interviewer: 'Sarah Johnson',
    interviewerEmail: 'sarah.johnson@startupxyz.com',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Final interview with team lead',
    status: 'scheduled'
  }
];