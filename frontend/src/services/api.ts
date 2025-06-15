import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        localStorage.setItem('token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // Handle refresh token failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (data: any) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.put('/auth/profile/', data),
  uploadResume: (formData: FormData) => api.post('/auth/upload-resume/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/auth/users/'),
  getUser: (id: number) => api.get(`/auth/users/${id}/`),
  updateUser: (id: number, data: any) => api.put(`/auth/users/${id}/`, data),
  deleteUser: (id: number) => api.delete(`/auth/users/${id}/`),
  getUserSkills: (id: number) => api.get(`/auth/users/${id}/skills/`),
};

// Skills API
export const skillsAPI = {
  getSkills: () => api.get('/auth/skills/'),
  createSkill: (data: any) => api.post('/auth/skills/', data),
  getUserSkills: () => api.get('/auth/user-skills/'),
  addUserSkill: (data: any) => api.post('/auth/user-skills/', data),
  updateUserSkill: (id: number, data: any) => api.put(`/auth/user-skills/${id}/`, data),
  deleteUserSkill: (id: number) => api.delete(`/auth/user-skills/${id}/`),
};

// Education API
export const educationAPI = {
  getEducation: () => api.get('/auth/education/'),
  addEducation: (data: any) => api.post('/auth/education/', data),
  updateEducation: (id: number, data: any) => api.put(`/auth/education/${id}/`, data),
  deleteEducation: (id: number) => api.delete(`/auth/education/${id}/`),
};

// Experience API
export const experienceAPI = {
  getExperience: () => api.get('/auth/experience/'),
  addExperience: (data: any) => api.post('/auth/experience/', data),
  updateExperience: (id: number, data: any) => api.put(`/auth/experience/${id}/`, data),
  deleteExperience: (id: number) => api.delete(`/auth/experience/${id}/`),
};

// Jobs API
export const jobsAPI = {
  getJobs: () => api.get('/jobs/'),
  createJob: (data: any) => api.post('/jobs/', data),
  searchJobs: (params: any) => api.get('/jobs/search/', { params }),
  getCompanies: () => api.get('/jobs/companies/'),
  createCompany: (data: any) => api.post('/jobs/companies/', data),
  getJob: (id: number) => api.get(`/jobs/${id}/`),
  updateJob: (id: number, data: any) => api.put(`/jobs/${id}/`, data),
  deleteJob: (id: number) => api.delete(`/jobs/${id}/`),
};

// Applications API
export const applicationsAPI = {
  getApplications: () => api.get('/applications/'),
  createApplication: (data: any) => api.post('/applications/', data),
  getApplicationStats: () => api.get('/applications/stats/'),
  getInterviews: () => api.get('/applications/interviews/'),
  createInterview: (data: any) => api.post('/applications/interviews/', data),
  updateInterview: (id: number, data: any) => api.put(`/applications/interviews/${id}/`, data),
};

// Alerts API
export const alertsAPI = {
  getAlerts: () => api.get('/alerts/'),
  createAlert: (data: any) => api.post('/alerts/', data),
  getNotifications: () => api.get('/alerts/notifications/'),
  markNotificationRead: (id: number) => api.post(`/alerts/notifications/${id}/read/`),
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: () => api.get('/recommendations/'),
  submitFeedback: (data: any) => api.post('/recommendations/feedback/', data),
  getSkillGaps: () => api.get('/recommendations/skill-gaps/'),
  getRecommendationExplanation: (jobId: number) => api.get(`/recommendations/explain/${jobId}/`),
  retrainModel: () => api.post('/recommendations/retrain/'),
};

// Analytics API (Admin only)
export const analyticsAPI = {
  getDashboardMetrics: () => api.get('/analytics/dashboard/'),
  getUserManagement: () => api.get('/analytics/users/'),
  updateUserStatus: (id: number, data: any) => api.post(`/analytics/users/${id}/status/`, data),
  getPendingJobs: () => api.get('/analytics/jobs/pending/'),
  approveJob: (id: number) => api.post(`/analytics/jobs/${id}/approve/`),
  getDetailedAnalytics: () => api.get('/analytics/analytics/'),
  getSystemLogs: () => api.get('/analytics/system-logs/'),
};

export default api; 