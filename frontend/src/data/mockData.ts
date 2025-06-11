import {
  User,
  Job,
  JobApplication,
  JobRecommendation,
  JobAlert,
  Bookmark,
  SavedSearch,
  DashboardStats,
  SkillGap,
  Company,
} from '../types';

// Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop&crop=center',
    description: 'Leading technology company specializing in cloud solutions',
    website: 'https://techcorp.com',
    industry: 'Technology',
    size: 'large',
    location: 'San Francisco, CA',
    founded: '2010',
  },
  {
    id: '2',
    name: 'DataFlow Analytics',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop&crop=center',
    description: 'Data analytics and business intelligence solutions',
    website: 'https://dataflow.com',
    industry: 'Analytics',
    size: 'medium',
    location: 'New York, NY',
    founded: '2015',
  },
  {
    id: '3',
    name: 'InnovateLab',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop&crop=center',
    description: 'Innovation lab for emerging technologies',
    website: 'https://innovatelab.com',
    industry: 'Research & Development',
    size: 'startup',
    location: 'Austin, TX',
    founded: '2020',
  },
  {
    id: '4',
    name: 'GlobalTech Solutions',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center',
    description: 'Enterprise software solutions for global businesses',
    website: 'https://globaltech.com',
    industry: 'Enterprise Software',
    size: 'enterprise',
    location: 'Seattle, WA',
    founded: '2005',
  },
  {
    id: '5',
    name: 'CreativeDesigns',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center',
    description: 'Digital design and user experience agency',
    website: 'https://creativedesigns.com',
    industry: 'Design',
    size: 'small',
    location: 'Los Angeles, CA',
    founded: '2018',
  },
];

// Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'job_seeker',
    createdAt: '2023-01-15T10:00:00Z',
    isActive: true,
    profile: {
      id: '1',
      userId: '1',
      skills: [
        { id: '1', name: 'React', level: 'advanced', category: 'Frontend' },
        { id: '2', name: 'TypeScript', level: 'intermediate', category: 'Programming' },
        { id: '3', name: 'Node.js', level: 'intermediate', category: 'Backend' },
        { id: '4', name: 'Python', level: 'beginner', category: 'Programming' },
      ],
      education: [
        {
          id: '1',
          institution: 'Stanford University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2019-09-01',
          endDate: '2023-06-15',
          isOngoing: false,
          gpa: 3.8,
          description: 'Specialized in software engineering and machine learning',
        },
      ],
      experience: [
        {
          id: '1',
          company: 'TechStart Inc.',
          position: 'Frontend Developer Intern',
          location: 'San Francisco, CA',
          startDate: '2022-06-01',
          endDate: '2022-08-31',
          isOngoing: false,
          description: 'Developed responsive web applications using React and TypeScript',
          achievements: [
            'Improved page load time by 40%',
            'Built reusable component library',
            'Mentored 2 junior developers',
          ],
        },
      ],
      preferences: {
        desiredRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
        salaryRange: { min: 80000, max: 120000 },
        locations: ['San Francisco, CA', 'Remote', 'New York, NY'],
        remoteOk: true,
        jobTypes: ['full-time', 'contract'],
        industries: ['Technology', 'Fintech', 'Healthcare'],
      },
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      bio: 'Passionate frontend developer with a love for creating beautiful, user-friendly interfaces.',
      portfolio: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
  },
  {
    id: '2',
    email: 'sarah.smith@email.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'job_seeker',
    createdAt: '2023-02-20T14:30:00Z',
    isActive: true,
    profile: {
      id: '2',
      userId: '2',
      skills: [
        { id: '5', name: 'Python', level: 'expert', category: 'Programming' },
        { id: '6', name: 'Machine Learning', level: 'advanced', category: 'AI/ML' },
        { id: '7', name: 'TensorFlow', level: 'advanced', category: 'AI/ML' },
        { id: '8', name: 'SQL', level: 'intermediate', category: 'Database' },
      ],
      education: [
        {
          id: '2',
          institution: 'MIT',
          degree: 'Master of Science',
          fieldOfStudy: 'Artificial Intelligence',
          startDate: '2021-09-01',
          endDate: '2023-06-15',
          isOngoing: false,
          gpa: 3.9,
          description: 'Focused on deep learning and natural language processing',
        },
      ],
      experience: [
        {
          id: '2',
          company: 'DataCorp',
          position: 'ML Engineer',
          location: 'Boston, MA',
          startDate: '2023-07-01',
          isOngoing: true,
          description: 'Building and deploying machine learning models for production',
          achievements: [
            'Increased model accuracy by 25%',
            'Reduced inference time by 50%',
            'Led team of 3 ML engineers',
          ],
        },
      ],
      preferences: {
        desiredRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Researcher'],
        salaryRange: { min: 130000, max: 180000 },
        locations: ['Boston, MA', 'San Francisco, CA', 'Remote'],
        remoteOk: true,
        jobTypes: ['full-time'],
        industries: ['Technology', 'Healthcare', 'Finance'],
      },
      phone: '+1-555-0456',
      location: 'Boston, MA',
      bio: 'ML Engineer passionate about developing AI solutions that make a positive impact.',
      portfolio: 'https://sarahsmith.ai',
      linkedin: 'https://linkedin.com/in/sarahsmith',
      github: 'https://github.com/sarahsmith',
    },
  },
  {
    id: 'admin1',
    email: 'admin@accessjobs.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    isActive: true,
  },
];

