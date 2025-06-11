import React from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellAlertIcon,
  BookmarkIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <CpuChipIcon className="h-8 w-8" />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized job recommendations based on your skills, experience, and preferences using advanced machine learning algorithms.',
    },
    {
      icon: <MagnifyingGlassIcon className="h-8 w-8" />,
      title: 'Advanced Job Search',
      description: 'Find your perfect job with powerful search filters including location, salary, experience level, and company size.',
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: 'Application Tracking',
      description: 'Keep track of all your job applications in one place with status updates and interview scheduling.',
    },
    {
      icon: <BellAlertIcon className="h-8 w-8" />,
      title: 'Smart Alerts',
      description: 'Get notified instantly when new jobs matching your criteria are posted. Never miss an opportunity again.',
    },
    {
      icon: <BookmarkIcon className="h-8 w-8" />,
      title: 'Save & Organize',
      description: 'Bookmark interesting jobs and organize them into custom lists for easy access and comparison.',
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: 'Profile Management',
      description: 'Build a comprehensive profile with your skills, experience, and preferences to attract the right opportunities.',
    },
  ];

  const stats = [
    { label: 'Active Jobs', value: '10,000+' },
    { label: 'Companies', value: '2,500+' },
    { label: 'Job Seekers', value: '50,000+' },
    { label: 'Success Rate', value: '85%' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Job with{' '}
              <span className="text-primary-200">AI-Powered</span> Recommendations
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join thousands of job seekers who trust AccessJobs to connect them with opportunities that match their skills and aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary-600">
                <Link to="/auth/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose AccessJobs?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with intuitive design to make your job search more efficient and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-secondary-600">
                Tell us about your skills, experience, and what you're looking for in your next role.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Get Recommendations
              </h3>
              <p className="text-secondary-600">
                Our AI analyzes your profile and suggests jobs that match your preferences and qualifications.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Apply & Track
              </h3>
              <p className="text-secondary-600">
                Apply to jobs with one click and track your application progress all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who have found their dream jobs through AccessJobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary-600">
              <Link to="/auth/register">Start Your Search</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 