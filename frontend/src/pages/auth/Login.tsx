import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockUsers, simulateApiCall } from '../../services/mockData';
import { LoginFormData } from '../../types';
import Loading from '../../components/shared/Loading';

const Login: React.FC = () => {
  const { state, login, showModal, setLoading } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = state.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath);
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading({ isLoading: true, message: 'Signing in...' });

    try {
      // Simulate API call
      await simulateApiCall(null, 1000);

      // Find user in mock data
      const user = mockUsers.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase() && u.isActive
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // In a real app, password would be verified on the backend
      if (formData.password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      login(user);
      
      showModal({
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${user.firstName}!`,
      });

      // Navigate based on user role
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath);

    } catch (error) {
      showModal({
        type: 'error',
        title: 'Login Failed',
        message: error instanceof Error ? error.message : 'An error occurred during login',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const fillDemoCredentials = (role: 'job_seeker' | 'admin') => {
    const demoUser = mockUsers.find(u => u.role === role);
    if (demoUser) {
      setFormData({
        email: demoUser.email,
        password: 'password123',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('job_seeker')}
              className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
            >
              Job Seeker: {mockUsers.find(u => u.role === 'job_seeker')?.email}
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded transition-colors"
            >
              Admin: {mockUsers.find(u => u.role === 'admin')?.email}
            </button>
            <p className="text-xs text-blue-600">Password for all demo accounts: password123</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={state.loading.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading.isLoading ? (
                <Loading inline size="small" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 