// Jobs
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: mockCompanies[0],
    description: 'We are looking for a Senior Frontend Developer to join our team and help build the next generation of web applications. You will work with cutting-edge technologies and collaborate with a talented team of engineers.',
    requirements: [
      '5+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with modern build tools',
      'Knowledge of responsive design',
      'Experience with testing frameworks',
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with design and backend teams',
      'Write clean, maintainable code',
      'Mentor junior developers',
      'Participate in code reviews',
    ],
    location: 'San Francisco, CA',
    salary: { min: 140000, max: 180000, currency: 'USD' },
    type: 'full-time',
    status: 'active',
    industry: 'Technology',
    experienceLevel: 'senior',
    benefits: ['Health Insurance', 'Dental', 'Vision', '401k', 'Remote Work', 'Unlimited PTO'],
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git'],
    postedDate: '2023-12-01T10:00:00Z',
    applicationDeadline: '2024-01-15T23:59:59Z',
    isActive: true,
    applicationCount: 45,
    views: 230,
  },
  {
    id: '2',
    title: 'Machine Learning Engineer',
    company: mockCompanies[1],
    description: 'Join our data science team to build and deploy machine learning models that drive business decisions. Work with large datasets and cutting-edge ML technologies.',
    requirements: [
      'PhD or Masters in Computer Science, Statistics, or related field',
      '3+ years of ML experience',
      'Strong Python programming skills',
      'Experience with TensorFlow or PyTorch',
      'Knowledge of cloud platforms (AWS, GCP, Azure)',
    ],
    responsibilities: [
      'Design and implement ML models',
      'Analyze large datasets',
      'Deploy models to production',
      'Collaborate with product teams',
      'Research new ML techniques',
    ],
    location: 'New York, NY',
    salary: { min: 150000, max: 200000, currency: 'USD' },
    type: 'full-time',
    status: 'active',
    industry: 'Analytics',
    experienceLevel: 'mid',
    benefits: ['Health Insurance', 'Stock Options', 'Learning Budget', 'Flexible Hours'],
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
    postedDate: '2023-11-28T14:20:00Z',
    applicationDeadline: '2024-01-10T23:59:59Z',
    isActive: true,
    applicationCount: 67,
    views: 156,
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: mockCompanies[2],
    description: 'We need a versatile Full Stack Developer to work on innovative projects from front-end to back-end. Perfect opportunity for someone who loves working with the latest technologies.',
    requirements: [
      '3+ years full stack development experience',
      'Proficiency in React and Node.js',
      'Database design experience',
      'RESTful API development',
      'Version control with Git',
    ],
    responsibilities: [
      'Develop full stack web applications',
      'Design and implement APIs',
      'Database schema design',
      'Code review and testing',
      'Technical documentation',
    ],
    location: 'Austin, TX',
    salary: { min: 95000, max: 130000, currency: 'USD' },
    type: 'full-time',
    status: 'active',
    industry: 'Research & Development',
    experienceLevel: 'mid',
    benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Professional Development'],
    skills: ['React', 'Node.js', 'JavaScript', 'PostgreSQL', 'MongoDB'],
    postedDate: '2023-12-05T09:15:00Z',
    isActive: true,
    applicationCount: 32,
    views: 89,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: mockCompanies[3],
    description: 'Join our platform team to build and maintain scalable infrastructure. Work with containerization, CI/CD, and cloud technologies.',
    requirements: [
      '4+ years DevOps experience',
      'Strong knowledge of AWS/Azure/GCP',
      'Experience with Docker and Kubernetes',
      'CI/CD pipeline setup',
      'Infrastructure as Code (Terraform, CloudFormation)',
    ],
    responsibilities: [
      'Manage cloud infrastructure',
      'Build CI/CD pipelines',
      'Monitor system performance',
      'Automate deployment processes',
      'Ensure security best practices',
    ],
    location: 'Seattle, WA',
    salary: { min: 130000, max: 170000, currency: 'USD' },
    type: 'full-time',
    status: 'active',
    industry: 'Enterprise Software',
    experienceLevel: 'senior',
    benefits: ['Health Insurance', 'Dental', 'Vision', '401k', 'Stock Options'],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Python'],
    postedDate: '2023-11-30T16:45:00Z',
    isActive: true,
    applicationCount: 28,
    views: 134,
  },
  {
    id: '5',
    title: 'UX/UI Designer',
    company: mockCompanies[4],
    description: 'Create beautiful and intuitive user experiences for web and mobile applications. Work closely with product and engineering teams.',
    requirements: [
      '3+ years UX/UI design experience',
      'Proficiency in Figma, Sketch, or Adobe XD',
      'Strong portfolio demonstrating design process',
      'User research and testing experience',
      'Knowledge of design systems',
    ],
    responsibilities: [
      'Design user interfaces and experiences',
      'Conduct user research',
      'Create wireframes and prototypes',
      'Collaborate with development teams',
      'Maintain design systems',
    ],
    location: 'Los Angeles, CA',
    salary: { min: 85000, max: 115000, currency: 'USD' },
    type: 'full-time',
    status: 'active',
    industry: 'Design',
    experienceLevel: 'mid',
    benefits: ['Health Insurance', 'Creative Budget', 'Flexible Hours', 'Remote Work'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS'],
    postedDate: '2023-12-03T11:30:00Z',
    isActive: true,
    applicationCount: 41,
    views: 98,
  },
  {
    id: '6',
    title: 'Junior Frontend Developer',
    company: mockCompanies[0],
    description: 'Perfect entry-level position for new graduates or career changers. Join our supportive team and grow your frontend development skills.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Basic knowledge of HTML, CSS, JavaScript',
      'Familiarity with React',
      'Eagerness to learn and grow',
      'Strong problem-solving skills',
    ],
    responsibilities: [
      'Build user interface components',
      'Fix bugs and implement features',
      'Learn from senior developers',
      'Participate in team meetings',
      'Write clean, documented code',
    ],
    location: 'San Francisco, CA',
    salary: { min: 75000, max: 95000, currency: 'USD' },
    type: 'full-time',
    status: 'active',
    industry: 'Technology',
    experienceLevel: 'entry',
    benefits: ['Health Insurance', 'Mentorship Program', 'Learning Budget', 'Snacks'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    postedDate: '2023-12-07T13:20:00Z',
    isActive: true,
    applicationCount: 89,
    views: 245,
  },
];

