import { User, Job } from '../types';

interface JobAlert {
  id: string;
  userId: string;
  name: string;
  criteria: {
    keywords: string[];
    locations: string[];
    jobTypes: string[];
    industries: string[];
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
    salaryRange?: {
      min: number;
      max: number;
    };
    skills: string[];
    companies?: string[];
    remote?: boolean;
  };
  frequency: 'daily' | 'weekly' | 'monthly' | 'realtime';
  status: 'active' | 'paused' | 'deleted';
  lastSent?: string;
  nextScheduled?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobAlertMatch {
  id: string;
  alertId: string;
  jobId: string;
  matchScore: number;
  matchReasons: string[];
  createdAt: string;
  status: 'new' | 'viewed' | 'applied' | 'dismissed';
}

interface JobAlertStats {
  totalAlerts: number;
  activeAlerts: number;
  totalMatches: number;
  matchesByFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
    realtime: number;
  };
  matchesByStatus: {
    new: number;
    viewed: number;
    applied: number;
    dismissed: number;
  };
  lastUpdated: string;
}

export const createJobAlert = async (
  userId: string,
  alertData: Omit<JobAlert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<JobAlert> => {
  // In a real app, this would be an API call
  return {
    id: 'alert_1',
    userId,
    name: alertData.name,
    criteria: alertData.criteria,
    frequency: alertData.frequency,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateJobAlert = async (
  alertId: string,
  updates: Partial<Omit<JobAlert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<JobAlert> => {
  // In a real app, this would be an API call
  return {
    id: alertId,
    userId: 'user_1',
    name: 'Updated Alert',
    criteria: {
      keywords: ['javascript', 'react'],
      locations: ['New York', 'Remote'],
      jobTypes: ['full-time'],
      industries: ['Technology'],
      experienceLevel: 'mid',
      skills: ['JavaScript', 'React', 'Node.js']
    },
    frequency: 'daily',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const deleteJobAlert = async (alertId: string): Promise<void> => {
  // In a real app, this would be an API call
  console.log('Deleting job alert:', alertId);
};

export const getUserJobAlerts = async (userId: string): Promise<JobAlert[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'alert_1',
      userId,
      name: 'JavaScript Developer Jobs',
      criteria: {
        keywords: ['javascript', 'react'],
        locations: ['New York', 'Remote'],
        jobTypes: ['full-time'],
        industries: ['Technology'],
        experienceLevel: 'mid',
        skills: ['JavaScript', 'React', 'Node.js']
      },
      frequency: 'daily',
      status: 'active',
      lastSent: new Date(Date.now() - 86400000).toISOString(),
      nextScheduled: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const getJobAlertMatches = async (alertId: string): Promise<JobAlertMatch[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'match_1',
      alertId,
      jobId: 'job_1',
      matchScore: 0.85,
      matchReasons: [
        'Skills match: JavaScript, React',
        'Location match: Remote',
        'Experience level match: Mid-level'
      ],
      createdAt: new Date().toISOString(),
      status: 'new'
    }
  ];
};

export const updateJobAlertMatchStatus = async (
  matchId: string,
  status: JobAlertMatch['status']
): Promise<JobAlertMatch> => {
  // In a real app, this would be an API call
  return {
    id: matchId,
    alertId: 'alert_1',
    jobId: 'job_1',
    matchScore: 0.85,
    matchReasons: [
      'Skills match: JavaScript, React',
      'Location match: Remote',
      'Experience level match: Mid-level'
    ],
    createdAt: new Date().toISOString(),
    status
  };
};

export const getJobAlertStats = async (userId: string): Promise<JobAlertStats> => {
  // In a real app, this would be an API call
  return {
    totalAlerts: 5,
    activeAlerts: 3,
    totalMatches: 25,
    matchesByFrequency: {
      daily: 15,
      weekly: 5,
      monthly: 3,
      realtime: 2
    },
    matchesByStatus: {
      new: 10,
      viewed: 8,
      applied: 5,
      dismissed: 2
    },
    lastUpdated: new Date().toISOString()
  };
};

export const pauseJobAlert = async (alertId: string): Promise<JobAlert> => {
  // In a real app, this would be an API call
  return {
    id: alertId,
    userId: 'user_1',
    name: 'JavaScript Developer Jobs',
    criteria: {
      keywords: ['javascript', 'react'],
      locations: ['New York', 'Remote'],
      jobTypes: ['full-time'],
      industries: ['Technology'],
      experienceLevel: 'mid',
      skills: ['JavaScript', 'React', 'Node.js']
    },
    frequency: 'daily',
    status: 'paused',
    lastSent: new Date(Date.now() - 86400000).toISOString(),
    nextScheduled: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const resumeJobAlert = async (alertId: string): Promise<JobAlert> => {
  // In a real app, this would be an API call
  return {
    id: alertId,
    userId: 'user_1',
    name: 'JavaScript Developer Jobs',
    criteria: {
      keywords: ['javascript', 'react'],
      locations: ['New York', 'Remote'],
      jobTypes: ['full-time'],
      industries: ['Technology'],
      experienceLevel: 'mid',
      skills: ['JavaScript', 'React', 'Node.js']
    },
    frequency: 'daily',
    status: 'active',
    lastSent: new Date(Date.now() - 86400000).toISOString(),
    nextScheduled: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}; 