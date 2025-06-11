import React, { useState } from 'react';
import {
  UserIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CogIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [profileData, setProfileData] = useState(() => {
    const fullUser = mockUsers.find(u => u.id === user?.id);
    return fullUser || user;
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
    { id: 'education', name: 'Education', icon: AcademicCapIcon },
    { id: 'skills', name: 'Skills', icon: DocumentTextIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
  ];



  const ProfileOverview = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Basic Information</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingSection('basic')}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              {profileData?.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  {profileData?.firstName?.charAt(0)}{profileData?.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-secondary-200">
              <PencilIcon className="h-4 w-4 text-secondary-600" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              {profileData?.firstName} {profileData?.lastName}
            </h2>
            <p className="text-lg text-secondary-600 mb-4">{profileData?.title || 'Professional Title'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-secondary-600">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                {profileData?.email}
              </div>
              <div className="flex items-center text-secondary-600">
                <PhoneIcon className="h-4 w-4 mr-2" />
                {profileData?.phone || 'Not provided'}
              </div>
              <div className="flex items-center text-secondary-600">
                <MapPinIcon className="h-4 w-4 mr-2" />
                {profileData?.location || 'Not provided'}
              </div>
              <div className="flex items-center text-secondary-600">
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                {profileData?.website || 'Not provided'}
              </div>
            </div>
          </div>
        </div>

        {profileData?.bio && (
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <h4 className="font-medium text-secondary-900 mb-2">About</h4>
            <p className="text-secondary-700 leading-relaxed">{profileData.bio}</p>
          </div>
        )}
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Profile Completion</h3>
          <span className="text-2xl font-bold">75%</span>
        </div>
        <div className="w-full bg-primary-400 rounded-full h-3 mb-4">
          <div className="bg-white h-3 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="space-y-2 text-primary-100">
          <div className="flex items-center justify-between text-sm">
            <span>✓ Basic information</span>
            <span>Complete</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>✓ Skills added</span>
            <span>Complete</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>○ Portfolio/Resume uploaded</span>
            <span>Missing</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ExperienceSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">Work Experience</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingSection('experience')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {profileData?.experience?.map((exp: any, index: number) => (
          <div key={index} className="flex space-x-4 pb-6 border-b border-secondary-200 last:border-b-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BriefcaseIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-secondary-900">{exp.title}</h4>
                  <p className="text-secondary-600">{exp.company}</p>
                  <p className="text-sm text-secondary-500">
                    {exp.startDate} - {exp.endDate || 'Present'} · {exp.location}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-secondary-400 hover:text-secondary-600">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-secondary-400 hover:text-danger-600">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {exp.description && (
                <p className="mt-2 text-secondary-700 text-sm leading-relaxed">
                  {exp.description}
                </p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i} className="text-sm text-secondary-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {(!profileData?.experience || profileData.experience.length === 0) && (
          <div className="text-center py-8">
            <BriefcaseIcon className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-secondary-900 mb-2">No work experience added</h4>
            <p className="text-secondary-600 mb-4">Showcase your professional background to employers</p>
            <Button onClick={() => setEditingSection('experience')}>
              Add Your First Job
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const EducationSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">Education</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingSection('education')}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {profileData?.education?.map((edu: any, index: number) => (
          <div key={index} className="flex space-x-4 pb-6 border-b border-secondary-200 last:border-b-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-secondary-900">{edu.degree}</h4>
                  <p className="text-secondary-600">{edu.institution}</p>
                  <p className="text-sm text-secondary-500">
                    {edu.startDate} - {edu.endDate} · {edu.gpa && `GPA: ${edu.gpa}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-secondary-400 hover:text-secondary-600">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-secondary-400 hover:text-danger-600">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {edu.description && (
                <p className="mt-2 text-secondary-700 text-sm">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}

        {(!profileData?.education || profileData.education.length === 0) && (
          <div className="text-center py-8">
            <AcademicCapIcon className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-secondary-900 mb-2">No education added</h4>
            <p className="text-secondary-600 mb-4">Add your educational background</p>
            <Button onClick={() => setEditingSection('education')}>
              Add Education
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const SkillsSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900">Skills</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingSection('skills')}
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Skills
        </Button>
      </div>

      {profileData?.skills && profileData.skills.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-secondary-900 mb-3">Technical Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.slice(0, 10).map((skill: string, index: number) => (
                <span key={index} className="badge-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-secondary-900 mb-3">Skill Assessment</h4>
            <div className="space-y-3">
              {profileData.skills.slice(0, 5).map((skill: string, index: number) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-700">{skill}</span>
                    <span className="text-secondary-500">{Math.floor(Math.random() * 20) + 80}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <DocumentTextIcon className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-secondary-900 mb-2">No skills added</h4>
          <p className="text-secondary-600 mb-4">Showcase your technical and soft skills</p>
          <Button onClick={() => setEditingSection('skills')}>
            Add Skills
          </Button>
        </div>
      )}
    </div>
  );

  const PreferencesSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Job Preferences</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingSection('preferences')}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-secondary-900 mb-3">Job Types</h4>
            <div className="space-y-2">
              {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked={type === 'Full-time' || type === 'Remote'}
                  />
                  <span className="ml-2 text-sm text-secondary-700">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-secondary-900 mb-3">Salary Expectations</h4>
            <div className="space-y-3">
              <Input
                label="Minimum Salary"
                type="number"
                placeholder="e.g. 80000"
                defaultValue="80000"
              />
              <Input
                label="Maximum Salary"
                type="number"
                placeholder="e.g. 120000"
                defaultValue="120000"
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-secondary-900 mb-3">Preferred Locations</h4>
            <div className="space-y-2">
              <span className="badge-secondary">San Francisco, CA</span>
              <span className="badge-secondary ml-2">Remote</span>
              <span className="badge-secondary ml-2">New York, NY</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-secondary-900 mb-3">Industries</h4>
            <div className="space-y-2">
              <span className="badge-secondary">Technology</span>
              <span className="badge-secondary ml-2">FinTech</span>
              <span className="badge-secondary ml-2">Healthcare</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Notification Settings</h3>
        <div className="space-y-4">
          {[
            { name: 'Email notifications for new job matches', checked: true },
            { name: 'Weekly job recommendation digest', checked: true },
            { name: 'Application status updates', checked: true },
            { name: 'Company messages', checked: false },
            { name: 'Marketing emails', checked: false },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-secondary-700">{setting.name}</span>
              <input
                type="checkbox"
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                defaultChecked={setting.checked}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'preferences':
        return <PreferencesSection />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Profile</h1>
          <p className="text-secondary-600">Manage your professional profile and preferences</p>
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

export default Profile; 