// Job Applications
export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    userId: '1',
    job: mockJobs[0],
    status: 'under_review',
    appliedDate: '2023-12-02T10:30:00Z',
    coverLetter: 'I am excited to apply for the Senior Frontend Developer position...',
    interviews: [
      {
        id: '1',
        applicationId: '1',
        type: 'phone',
        scheduledDate: '2023-12-10T15:00:00Z',
        duration: 30,
        interviewer: 'Jane Smith',
        status: 'scheduled',
      },
    ],
  },
  {
    id: '2',
    jobId: '3',
    userId: '1',
    job: mockJobs[2],
    status: 'applied',
    appliedDate: '2023-12-06T14:15:00Z',
    coverLetter: 'I believe my full stack experience makes me a perfect fit...',
    interviews: [],
  },
  {
    id: '3',
    jobId: '2',
    userId: '2',
    job: mockJobs[1],
    status: 'technical_interview',
    appliedDate: '2023-11-29T09:45:00Z',
    interviews: [
      {
        id: '2',
        applicationId: '3',
        type: 'technical',
        scheduledDate: '2023-12-12T10:00:00Z',
        duration: 60,
        interviewer: 'Dr. Mike Johnson',
        status: 'scheduled',
      },
    ],
  },
];

// Job Recommendations
export const mockRecommendations: JobRecommendation[] = [
  {
    id: '1',
    jobId: '1',
    userId: '1',
    job: mockJobs[0],
    score: 0.92,
    reasons: [
      { type: 'skill_match', description: 'Strong match with React and TypeScript skills', weight: 0.4 },
      { type: 'location_match', description: 'Job location matches your preferences', weight: 0.3 },
      { type: 'salary_match', description: 'Salary range aligns with your expectations', weight: 0.2 },
    ],
    createdDate: '2023-12-01T08:00:00Z',
    feedback: 'like',
  },
  {
    id: '2',
    jobId: '3',
    userId: '1',
    job: mockJobs[2],
    score: 0.85,
    reasons: [
      { type: 'skill_match', description: 'Good match with React and Node.js experience', weight: 0.35 },
      { type: 'experience_match', description: 'Experience level aligns with requirements', weight: 0.25 },
      { type: 'industry_match', description: 'Research & Development matches your interests', weight: 0.25 },
    ],
    createdDate: '2023-12-01T08:00:00Z',
  },
];

