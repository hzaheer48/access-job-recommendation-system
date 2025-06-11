// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'admin';
  profile?: JobSeekerProfile;
  createdAt: string;
  isActive: boolean;
  avatar?: string;
  title?: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  isDeactivated?: boolean;
  lastLogin?: string;
}

export interface JobSeekerProfile {
  id: string;
  userId: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  preferences: JobPreferences;
  resume?: string;
  phone?: string;
  location?: string;
  bio?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  gpa?: number;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  description: string;
  achievements: string[];
}

export interface JobPreferences {
  desiredRoles: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  locations: string[];
  remoteOk: boolean;
  jobTypes: JobType[];
  industries: string[];
}

// Job Types
export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  type: JobType;
  status: 'active' | 'inactive' | 'draft';
  experienceLevel: ExperienceLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  salary: {
    min?: number;
    max?: number;
    currency: string;
  };
  postedDate: string;
  applicationDeadline?: string;
  isActive: boolean;
  applicationCount: number;
  views: number;
  industry?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  industry: string;
  size: CompanySize;
  location: string;
  founded?: string;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

// Application Types
export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter?: string;
  resume?: string;
  notes?: string;
  interviews: Interview[];
}

export type ApplicationStatus = 
  | 'applied' 
  | 'under_review' 
  | 'phone_screening' 
  | 'technical_interview' 
  | 'final_interview' 
  | 'offer_made' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledDate: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewer: string;
  notes?: string;
  feedback?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export type InterviewType = 'phone' | 'video' | 'in-person' | 'technical' | 'behavioral' | 'panel';

// Recommendation Types
export interface JobRecommendation {
  id: string;
  jobId: string;
  userId: string;
  job: Job;
  score: number;
  reasons: RecommendationReason[];
  createdDate: string;
  feedback?: 'like' | 'dislike' | 'not_relevant';
}

export interface RecommendationReason {
  type: 'skill_match' | 'experience_match' | 'location_match' | 'salary_match' | 'industry_match';
  description: string;
  weight: number;
}

// Alert Types
export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  criteria: AlertCriteria;
  isActive: boolean;
  frequency: AlertFrequency;
  lastSent?: string;
  createdDate: string;
  query?: string;
  location?: string;
  salaryMin?: string;
  jobTypes?: string[];
  createdAt?: string;
  lastTriggered?: string;
  matchCount?: number;
}

export interface AlertCriteria {
  keywords?: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobTypes?: JobType[];
  experienceLevel?: ExperienceLevel;
  industries?: string[];
}

export type AlertFrequency = 'immediate' | 'daily' | 'weekly';

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  createdDate: string;
  notes?: string;
  savedAt?: string;
}

// Search Types
export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  criteria: SearchCriteria;
  createdDate: string;
}

export interface SearchCriteria {
  query?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobTypes?: JobType[];
  experienceLevel?: ExperienceLevel;
  industries?: string[];
  skills?: string[];
  company?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  recentApplications: number;
  topSearchQueries: SearchQuery[];
  jobCategoryStats: CategoryStat[];
  applicationStatusStats: StatusStat[];
}

export interface SearchQuery {
  query: string;
  count: number;
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusStat {
  status: ApplicationStatus;
  count: number;
  percentage: number;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'job_seeker' | 'admin';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Skill Gap Analysis
export interface SkillGap {
  skill: string;
  currentLevel: string;
  requiredLevel: string;
  priority: 'high' | 'medium' | 'low';
  resources: LearningResource[];
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  type: 'course' | 'tutorial' | 'book' | 'video' | 'certification';
  url: string;
  duration?: string;
  rating?: number;
  price?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
} 