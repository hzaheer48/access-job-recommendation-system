import { JobApplication, Job, UserProfile } from '../types';

interface ApplicationMetrics {
  totalApplications: number;
  byStatus: {
    applied: number;
    reviewed: number;
    interview: number;
    offered: number;
    rejected: number;
  };
  byJobType: Record<string, number>;
  byIndustry: Record<string, number>;
  byLocation: Record<string, number>;
  successRate: number;
  averageResponseTime: number;
  interviewSuccessRate: number;
  offerRate: number;
}

interface JobMarketTrends {
  topSkills: {
    skill: string;
    demand: number;
    growth: number;
    averageSalary: number;
  }[];
  industryTrends: {
    industry: string;
    growth: number;
    jobCount: number;
    averageSalary: number;
  }[];
  locationTrends: {
    location: string;
    jobCount: number;
    averageSalary: number;
    growth: number;
  }[];
  salaryTrends: {
    position: string;
    averageSalary: number;
    minSalary: number;
    maxSalary: number;
    growth: number;
  }[];
}

interface UserAnalytics {
  profileCompletion: number;
  skillMatch: {
    skill: string;
    matchCount: number;
    averageSalary: number;
  }[];
  applicationHistory: {
    date: string;
    count: number;
    status: string;
  }[];
  interviewPerformance: {
    type: string;
    averageScore: number;
    totalInterviews: number;
  }[];
  jobPreferences: {
    type: string;
    count: number;
    successRate: number;
  }[];
}

export const getApplicationMetrics = async (userId: string): Promise<ApplicationMetrics> => {
  // In a real app, this would be an API call
  return {
    totalApplications: 25,
    byStatus: {
      applied: 10,
      reviewed: 8,
      interview: 5,
      offered: 2,
      rejected: 0
    },
    byJobType: {
      'Full-time': 15,
      'Contract': 5,
      'Remote': 5
    },
    byIndustry: {
      'Technology': 15,
      'Finance': 5,
      'Healthcare': 5
    },
    byLocation: {
      'New York': 10,
      'San Francisco': 8,
      'Remote': 7
    },
    successRate: 0.4,
    averageResponseTime: 3.5,
    interviewSuccessRate: 0.6,
    offerRate: 0.2
  };
};

export const getJobMarketTrends = async (): Promise<JobMarketTrends> => {
  // In a real app, this would be an API call
  return {
    topSkills: [
      {
        skill: 'React',
        demand: 85,
        growth: 15,
        averageSalary: 120000
      },
      {
        skill: 'Python',
        demand: 80,
        growth: 12,
        averageSalary: 115000
      }
    ],
    industryTrends: [
      {
        industry: 'Technology',
        growth: 10,
        jobCount: 1000,
        averageSalary: 110000
      },
      {
        industry: 'Finance',
        growth: 5,
        jobCount: 500,
        averageSalary: 105000
      }
    ],
    locationTrends: [
      {
        location: 'New York',
        jobCount: 800,
        averageSalary: 120000,
        growth: 8
      },
      {
        location: 'San Francisco',
        jobCount: 700,
        averageSalary: 130000,
        growth: 10
      }
    ],
    salaryTrends: [
      {
        position: 'Software Engineer',
        averageSalary: 110000,
        minSalary: 80000,
        maxSalary: 150000,
        growth: 5
      },
      {
        position: 'Data Scientist',
        averageSalary: 120000,
        minSalary: 90000,
        maxSalary: 160000,
        growth: 8
      }
    ]
  };
};

export const getUserAnalytics = async (userId: string): Promise<UserAnalytics> => {
  // In a real app, this would be an API call
  return {
    profileCompletion: 85,
    skillMatch: [
      {
        skill: 'React',
        matchCount: 15,
        averageSalary: 120000
      },
      {
        skill: 'Python',
        matchCount: 12,
        averageSalary: 115000
      }
    ],
    applicationHistory: [
      {
        date: '2024-01',
        count: 5,
        status: 'applied'
      },
      {
        date: '2024-02',
        count: 8,
        status: 'interview'
      }
    ],
    interviewPerformance: [
      {
        type: 'Technical',
        averageScore: 8.5,
        totalInterviews: 5
      },
      {
        type: 'Behavioral',
        averageScore: 9.0,
        totalInterviews: 3
      }
    ],
    jobPreferences: [
      {
        type: 'Full-time',
        count: 15,
        successRate: 0.4
      },
      {
        type: 'Remote',
        count: 10,
        successRate: 0.3
      }
    ]
  };
};

export const getApplicationSuccessPredictions = async (
  userProfile: UserProfile,
  job: Job
): Promise<{
  successProbability: number;
  keyFactors: string[];
  recommendations: string[];
}> => {
  // In a real app, this would use ML models
  return {
    successProbability: 0.75,
    keyFactors: [
      'Strong match with required skills',
      'Relevant industry experience',
      'Good interview performance history'
    ],
    recommendations: [
      'Highlight specific project experience',
      'Prepare for system design questions',
      'Research company culture'
    ]
  };
};

export const getSkillDevelopmentInsights = async (
  userProfile: UserProfile,
  targetJobs: Job[]
): Promise<{
  recommendedSkills: {
    skill: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    learningResources: string[];
  }[];
  skillGaps: {
    skill: string;
    currentLevel: number;
    targetLevel: number;
    improvementPlan: string[];
  }[];
}> => {
  // In a real app, this would analyze job market data
  return {
    recommendedSkills: [
      {
        skill: 'Kubernetes',
        priority: 'high',
        reason: 'High demand in target jobs',
        learningResources: [
          'Kubernetes Documentation',
          'Online Course: Kubernetes for Beginners'
        ]
      }
    ],
    skillGaps: [
      {
        skill: 'System Design',
        currentLevel: 2,
        targetLevel: 4,
        improvementPlan: [
          'Practice system design questions',
          'Study architecture patterns',
          'Build scalable projects'
        ]
      }
    ]
  };
}; 