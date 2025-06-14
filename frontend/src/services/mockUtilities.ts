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

// Mock Resume Parsing Service
export const parseResumeFile = async (file: File): Promise<{
  skills: string[];
  experience: any[];
  education: any[];
  summary: string;
}> => {
  await delay(2000); // Simulate processing time
  
  // Mock parsing based on filename
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('senior') || fileName.includes('lead')) {
    return {
      skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Team Leadership'],
      experience: [
        {
          id: `exp_${Date.now()}_1`,
          company: 'Tech Innovations Corp',
          position: 'Senior Software Engineer',
          description: 'Led a team of 5 developers in building scalable web applications. Architected microservices using Node.js and deployed on AWS. Mentored junior developers and established coding standards.',
          startDate: '2021-03-01',
          endDate: '2024-01-15',
          location: 'San Francisco, CA',
          skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Team Leadership']
        },
        {
          id: `exp_${Date.now()}_2`,
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          description: 'Developed end-to-end web applications using MERN stack. Implemented CI/CD pipelines and optimized application performance.',
          startDate: '2019-06-01',
          endDate: '2021-02-28',
          location: 'Remote',
          skills: ['MongoDB', 'Express.js', 'React', 'Node.js']
        }
      ],
      education: [
        {
          id: `edu_${Date.now()}_1`,
          institution: 'Stanford University',
          degree: 'Master of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2017-09-01',
          endDate: '2019-05-15',
          gpa: 3.9
        }
      ],
      summary: 'Senior software engineer with 5+ years of experience in full-stack development and team leadership. Expertise in modern web technologies and cloud platforms.'
    };
  }
  
  if (fileName.includes('data') || fileName.includes('analyst')) {
    return {
      skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Tableau', 'R', 'Statistics'],
      experience: [
        {
          id: `exp_${Date.now()}_1`,
          company: 'DataCorp Analytics',
          position: 'Data Analyst',
          description: 'Analyzed large datasets to identify business insights. Created interactive dashboards and reports. Collaborated with stakeholders to define KPIs.',
          startDate: '2022-01-01',
          endDate: '2024-01-01',
          location: 'New York, NY',
          skills: ['Python', 'SQL', 'Tableau', 'Statistics']
        }
      ],
      education: [
        {
          id: `edu_${Date.now()}_1`,
          institution: 'MIT',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Mathematics',
          startDate: '2018-09-01',
          endDate: '2022-05-15',
          gpa: 3.8
        }
      ],
      summary: 'Data analyst with strong mathematical background and expertise in statistical analysis and data visualization.'
    };
  }
  
  // Default mock data for generic resumes
  return {
    skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Git', 'Problem Solving'],
    experience: [
      {
        id: `exp_${Date.now()}_1`,
        company: 'Tech Solutions Inc.',
        position: 'Software Developer',
        description: 'Developed responsive web applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality software.',
        startDate: '2022-06-01',
        endDate: '2023-12-31',
        location: 'Remote',
        skills: ['JavaScript', 'React', 'CSS', 'HTML']
      }
    ],
    education: [
      {
        id: `edu_${Date.now()}_1`,
        institution: 'State University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2018-09-01',
        endDate: '2022-05-15',
        gpa: 3.5
      }
    ],
    summary: 'Motivated software developer with experience in web technologies and a passion for creating user-friendly applications.'
  };
};