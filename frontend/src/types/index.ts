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
  // Backend fields (optional)
  user_type?: string;
  is_verified?: boolean;
  phone?: string;
  location?: string;
  bio?: string;
  resume?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  experience_level?: string;
  profile_details?: Record<string, any>;
  updated_at?: string;
  last_login?: string;
  profile_visibility?: string;
  show_email?: boolean;
  show_phone?: boolean;
  show_location?: boolean;
  show_resume?: boolean;
  show_social_links?: boolean;
  show_experience?: boolean;
  show_education?: boolean;
  show_skills?: boolean;
  resumeVersions?: ResumeVersion[];
  selectedTemplate?: ResumeTemplate;
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
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  skillLevels: Record<string, number>;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  experienceLevel: ExperienceLevel;
  education: string;
  benefits: string[];
  applicationCount: number;
  viewCount: number;
  isRemote: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  tags: string[];
  metadata: Record<string, any>;
  // Backend fields (optional)
  salary_min?: number;
  salary_max?: number;
  job_type?: string;
  experience_level?: string;
  remote_option?: string;
  posted_date?: string;
  application_deadline?: string;
  is_active?: boolean;
  is_featured?: boolean;
  view_count?: number;
  posted_by?: string;
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
  // Backend fields (optional)
  last_updated?: string;
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

export interface JobAlertMatch {
  id: string;
  alertId: string;
  jobId: string;
  matchScore: number;
  matchReasons: string[];
  createdAt: string;
  status: 'new' | 'viewed' | 'applied' | 'dismissed';
}

export interface JobAlertStats {
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

export interface Skill {
  name: string;
  proficiencyLevel: number;
  yearsOfExperience?: number;
  verified: boolean;
  verifiedBy?: string;
  lastUsed?: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  aliases?: string[];
  popularityScore?: number;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: 'technical' | 'behavioral' | 'system_design' | 'culture_fit';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  date: string;
  duration: number;
  interviewers: string[];
  notes: string;
  feedback?: {
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    cultureFitScore: number;
    strengths: string[];
    areasForImprovement: string[];
    notes: string;
  };
  preparation?: {
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
  };
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  templateFile?: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'cover_letter' | 'certificate' | 'portfolio' | 'other';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  isCurrent: boolean;
  metadata: {
    uploadedAt: string;
    lastModified: string;
    tags: string[];
    description?: string;
    visibility: 'private' | 'public' | 'shared';
    sharedWith?: string[];
  };
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  changes: {
    type: 'content' | 'format' | 'metadata';
    description: string;
  }[];
}

export interface ResumeVersion {
  id: string;
  user?: string;
  file: string;
  version_number: number;
  uploaded_at: string;
  is_current: boolean;
  parsed_data?: Record<string, any>;
}

export interface Assessment {
  id: string;
  userId: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  maxScore: number;
  duration: number;
  startTime?: string;
  endTime?: string;
  questions: AssessmentQuestion[];
  // Backend fields (optional)
  template?: AssessmentTemplate;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text' | 'code';
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  options?: string[];
  correctAnswer?: string;
  // Backend fields (optional)
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  tags: string[];
  questions: AssessmentQuestion[];
  // Backend fields (optional)
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTaken: number;
  answers: AssessmentAnswer[];
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  completedAt: string;
  // Backend fields (optional)
  created_at?: string;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  points: number;
  isCorrect: boolean;
  // Backend fields (optional)
  id?: string;
  result?: string;
} 