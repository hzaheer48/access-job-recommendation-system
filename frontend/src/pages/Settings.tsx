import React, { useState } from 'react';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Account settings
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notification settings
    emailNotifications: {
      jobMatches: true,
      applicationUpdates: true,
      weeklyDigest: true,
      companyMessages: false,
      marketingEmails: false,
    },
    pushNotifications: {
      jobMatches: true,
      applicationUpdates: true,
      messages: true,
    },
    
    // Privacy settings
    profileVisibility: 'public',
    showContactInfo: false,
    allowRecruiterContact: true,
    dataSharing: false,
    
    // Preferences
    jobAlertFrequency: 'daily',
    preferredJobTypes: ['full-time'],
    preferredLocations: ['Remote'],
    salaryVisibility: true,
  });

  const tabs = [
    { id: 'account', name: 'Account', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
  ];

  const handleSave = (section: string) => {
    // In a real app, this would save to backend
    console.log(`Saving ${section} settings:`, settings);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would delete the account
      console.log('Deleting account...');
    }
  };

  const AccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            value={settings.firstName}
            onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            value={settings.lastName}
            onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          />
          <Input
            label="Phone Number"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div className="mt-6 pt-6 border-t border-secondary-200">
          <Button onClick={() => handleSave('account')}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Change Password</h3>
        
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={settings.currentPassword}
            onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={settings.newPassword}
            onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />
          <Input
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            value={settings.confirmPassword}
            onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
          />
        </div>
        
        <div className="mt-6 pt-6 border-t border-secondary-200">
          <Button onClick={() => handleSave('password')}>
            Update Password
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Account Actions</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-secondary-900 mb-2">Export Data</h4>
            <p className="text-sm text-secondary-600 mb-3">
              Download a copy of your profile data, applications, and saved jobs.
            </p>
            <Button variant="outline" size="sm">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          
          <div className="pt-4 border-t border-secondary-200">
            <h4 className="font-medium text-danger-600 mb-2">Delete Account</h4>
            <p className="text-sm text-secondary-600 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDeleteAccount}
              className="border-danger-300 text-danger-600 hover:bg-danger-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Email Notifications</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.emailNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h4>
                <p className="text-sm text-secondary-600">
                  {key === 'jobMatches' && 'Get notified when new jobs match your preferences'}
                  {key === 'applicationUpdates' && 'Receive updates on your job applications'}
                  {key === 'weeklyDigest' && 'Weekly summary of new opportunities'}
                  {key === 'companyMessages' && 'Messages from companies and recruiters'}
                  {key === 'marketingEmails' && 'Product updates and promotional content'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSettings({
                  ...settings,
                  emailNotifications: {
                    ...settings.emailNotifications,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-secondary-200">
          <Button onClick={() => handleSave('notifications')}>
            Save Notification Settings
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Push Notifications</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.pushNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h4>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSettings({
                  ...settings,
                  pushNotifications: {
                    ...settings.pushNotifications,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Profile Privacy</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="select"
            >
              <option value="public">Public - Visible to all users</option>
              <option value="recruiters">Recruiters only - Visible to verified recruiters</option>
              <option value="private">Private - Not discoverable</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Show contact information</h4>
                <p className="text-sm text-secondary-600">
                  Allow others to see your email and phone number
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.showContactInfo}
                onChange={(e) => setSettings({ ...settings, showContactInfo: e.target.checked })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Allow recruiter contact</h4>
                <p className="text-sm text-secondary-600">
                  Let recruiters reach out to you directly
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowRecruiterContact}
                onChange={(e) => setSettings({ ...settings, allowRecruiterContact: e.target.checked })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Data sharing for improvements</h4>
                <p className="text-sm text-secondary-600">
                  Help us improve our recommendation algorithm
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.dataSharing}
                onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-secondary-200">
          <Button onClick={() => handleSave('privacy')}>
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </div>
  );

  const PreferencesSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Job Preferences</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Job Alert Frequency
            </label>
            <select
              value={settings.jobAlertFrequency}
              onChange={(e) => setSettings({ ...settings, jobAlertFrequency: e.target.value })}
              className="select"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Preferred Job Types
            </label>
            <div className="space-y-2">
              {['full-time', 'part-time', 'contract', 'internship', 'freelance'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.preferredJobTypes.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...settings.preferredJobTypes, type]
                        : settings.preferredJobTypes.filter(t => t !== type);
                      setSettings({ ...settings, preferredJobTypes: newTypes });
                    }}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700 capitalize">
                    {type.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Show salary in job listings</h4>
              <p className="text-sm text-secondary-600">
                Display salary information when available
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.salaryVisibility}
              onChange={(e) => setSettings({ ...settings, salaryVisibility: e.target.checked })}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-secondary-200">
          <Button onClick={() => handleSave('preferences')}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'preferences':
        return <PreferencesSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Settings</h1>
          <p className="text-secondary-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 