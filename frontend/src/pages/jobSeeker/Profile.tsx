import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateApiCall, mockUserProfile } from '../../services/mockData';
import { UserProfile, Experience, Education, JobType, ExperienceLevel } from '../../types';
import Loading from '../../components/shared/Loading';
import ResumeParser from '../../components/shared/ResumeParser';

const Profile: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'preferences'>('personal');
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    location: '',
    summary: '',
    skills: [] as string[]
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [preferences, setPreferences] = useState({
    desiredPositions: [] as string[],
    preferredLocations: [] as string[],
    salaryMin: 0,
    salaryMax: 0,
    jobTypes: [] as JobType[],
    industries: [] as string[],
    workArrangement: 'any' as 'remote' | 'hybrid' | 'onsite' | 'any'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 600);
      
      // Use the user's actual profile data if available, otherwise create empty profile for new users
      const userProfile = user?.profile;
      const profileData = userProfile ? {
        ...userProfile,
        userId: user?.id || '1'
      } : {
        // Create empty profile template for new users
        id: user?.id || '1',
        userId: user?.id || '1',
        skills: [],
        education: [],
        experience: [],
        careerPreferences: {
          desiredPositions: [],
          preferredLocations: [],
          salaryRange: {
            min: 0,
            max: 0
          },
          jobTypes: [],
          industries: [],
          workArrangement: 'any' as 'remote' | 'hybrid' | 'onsite' | 'any'
        },
        location: '',
        summary: '',
        updatedAt: new Date().toISOString()
      };
      
      setProfile(profileData);
      setPersonalInfo({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        location: profileData.location,
        summary: profileData.summary,
        skills: profileData.skills
      });
      setExperiences(profileData.experience);
      setEducation(profileData.education);
      setPreferences({
        desiredPositions: profileData.careerPreferences.desiredPositions,
        preferredLocations: profileData.careerPreferences.preferredLocations,
        salaryMin: profileData.careerPreferences.salaryRange.min,
        salaryMax: profileData.careerPreferences.salaryRange.max,
        jobTypes: profileData.careerPreferences.jobTypes,
        industries: profileData.careerPreferences.industries,
        workArrangement: profileData.careerPreferences.workArrangement
      });
      
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading({ isLoading: true, message: 'Saving profile...' });
    
    try {
      await simulateApiCall(null, 1000);
      
      setIsEditing(false);
      showModal({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile',
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !personalInfo.skills.includes(newSkill.trim())) {
      setPersonalInfo(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      skills: []
    };
    setExperiences(prev => [...prev, newExperience]);
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const handleResumeParseComplete = (parsedData: {
    skills: string[];
    experience: Experience[];
    education: Education[];
    summary: string;
  }) => {
    // Update personal info with parsed data
    setPersonalInfo(prev => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, ...parsedData.skills])), // Merge and deduplicate skills
      summary: parsedData.summary || prev.summary
    }));

    // Update experiences with parsed data
    setExperiences(prev => {
      const existingIds = new Set(prev.map(exp => exp.id));
      const newExperiences = parsedData.experience.filter(exp => !existingIds.has(exp.id));
      return [...prev, ...newExperiences];
    });

    // Update education with parsed data
    setEducation(prev => {
      const existingIds = new Set(prev.map(edu => edu.id));
      const newEducation = parsedData.education.filter(edu => !existingIds.has(edu.id));
      return [...prev, ...newEducation];
    });

    // Automatically switch to editing mode so user can review
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading inline message="Loading your profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="card-glass backdrop-blur-sm border border-white/20 mb-8">
          <div className="px-6 py-6 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage your professional information and career preferences
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        {profile && (
          <div className="card-glass backdrop-blur-sm border border-white/20 mb-6">
            <div className="px-6 py-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 bg-clip-text text-transparent">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h2>
                  <p className="text-gray-600 mt-1">{personalInfo.email}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {personalInfo.location || 'Location not specified'}
                  </div>
                  {personalInfo.summary && (
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-2">{personalInfo.summary}</p>
                  )}
                  {/* Skills Preview */}
                  {personalInfo.skills.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {personalInfo.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {personalInfo.skills.length > 4 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{personalInfo.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-xs font-medium text-gray-600 mb-1">Profile Completion</div>
                  <div className="relative w-12 h-12 mx-auto sm:mx-0">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-primary-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resume Parser - Only show when editing */}
        {isEditing && (
          <div className="mb-6">
            <ResumeParser onParseComplete={handleResumeParseComplete} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="card-glass backdrop-blur-sm border border-white/20 mb-6">
          <div className="px-6 py-3">
            <nav className="flex space-x-1">
              {[
                { id: 'personal', label: 'Personal Info', icon: '👤' },
                { id: 'experience', label: 'Experience', icon: '💼' },
                { id: 'education', label: 'Education', icon: '🎓' },
                { id: 'preferences', label: 'Career Preferences', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span className="mr-1.5 text-sm">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card-glass backdrop-blur-sm border border-white/20">
        {activeTab === 'personal' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="City, State or Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, summary: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about yourself, your experience, and career goals..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
              />
            </div>
            
            {/* Skills */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              
              {isEditing && (
                <div className="flex mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {personalInfo.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
              {isEditing && (
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add Experience
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                  {isEditing && (
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate ? exp.startDate.substring(0, 7) : ''}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value + '-01')}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate ? exp.endDate.substring(0, 7) : ''}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value + '-01')}
                        disabled={!isEditing}
                        placeholder="Leave blank if current"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              ))}
              
              {experiences.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No work experience added yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Education</h3>
            
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GPA
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="4.0"
                        value={edu.gpa || ''}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Career Preferences</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    value={preferences.salaryMin}
                    onChange={(e) => setPreferences(prev => ({ ...prev, salaryMin: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    value={preferences.salaryMax}
                    onChange={(e) => setPreferences(prev => ({ ...prev, salaryMax: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Arrangement
                </label>
                <select
                  value={preferences.workArrangement}
                  onChange={(e) => setPreferences(prev => ({ ...prev, workArrangement: e.target.value as any }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                >
                  <option value="any">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Positions
                </label>
                <div className="flex flex-wrap gap-2">
                  {preferences.desiredPositions.map((position) => (
                    <span
                      key={position}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Industries
                </label>
                <div className="flex flex-wrap gap-2">
                  {preferences.industries.map((industry) => (
                    <span
                      key={industry}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Profile;