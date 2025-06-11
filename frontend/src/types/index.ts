// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'admin';
  isActive: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  careerPreferences: CareerPreferences;
  resume?: ResumeData;
  location: string;
  summary: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  skills: string[];
}

export interface CareerPreferences {
  desiredPositions: string[];
  preferredLocations: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  jobTypes: JobType[];
  industries: string[];
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'any';
}

export interface ResumeData {
  fileName: string;
  uploadDate: string;
  extractedData: {
    skills: string[];
    experience: string[];
    education: string[];
  };
}

// Job Related Types
export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  salaryRange: {
    min: number;
    max: number;
  };
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  industry: string;
  postedDate: string;
  applicationDeadline?: string;
  isActive: boolean;
  companyLogo?: string;
  skills: string[];
  applicationCount: number;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';

// Application Types
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter?: string;
  customResume?: string;
  notes: string;
  interviewStages: InterviewStage[];
  job: Job;
}

export type ApplicationStatus = 
  | 'applied' 
  | 'under_review' 
  | 'interview_scheduled' 
  | 'interviewed' 
  | 'offer_extended' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface InterviewStage {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'final';
  scheduledDate?: string;
  completed: boolean;
  notes: string;
  feedback?: string;
}

// Recommendation Types
export interface JobRecommendation {
  job: Job;
  score: number;
  explanation: RecommendationExplanation;
  feedback?: RecommendationFeedback;
}

export interface RecommendationExplanation {
  skillsMatch: {
    matched: string[];
    missing: string[];
    percentage: number;
  };
  experienceMatch: {
    relevantExperience: string[];
    yearsMatch: boolean;
  };
  locationPreference: boolean;
  salaryMatch: boolean;
  reasons: string[];
}

export interface RecommendationFeedback {
  userId: string;
  jobId: string;
  feedback: 'like' | 'dislike' | 'not_relevant';
  reason?: string;
  submittedAt: string;
}

// Alert and Search Types
export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  criteria: SearchCriteria;
  isActive: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  lastTriggered?: string;
  createdAt: string;
}

export interface SearchCriteria {
  keywords: string[];
  location: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  jobTypes: JobType[];
  experienceLevel?: ExperienceLevel;
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  workArrangement?: 'remote' | 'hybrid' | 'onsite' | 'any';
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  criteria: SearchCriteria;
  createdAt: string;
  lastUsed: string;
}

// Bookmark Types
export interface JobBookmark {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  notes?: string;
  job: Job;
}

// Skill Gap Analysis Types
export interface SkillGapAnalysis {
  userId: string;
  targetRole: string;
  currentSkills: string[];
  requiredSkills: string[];
  skillGaps: SkillGap[];
  learningPaths: LearningPath[];
  generatedAt: string;
}

export interface SkillGap {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  estimatedLearningTime: string;
}

export interface LearningPath {
  skill: string;
  resources: LearningResource[];
}

export interface LearningResource {
  title: string;
  type: 'course' | 'certification' | 'book' | 'tutorial' | 'practice';
  provider: string;
  url: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: 'free' | 'paid';
}

// Admin Dashboard Types
export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  topSearchQueries: SearchQuery[];
  popularJobCategories: JobCategory[];
  systemPerformance: SystemPerformance;
}

export interface SearchQuery {
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface JobCategory {
  category: string;
  count: number;
  applicationRate: number;
}

export interface SystemPerformance {
  responseTime: number;
  uptime: number;
  errorRate: number;
  recommendationAccuracy: number;
}

// System Activity Types
export interface SystemActivity {
  id: string;
  type: 'user_registration' | 'job_posted' | 'application_submitted' | 'login' | 'search';
  userId?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Modal and UI Types
export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'admin';
}

export interface JobFormData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  industry: string;
  applicationDeadline?: string;
  skills: string[];
} 