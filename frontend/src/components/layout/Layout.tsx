import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-secondary-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">AccessJobs</h3>
              <p className="text-sm text-secondary-600">
                Your gateway to finding the perfect job. Connect with opportunities that match your skills and aspirations.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li><span className="hover:text-primary-600 cursor-pointer">Browse Jobs</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Career Advice</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Resume Builder</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Salary Guide</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li><span className="hover:text-primary-600 cursor-pointer">Post Jobs</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Talent Search</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Recruiting Solutions</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Pricing</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li><span className="hover:text-primary-600 cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-primary-600 cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-200 mt-8 pt-8 text-center">
            <p className="text-sm text-secondary-500">
              © 2023 AccessJobs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 