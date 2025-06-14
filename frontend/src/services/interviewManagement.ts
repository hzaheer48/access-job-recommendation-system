import { Interview, JobApplication } from '../types';

interface InterviewFeedback {
  id: string;
  interviewId: string;
  interviewer: string;
  date: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  cultureFitScore: number;
  strengths: string[];
  areasForImprovement: string[];
  notes: string;
  recommendations: string[];
  nextSteps: string[];
}

interface InterviewPreparation {
  id: string;
  interviewId: string;
  resources: {
    type: 'article' | 'video' | 'practice' | 'document';
    title: string;
    url: string;
    description: string;
  }[];
  practiceQuestions: {
    question: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    answer?: string;
  }[];
  companyResearch: {
    overview: string;
    culture: string;
    recentNews: string[];
    competitors: string[];
  };
  technicalTopics: string[];
  softSkills: string[];
}

interface InterviewSchedule {
  id: string;
  interviewId: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string;
  participants: {
    name: string;
    role: string;
    email: string;
  }[];
  meetingLink?: string;
  notes: string;
  reminders: {
    time: string;
    message: string;
  }[];
}

export const getInterviewFeedback = async (interviewId: string): Promise<InterviewFeedback> => {
  // In a real app, this would be an API call
  return {
    id: 'feedback_1',
    interviewId,
    interviewer: 'John Smith',
    date: new Date().toISOString(),
    technicalScore: 8,
    communicationScore: 7,
    problemSolvingScore: 9,
    cultureFitScore: 8,
    strengths: [
      'Strong technical knowledge',
      'Clear communication',
      'Good problem-solving approach'
    ],
    areasForImprovement: [
      'Could provide more specific examples',
      'Consider elaborating on past experiences'
    ],
    notes: 'Overall strong performance. Candidate demonstrated good technical skills and communication abilities.',
    recommendations: [
      'Continue practicing system design questions',
      'Prepare more examples from past projects'
    ],
    nextSteps: [
      'Technical assessment',
      'Team interview'
    ]
  };
};

export const getInterviewPreparation = async (interviewId: string): Promise<InterviewPreparation> => {
  // In a real app, this would be an API call
  return {
    id: 'prep_1',
    interviewId,
    resources: [
      {
        type: 'article',
        title: 'System Design Interview Guide',
        url: 'https://example.com/system-design',
        description: 'Comprehensive guide to system design interviews'
      },
      {
        type: 'video',
        title: 'Behavioral Interview Tips',
        url: 'https://example.com/behavioral',
        description: 'Tips for answering behavioral questions'
      }
    ],
    practiceQuestions: [
      {
        question: 'Design a scalable web application',
        category: 'System Design',
        difficulty: 'hard'
      },
      {
        question: 'Tell me about a challenging project you worked on',
        category: 'Behavioral',
        difficulty: 'medium'
      }
    ],
    companyResearch: {
      overview: 'Leading technology company focused on innovation',
      culture: 'Fast-paced, collaborative environment',
      recentNews: [
        'Company raised $100M in Series C funding',
        'Launched new product line'
      ],
      competitors: ['Competitor A', 'Competitor B']
    },
    technicalTopics: [
      'System Design',
      'Data Structures',
      'Algorithms',
      'Database Design'
    ],
    softSkills: [
      'Communication',
      'Problem Solving',
      'Team Collaboration'
    ]
  };
};

export const scheduleInterview = async (
  application: JobApplication,
  schedule: Omit<InterviewSchedule, 'id' | 'interviewId'>
): Promise<InterviewSchedule> => {
  // In a real app, this would be an API call
  return {
    id: 'schedule_1',
    interviewId: 'interview_1',
    ...schedule
  };
};

export const sendInterviewReminders = async (schedule: InterviewSchedule): Promise<void> => {
  // In a real app, this would send actual reminders
  console.log('Sending reminders for interview:', schedule);
};

export const getInterviewHistory = async (applicationId: string): Promise<Interview[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'interview_1',
      applicationId,
      type: 'technical',
      status: 'scheduled',
      date: new Date().toISOString(),
      duration: 60,
      interviewers: ['John Smith'],
      notes: 'Technical interview focusing on system design'
    }
  ];
};

export const updateInterviewStatus = async (
  interviewId: string,
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
): Promise<Interview> => {
  // In a real app, this would be an API call
  return {
    id: interviewId,
    applicationId: 'app_1',
    type: 'technical',
    status,
    date: new Date().toISOString(),
    duration: 60,
    interviewers: ['John Smith'],
    notes: 'Status updated'
  };
}; 