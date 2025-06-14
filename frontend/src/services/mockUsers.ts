import { User } from '../types';

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

// Mock User Profile Data
export const mockUserProfile: any = {
  id: '1',
  userId: 'user1',
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2018-09-01',
      endDate: '2022-05-15',
      gpa: 3.8
    }
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      description: 'Developed responsive web applications using React and TypeScript. Collaborated with design team to implement user-friendly interfaces.',
      startDate: '2022-06-01',
      endDate: '2024-01-15',
      location: 'San Francisco, CA',
      skills: ['React', 'TypeScript', 'CSS', 'JavaScript']
    }
  ],
  careerPreferences: {
    desiredPositions: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
    preferredLocations: ['San Francisco, CA', 'Remote', 'New York, NY'],
    salaryRange: {
      min: 80000,
      max: 120000
    },
    jobTypes: ['full-time'],
    industries: ['Technology', 'Software', 'Startups'],
    workArrangement: 'hybrid'
  },
  location: 'San Francisco, CA',
  summary: 'Passionate frontend developer with 2+ years of experience building modern web applications. Skilled in React, TypeScript, and modern development practices.',
  updatedAt: '2024-01-22T15:30:00Z'
};