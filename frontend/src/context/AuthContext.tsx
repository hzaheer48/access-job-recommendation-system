import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginFormData, RegisterFormData, ApiResponse } from '../types';
import { 
  getCurrentUser, 
  authenticateUser, 
  registerUser, 
  logout as logoutUser,
  mockUsers
} from '../data/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginFormData) => Promise<ApiResponse<User>>;
  register: (userData: RegisterFormData) => Promise<ApiResponse<User>>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginFormData): Promise<ApiResponse<User>> => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const authenticatedUser = authenticateUser(credentials.email, credentials.password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return {
          success: true,
          data: authenticatedUser,
          message: 'Login successful',
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password',
          errors: ['Invalid credentials'],
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        errors: ['An unexpected error occurred'],
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterFormData): Promise<ApiResponse<User>> => {
    try {
      setLoading(true);
      
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
          errors: ['Passwords do not match'],
        };
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User already exists',
          errors: ['A user with this email already exists'],
        };
      }

      const newUser = registerUser(userData);
      setUser(newUser);
      
      return {
        success: true,
        data: newUser,
        message: 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        errors: ['An unexpected error occurred'],
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 