import { SkillGapAnalysis } from '../types';

// Mock Skills for Skill Assessment
export const mockAvailableSkills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile/Scrum',
  'System Design', 'Data Structures', 'Algorithms', 'Machine Learning'
];

// Mock Learning Paths for Skill Assessment
export const mockLearningPaths: any[] = [
  {
    skill: 'React',
    resources: [
        {
          title: 'React Performance Optimization',
          type: 'course',
          url: 'https://example.com/react-performance',
          duration: '8 hours',
          difficulty: 'advanced',
          provider: 'Tech Academy',
          cost: 'paid'
        },
        {
          title: 'Advanced React Patterns',
          type: 'tutorial',
          url: 'https://example.com/react-patterns',
          duration: '4 hours',
          difficulty: 'advanced',
          provider: 'React Docs',
          cost: 'free'
        }
    ]
  },
  {
    skill: 'TypeScript',
    resources: [
        {
          title: 'TypeScript Handbook',
          type: 'tutorial',
          url: 'https://www.typescriptlang.org/docs/',
          duration: '6 hours',
          difficulty: 'beginner',
          provider: 'TypeScript Team',
          cost: 'free'
        },
        {
          title: 'TypeScript with React',
          type: 'course',
          url: 'https://example.com/typescript-react',
          duration: '15 hours',
          difficulty: 'intermediate',
          provider: 'Code School',
          cost: 'paid'
        }
    ]
  }
];

// Mock Skill Assessment Questions
export const mockSkillAssessmentQuestions: any[] = [
  {
    id: 'q1',
    skill: 'JavaScript',
    question: 'What is the difference between let, const, and var in JavaScript?',
    type: 'multiple-choice',
    options: [
      'let and const are block-scoped, var is function-scoped',
      'They are all the same',
      'var is block-scoped, let and const are function-scoped',
      'Only const is block-scoped'
    ],
    correctAnswer: 0,
    difficulty: 'intermediate',
    timeLimit: 120
  },
  {
    id: 'q2',
    skill: 'React',
    question: 'What is the purpose of useEffect hook in React?',
    type: 'multiple-choice',
    options: [
      'To manage component state',
      'To perform side effects in functional components',
      'To create new components',
      'To handle user events'
    ],
    correctAnswer: 1,
    difficulty: 'intermediate',
    timeLimit: 90
  }
];

// Mock Assessment Results
export const mockAssessmentResults: any[] = [
  {
    id: 'result1',
    skill: 'JavaScript',
    score: 85,
    level: 'advanced',
    completedAt: '2024-01-20T10:00:00Z',
    timeSpent: 45,
    questionsAnswered: 20,
    correctAnswers: 17
  },
  {
    id: 'result2',
    skill: 'React',
    score: 78,
    level: 'intermediate',
    completedAt: '2024-01-18T14:30:00Z',
    timeSpent: 38,
    questionsAnswered: 15,
    correctAnswers: 12
  }
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