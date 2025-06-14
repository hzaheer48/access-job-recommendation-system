import { useState, useEffect, useCallback } from 'react';
import {
  authAPI,
  userAPI,
  skillsAPI,
  educationAPI,
  experienceAPI,
  jobsAPI,
  applicationsAPI,
  alertsAPI,
  recommendationsAPI,
  analyticsAPI,
} from './api';

// Generic hook for API calls
export const useApiCall = <T>(apiFunction: () => Promise<any>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};

// Authentication Hooks
export const useAuth = () => {
  const login = useApiCall(authAPI.login);
  const register = useApiCall(authAPI.register);
  const logout = useApiCall(authAPI.logout);
  const getProfile = useApiCall(authAPI.getProfile);
  const updateProfile = useApiCall(authAPI.updateProfile);
  const uploadResume = useApiCall(authAPI.uploadResume);
  const passwordReset = useApiCall(authAPI.passwordReset);
  const passwordResetConfirm = useApiCall(authAPI.passwordResetConfirm);
  const verifyEmail = useApiCall(authAPI.verifyEmail);
  const verifyEmailConfirm = useApiCall(authAPI.verifyEmailConfirm);

  return {
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    uploadResume,
    passwordReset,
    passwordResetConfirm,
    verifyEmail,
    verifyEmailConfirm,
  };
};

// User Management Hooks
export const useUsers = () => {
  const getUsers = useApiCall(userAPI.getUsers);
  const createUser = useApiCall(userAPI.createUser);
  const getUser = useApiCall(userAPI.getUser);
  const updateUser = useApiCall(userAPI.updateUser);
  const deleteUser = useApiCall(userAPI.deleteUser);
  const partialUpdateUser = useApiCall(userAPI.partialUpdateUser);

  return {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    partialUpdateUser,
  };
};

// Skills Hooks
export const useSkills = () => {
  const getSkills = useApiCall(skillsAPI.getSkills);
  const createSkill = useApiCall(skillsAPI.createSkill);
  const getSkill = useApiCall(skillsAPI.getSkill);
  const updateSkill = useApiCall(skillsAPI.updateSkill);
  const deleteSkill = useApiCall(skillsAPI.deleteSkill);
  const getUserSkills = useApiCall(skillsAPI.getUserSkills);
  const addUserSkill = useApiCall(skillsAPI.addUserSkill);
  const getUserSkill = useApiCall(skillsAPI.getUserSkill);
  const updateUserSkill = useApiCall(skillsAPI.updateUserSkill);
  const deleteUserSkill = useApiCall(skillsAPI.deleteUserSkill);

  return {
    getSkills,
    createSkill,
    getSkill,
    updateSkill,
    deleteSkill,
    getUserSkills,
    addUserSkill,
    getUserSkill,
    updateUserSkill,
    deleteUserSkill,
  };
};

// Education Hooks
export const useEducation = () => {
  const getEducation = useApiCall(educationAPI.getEducation);
  const addEducation = useApiCall(educationAPI.addEducation);
  const getEducationRecord = useApiCall(educationAPI.getEducationRecord);
  const updateEducation = useApiCall(educationAPI.updateEducation);
  const deleteEducation = useApiCall(educationAPI.deleteEducation);

  return {
    getEducation,
    addEducation,
    getEducationRecord,
    updateEducation,
    deleteEducation,
  };
};

// Experience Hooks
export const useExperience = () => {
  const getExperience = useApiCall(experienceAPI.getExperience);
  const addExperience = useApiCall(experienceAPI.addExperience);
  const getExperienceRecord = useApiCall(experienceAPI.getExperienceRecord);
  const updateExperience = useApiCall(experienceAPI.updateExperience);
  const deleteExperience = useApiCall(experienceAPI.deleteExperience);

  return {
    getExperience,
    addExperience,
    getExperienceRecord,
    updateExperience,
    deleteExperience,
  };
};

// Jobs Hooks
export const useJobs = () => {
  const getJobs = useApiCall(jobsAPI.getJobs);
  const createJob = useApiCall(jobsAPI.createJob);
  const getJob = useApiCall(jobsAPI.getJob);
  const updateJob = useApiCall(jobsAPI.updateJob);
  const deleteJob = useApiCall(jobsAPI.deleteJob);
  const getCompanies = useApiCall(jobsAPI.getCompanies);
  const createCompany = useApiCall(jobsAPI.createCompany);
  const getCompany = useApiCall(jobsAPI.getCompany);
  const updateCompany = useApiCall(jobsAPI.updateCompany);
  const deleteCompany = useApiCall(jobsAPI.deleteCompany);
  const getSkillRequirements = useApiCall(jobsAPI.getSkillRequirements);
  const createSkillRequirement = useApiCall(jobsAPI.createSkillRequirement);
  const getSkillRequirement = useApiCall(jobsAPI.getSkillRequirement);
  const updateSkillRequirement = useApiCall(jobsAPI.updateSkillRequirement);
  const deleteSkillRequirement = useApiCall(jobsAPI.deleteSkillRequirement);

  return {
    getJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob,
    getCompanies,
    createCompany,
    getCompany,
    updateCompany,
    deleteCompany,
    getSkillRequirements,
    createSkillRequirement,
    getSkillRequirement,
    updateSkillRequirement,
    deleteSkillRequirement,
  };
};

