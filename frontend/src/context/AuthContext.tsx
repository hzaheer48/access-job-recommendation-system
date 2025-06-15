import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  username: string;
  user_type: 'job_seeker' | 'admin';
  is_verified: boolean;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (err) {
      console.error('Error loading user:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      await loadUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      await loadUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(data);
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Profile update failed');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 