// Job Alerts
export const mockAlerts: JobAlert[] = [
  {
    id: '1',
    userId: '1',
    name: 'Frontend Developer Jobs',
    criteria: {
      keywords: ['React', 'Frontend', 'TypeScript'],
      location: 'San Francisco, CA',
      salaryMin: 80000,
      jobTypes: ['full-time'],
    },
    isActive: true,
    frequency: 'daily',
    lastSent: '2023-12-07T08:00:00Z',
    createdDate: '2023-11-15T10:00:00Z',
  },
  {
    id: '2',
    userId: '2',
    name: 'ML Engineer Remote',
    criteria: {
      keywords: ['Machine Learning', 'Python', 'AI'],
      salaryMin: 120000,
      jobTypes: ['full-time', 'contract'],
    },
    isActive: true,
    frequency: 'weekly',
    createdDate: '2023-10-20T14:30:00Z',
  },
];

// Bookmarks
export const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    userId: '1',
    jobId: '4',
    job: mockJobs[3],
    createdDate: '2023-12-04T16:20:00Z',
    notes: 'Interesting DevOps role, good salary range',
  },
  {
    id: '2',
    userId: '1',
    jobId: '5',
    job: mockJobs[4],
    createdDate: '2023-12-05T11:15:00Z',
  },
];

