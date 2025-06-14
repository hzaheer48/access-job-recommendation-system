import { User, Skill } from '../types';

interface Assessment {
  id: string;
  userId: string;
  skillId: string;
  type: 'quiz' | 'coding' | 'project' | 'interview';
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  score?: number;
  maxScore: number;
  startTime?: string;
  endTime?: string;
  duration: number; // in minutes
  questions: AssessmentQuestion[];
  results?: AssessmentResult;
}

interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'coding' | 'text' | 'file_upload';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
}

interface AssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number; // in minutes
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    points: number;
  }[];
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  skillId: string;
  type: Assessment['type'];
  duration: number;
  questions: AssessmentQuestion[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  tags: string[];
}

export const createAssessment = async (
  userId: string,
  skillId: string,
  templateId: string
): Promise<Assessment> => {
  // In a real app, this would be an API call
  return {
    id: 'assess_1',
    userId,
    skillId,
    type: 'quiz',
    status: 'pending',
    maxScore: 100,
    duration: 60,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the correct syntax for declaring a variable in JavaScript?',
        options: [
          'var x = 5;',
          'variable x = 5;',
          'x = 5;',
          'let x = 5;'
        ],
        correctAnswer: ['var x = 5;', 'let x = 5;'],
        points: 10,
        difficulty: 'easy',
        category: 'JavaScript Basics'
      }
    ]
  };
};

export const getAssessment = async (assessmentId: string): Promise<Assessment> => {
  // In a real app, this would be an API call
  return {
    id: assessmentId,
    userId: 'user_1',
    skillId: 'skill_1',
    type: 'quiz',
    status: 'in_progress',
    maxScore: 100,
    startTime: new Date().toISOString(),
    duration: 60,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the correct syntax for declaring a variable in JavaScript?',
        options: [
          'var x = 5;',
          'variable x = 5;',
          'x = 5;',
          'let x = 5;'
        ],
        correctAnswer: ['var x = 5;', 'let x = 5;'],
        points: 10,
        difficulty: 'easy',
        category: 'JavaScript Basics'
      }
    ]
  };
};

export const submitAssessment = async (
  assessmentId: string,
  answers: { questionId: string; answer: string | string[] }[]
): Promise<AssessmentResult> => {
  // In a real app, this would be an API call
  return {
    score: 80,
    maxScore: 100,
    percentage: 80,
    timeTaken: 45,
    answers: [
      {
        questionId: 'q1',
        answer: ['var x = 5;', 'let x = 5;'],
        isCorrect: true,
        points: 10
      }
    ],
    feedback: {
      strengths: ['Good understanding of variable declaration'],
      weaknesses: ['Need to improve on scope concepts'],
      recommendations: ['Practice with let and const declarations']
    }
  };
};

export const getAssessmentTemplates = async (skillId: string): Promise<AssessmentTemplate[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'template_1',
      name: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics',
      skillId,
      type: 'quiz',
      duration: 60,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'What is the correct syntax for declaring a variable in JavaScript?',
          options: [
            'var x = 5;',
            'variable x = 5;',
            'x = 5;',
            'let x = 5;'
          ],
          correctAnswer: ['var x = 5;', 'let x = 5;'],
          points: 10,
          difficulty: 'easy',
          category: 'JavaScript Basics'
        }
      ],
      difficulty: 'beginner',
      prerequisites: ['Basic programming knowledge'],
      tags: ['javascript', 'programming', 'basics']
    }
  ];
};

export const getUserAssessments = async (userId: string): Promise<Assessment[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'assess_1',
      userId,
      skillId: 'skill_1',
      type: 'quiz',
      status: 'completed',
      score: 80,
      maxScore: 100,
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      duration: 60,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'What is the correct syntax for declaring a variable in JavaScript?',
          options: [
            'var x = 5;',
            'variable x = 5;',
            'x = 5;',
            'let x = 5;'
          ],
          correctAnswer: ['var x = 5;', 'let x = 5;'],
          points: 10,
          difficulty: 'easy',
          category: 'JavaScript Basics'
        }
      ],
      results: {
        score: 80,
        maxScore: 100,
        percentage: 80,
        timeTaken: 45,
        answers: [
          {
            questionId: 'q1',
            answer: ['var x = 5;', 'let x = 5;'],
            isCorrect: true,
            points: 10
          }
        ],
        feedback: {
          strengths: ['Good understanding of variable declaration'],
          weaknesses: ['Need to improve on scope concepts'],
          recommendations: ['Practice with let and const declarations']
        }
      }
    }
  ];
};

export const getAssessmentResults = async (assessmentId: string): Promise<AssessmentResult> => {
  // In a real app, this would be an API call
  return {
    score: 80,
    maxScore: 100,
    percentage: 80,
    timeTaken: 45,
    answers: [
      {
        questionId: 'q1',
        answer: ['var x = 5;', 'let x = 5;'],
        isCorrect: true,
        points: 10
      }
    ],
    feedback: {
      strengths: ['Good understanding of variable declaration'],
      weaknesses: ['Need to improve on scope concepts'],
      recommendations: ['Practice with let and const declarations']
    }
  };
}; 