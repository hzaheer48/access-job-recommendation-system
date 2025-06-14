import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/shared/Header';
import Modal from './components/shared/Modal';
import Loading from './components/shared/Loading';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Job Seeker Pages
import Dashboard from './pages/jobSeeker/Dashboard';
import Jobs from './pages/jobSeeker/Jobs';
import JobDetail from './pages/jobSeeker/JobDetail';
import Applications from './pages/jobSeeker/Applications';
import Bookmarks from './pages/jobSeeker/Bookmarks';
import Profile from './pages/jobSeeker/Profile';
import SkillsAnalysis from './pages/jobSeeker/SkillsAnalysis';
import JobAlerts from './pages/jobSeeker/JobAlerts';
import InterviewTracking from './pages/jobSeeker/InterviewTracking';
import SkillAssessment from './pages/jobSeeker/SkillAssessment';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';

// Landing Page
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Job Seeker Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <Jobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/:id"
                  element={
                    <ProtectedRoute>
                      <JobDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookmarks"
                  element={
                    <ProtectedRoute>
                      <Bookmarks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skills-analysis"
                  element={
                    <ProtectedRoute>
                      <SkillsAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/job-alerts"
                  element={
                    <ProtectedRoute>
                      <JobAlerts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview-tracking"
                  element={
                    <ProtectedRoute>
                      <InterviewTracking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skill-assessment"
                  element={
                    <ProtectedRoute>
                      <SkillAssessment />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/jobs"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            {/* Global Components */}
            <Modal />
            <Loading />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;