// Saved Searches
export const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    userId: '1',
    name: 'React Developer Jobs',
    criteria: {
      query: 'React Developer',
      location: 'San Francisco, CA',
      salaryMin: 90000,
      jobTypes: ['full-time'],
      skills: ['React', 'TypeScript'],
    },
    createdDate: '2023-11-20T12:00:00Z',
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: 1250,
  activeUsers: 987,
  totalJobs: 156,
  activeJobs: 142,
  totalApplications: 3428,
  recentApplications: 89,
  topSearchQueries: [
    { query: 'React Developer', count: 145 },
    { query: 'Machine Learning Engineer', count: 98 },
    { query: 'Full Stack Developer', count: 87 },
    { query: 'DevOps Engineer', count: 76 },
    { query: 'UX Designer', count: 54 },
  ],
  jobCategoryStats: [
    { category: 'Technology', count: 45, percentage: 32.1 },
    { category: 'Healthcare', count: 28, percentage: 20.0 },
    { category: 'Finance', count: 22, percentage: 15.7 },
    { category: 'Education', count: 18, percentage: 12.9 },
    { category: 'Other', count: 27, percentage: 19.3 },
  ],
  applicationStatusStats: [
    { status: 'applied', count: 1245, percentage: 36.3 },
    { status: 'under_review', count: 892, percentage: 26.0 },
    { status: 'phone_screening', count: 456, percentage: 13.3 },
    { status: 'technical_interview', count: 234, percentage: 6.8 },
    { status: 'final_interview', count: 123, percentage: 3.6 },
    { status: 'offer_made', count: 89, percentage: 2.6 },
    { status: 'accepted', count: 56, percentage: 1.6 },
    { status: 'rejected', count: 298, percentage: 8.7 },
    { status: 'withdrawn', count: 35, percentage: 1.0 },
  ],
};

// Skill Gap Analysis
export const mockSkillGaps: SkillGap[] = [
  {
    skill: 'Kubernetes',
    currentLevel: 'beginner',
    requiredLevel: 'intermediate',
    priority: 'high',
    resources: [
      {
        id: '1',
        title: 'Kubernetes for Developers',
        provider: 'Udemy',
        type: 'course',
        url: 'https://udemy.com/kubernetes',
        duration: '12 hours',
        rating: 4.6,
        price: 89.99,
        difficulty: 'intermediate',
      },
    ],
  },
  {
    skill: 'GraphQL',
    currentLevel: 'beginner',
    requiredLevel: 'advanced',
    priority: 'medium',
    resources: [
      {
        id: '2',
        title: 'Full Stack GraphQL',
        provider: 'Frontend Masters',
        type: 'course',
        url: 'https://frontendmasters.com/graphql',
        duration: '8 hours',
        rating: 4.8,
        price: 39.99,
        difficulty: 'intermediate',
      },
    ],
  },
];

// Helper functions for mock API
export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem('currentUserId');
  return userId ? mockUsers.find(user => user.id === userId) || null : null;
};

export const setCurrentUser = (userId: string): void => {
  localStorage.setItem('currentUserId', userId);
};

export const logout = (): void => {
  localStorage.removeItem('currentUserId');
};

export const authenticateUser = (email: string, password: string): User | null => {
  // Simple mock authentication
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') {
    setCurrentUser(user.id);
    return user;
  }
  return null;
};

export const registerUser = (userData: any): User => {
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  
  mockUsers.push(newUser);
  setCurrentUser(newUser.id);
  return newUser;
};

// Search and filter functions
export const searchJobs = (criteria: any) => {
  let filteredJobs = [...mockJobs];

  if (criteria.query) {
    const query = criteria.query.toLowerCase();
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.company.name.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }

  if (criteria.location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(criteria.location.toLowerCase())
    );
  }

  if (criteria.salaryMin) {
    filteredJobs = filteredJobs.filter(job =>
      job.salary.min && job.salary.min >= criteria.salaryMin
    );
  }

  if (criteria.jobTypes && criteria.jobTypes.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      criteria.jobTypes.includes(job.type)
    );
  }

  if (criteria.experienceLevel) {
    filteredJobs = filteredJobs.filter(job =>
      job.experienceLevel === criteria.experienceLevel
    );
  }

  return filteredJobs;
}; 