// Applications Hooks
export const useApplications = () => {
  const getApplications = useApiCall(applicationsAPI.getApplications);
  const createApplication = useApiCall(applicationsAPI.createApplication);
  const getApplication = useApiCall(applicationsAPI.getApplication);
  const updateApplication = useApiCall(applicationsAPI.updateApplication);
  const deleteApplication = useApiCall(applicationsAPI.deleteApplication);
  const getApplicationStats = useApiCall(applicationsAPI.getApplicationStats);
  const getInterviews = useApiCall(applicationsAPI.getInterviews);
  const createInterview = useApiCall(applicationsAPI.createInterview);
  const getInterview = useApiCall(applicationsAPI.getInterview);
  const updateInterview = useApiCall(applicationsAPI.updateInterview);
  const deleteInterview = useApiCall(applicationsAPI.deleteInterview);

  return {
    getApplications,
    createApplication,
    getApplication,
    updateApplication,
    deleteApplication,
    getApplicationStats,
    getInterviews,
    createInterview,
    getInterview,
    updateInterview,
    deleteInterview,
  };
};

// Alerts Hooks
export const useAlerts = () => {
  const getAlerts = useApiCall(alertsAPI.getAlerts);
  const createAlert = useApiCall(alertsAPI.createAlert);
  const getAlert = useApiCall(alertsAPI.getAlert);
  const updateAlert = useApiCall(alertsAPI.updateAlert);
  const deleteAlert = useApiCall(alertsAPI.deleteAlert);
  const getNotifications = useApiCall(alertsAPI.getNotifications);
  const createNotification = useApiCall(alertsAPI.createNotification);
  const getNotification = useApiCall(alertsAPI.getNotification);
  const updateNotification = useApiCall(alertsAPI.updateNotification);
  const deleteNotification = useApiCall(alertsAPI.deleteNotification);
  const markNotificationRead = useApiCall(alertsAPI.markNotificationRead);

  return {
    getAlerts,
    createAlert,
    getAlert,
    updateAlert,
    deleteAlert,
    getNotifications,
    createNotification,
    getNotification,
    updateNotification,
    deleteNotification,
    markNotificationRead,
  };
};

// Recommendations Hooks
export const useRecommendations = () => {
  const getRecommendations = useApiCall(recommendationsAPI.getRecommendations);
  const createRecommendation = useApiCall(recommendationsAPI.createRecommendation);
  const getRecommendation = useApiCall(recommendationsAPI.getRecommendation);
  const updateRecommendation = useApiCall(recommendationsAPI.updateRecommendation);
  const deleteRecommendation = useApiCall(recommendationsAPI.deleteRecommendation);
  const submitFeedback = useApiCall(recommendationsAPI.submitFeedback);
  const getSkillGaps = useApiCall(recommendationsAPI.getSkillGaps);
  const getRecommendationExplanation = useApiCall(recommendationsAPI.getRecommendationExplanation);
  const retrainModel = useApiCall(recommendationsAPI.retrainModel);

  return {
    getRecommendations,
    createRecommendation,
    getRecommendation,
    updateRecommendation,
    deleteRecommendation,
    submitFeedback,
    getSkillGaps,
    getRecommendationExplanation,
    retrainModel,
  };
};

// Analytics Hooks (Admin only)
export const useAnalytics = () => {
  const getDashboardMetrics = useApiCall(analyticsAPI.getDashboardMetrics);
  const getUserManagement = useApiCall(analyticsAPI.getUserManagement);
  const updateUserStatus = useApiCall(analyticsAPI.updateUserStatus);
  const getPendingJobs = useApiCall(analyticsAPI.getPendingJobs);
  const approveJob = useApiCall(analyticsAPI.approveJob);
  const getDetailedAnalytics = useApiCall(analyticsAPI.getDetailedAnalytics);
  const getSystemLogs = useApiCall(analyticsAPI.getSystemLogs);

  return {
    getDashboardMetrics,
    getUserManagement,
    updateUserStatus,
    getPendingJobs,
    approveJob,
    getDetailedAnalytics,
    getSystemLogs,
  };
};

// Custom hook for fetching data on component mount
export const useFetch = <T>(apiFunction: () => Promise<any>, dependencies: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction();
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => setLoading(true) };
};

// Hook for pagination
export const usePagination = <T>(apiFunction: (params: any) => Promise<any>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction({ page: pageNum, page_size: 20 });
      const newData = response.data.results || response.data;
      
      if (reset) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }
      
      setHasMore(!!response.data.next);
      setTotalCount(response.data.count || newData.length);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(page + 1, false);
    }
  }, [fetchData, loading, hasMore, page]);

  const refresh = useCallback(() => {
    fetchData(1, true);
  }, [fetchData]);

  useEffect(() => {
    fetchData(1, true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh,
  };
};