import {
  User,
  Job,
  JobApplication,
  JobRecommendation,
  JobAlert,
  SavedSearch,
  JobBookmark,
  SkillGapAnalysis,
  DashboardMetrics,
  SystemActivity,
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'job_seeker',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    profile: {
      id: 'profile1',
      userId: 'user1',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      education: [
        {
          id: 'edu1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2018-09-01',
          endDate: '2022-05-15',
          gpa: 3.8,
        },
      ],
      experience: [
        {
          id: 'exp1',
          company: 'Tech Startup Inc.',
          position: 'Frontend Developer',
          description: 'Developed responsive web applications using React and TypeScript',
          startDate: '2022-06-01',
          endDate: '2023-12-31',
          location: 'San Francisco, CA',
          skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
        },
      ],
      careerPreferences: {
        desiredPositions: ['Full Stack Developer', 'Software Engineer', 'Frontend Developer'],
        preferredLocations: ['San Francisco', 'New York', 'Remote'],
        salaryRange: { min: 80000, max: 120000 },
        jobTypes: ['full-time'],
        industries: ['Technology', 'Fintech', 'Healthcare'],
        workArrangement: 'remote',
      },
      location: 'San Francisco, CA',
      summary: 'Passionate full-stack developer with 2+ years of experience in modern web technologies.',
      updatedAt: '2024-01-20T15:30:00Z',
    },
  },
  {
    id: 'user2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'job_seeker',
    isActive: true,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'admin1',
    email: 'admin@accessjobs.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T08:00:00Z',
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    description: 'We are looking for a senior full stack developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      '5+ years of experience in web development',
      'Proficiency in JavaScript, React, and Node.js',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Knowledge of cloud platforms (AWS, Azure)',
      'Strong problem-solving skills',
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Flexible work arrangements',
      '401(k) with company matching',
      'Professional development budget',
    ],
    location: 'San Francisco, CA',
    salaryRange: { min: 120000, max: 160000 },
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'Technology',
    postedDate: '2024-01-18T10:00:00Z',
    applicationDeadline: '2024-02-18T23:59:59Z',
    isActive: true,
    companyLogo: 'https://via.placeholder.com/100x100?text=TC',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    applicationCount: 23,
  },
  {
    id: 'job2',
    title: 'Frontend Developer',
    company: 'Digital Innovations',
    description: 'Join our team as a Frontend Developer and help create amazing user experiences for our clients.',
    requirements: [
      '3+ years of React experience',
      'Strong CSS and HTML skills',
      'Experience with TypeScript',
      'Knowledge of testing frameworks',
    ],
    benefits: [
      'Remote work options',
      'Health insurance',
      'Learning and development budget',
      'Flexible hours',
    ],
    location: 'New York, NY',
    salaryRange: { min: 85000, max: 110000 },
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'Technology',
    postedDate: '2024-01-20T14:00:00Z',
    isActive: true,
    companyLogo: 'https://via.placeholder.com/100x100?text=DI',
    skills: ['React', 'TypeScript', 'CSS', 'HTML', 'Jest'],
    applicationCount: 15,
  },
  {
    id: 'job3',
    title: 'Junior Python Developer',
    company: 'DataTech Analytics',
    description: 'Entry-level position for a Python developer interested in data analytics and machine learning.',
    requirements: [
      '1-2 years of Python experience',
      'Basic knowledge of pandas and numpy',
      'Understanding of SQL',
      'Bachelor\'s degree in Computer Science or related field',
    ],
    benefits: [
      'Mentorship program',
      'Health insurance',
      'Career growth opportunities',
      'Free lunch',
    ],
    location: 'Austin, TX',
    salaryRange: { min: 65000, max: 80000 },
    jobType: 'full-time',
    experienceLevel: 'junior',
    industry: 'Data Analytics',
    postedDate: '2024-01-22T09:00:00Z',
    isActive: true,
    companyLogo: 'https://via.placeholder.com/100x100?text=DTA',
    skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Machine Learning'],
    applicationCount: 31,
  },
  {
    id: 'job4',
    title: 'DevOps Engineer',
    company: 'CloudFirst Technologies',
    description: 'Seeking an experienced DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.',
    requirements: [
      '4+ years of DevOps experience',
      'Experience with AWS/Azure/GCP',
      'Knowledge of Kubernetes and Docker',
      'Proficiency in Infrastructure as Code',
    ],
    benefits: [
      'Competitive salary',
      'Stock options',
      'Remote work',
      'Conference budget',
    ],
    location: 'Remote',
    salaryRange: { min: 110000, max: 140000 },
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'Cloud Computing',
    postedDate: '2024-01-19T11:00:00Z',
    isActive: true,
    companyLogo: 'https://via.placeholder.com/100x100?text=CFT',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
    applicationCount: 18,
  },
  {
    id: 'job5',
    title: 'UX/UI Designer',
    company: 'Creative Studio Pro',
    description: 'Looking for a talented UX/UI designer to create beautiful and functional user interfaces.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Understanding of user-centered design principles',
      'Portfolio showcasing diverse projects',
    ],
    benefits: [
      'Creative freedom',
      'Health insurance',
      'Flexible schedule',
      'Design tools budget',
    ],
    location: 'Los Angeles, CA',
    salaryRange: { min: 75000, max: 95000 },
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'Design',
    postedDate: '2024-01-21T13:00:00Z',
    isActive: true,
    companyLogo: 'https://via.placeholder.com/100x100?text=CSP',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping'],
    applicationCount: 27,
  },
];

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

// Mock Skill Gap Analysis
export const mockSkillGapAnalysis: SkillGapAnalysis = {
  userId: 'user1',
  targetRole: 'Senior Full Stack Developer',
  currentSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
  requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
  skillGaps: [
    {
      skill: 'PostgreSQL',
      importance: 'critical',
      estimatedLearningTime: '2-3 weeks',
    },
    {
      skill: 'AWS',
      importance: 'important',
      estimatedLearningTime: '4-6 weeks',
    },
    {
      skill: 'Docker',
      importance: 'important',
      estimatedLearningTime: '1-2 weeks',
    },
    {
      skill: 'Kubernetes',
      importance: 'nice-to-have',
      estimatedLearningTime: '3-4 weeks',
    },
  ],
  learningPaths: [
    {
      skill: 'PostgreSQL',
      resources: [
        {
          title: 'PostgreSQL Complete Course',
          type: 'course',
          provider: 'Udemy',
          url: 'https://udemy.com/postgresql-course',
          duration: '12 hours',
          difficulty: 'beginner',
          cost: 'paid',
        },
        {
          title: 'PostgreSQL Documentation',
          type: 'tutorial',
          provider: 'PostgreSQL.org',
          url: 'https://postgresql.org/docs',
          duration: 'Self-paced',
          difficulty: 'intermediate',
          cost: 'free',
        },
      ],
    },
  ],
  generatedAt: '2024-01-22T14:00:00Z',
};

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

// Helper functions for mock API simulation
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateApiCall = async <T>(data: T, delayMs: number = 500): Promise<T> => {
  await delay(delayMs);
  return data;
};

export const simulateApiError = async (message: string, delayMs: number = 500): Promise<never> => {
  await delay(delayMs);
  throw new Error(message);
}; 