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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and career preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h2>
            <p className="text-gray-600 mb-2">{personalInfo.email}</p>
            <p className="text-gray-500 mb-4">📍 {personalInfo.location}</p>
            <p className="text-gray-700">{personalInfo.summary}</p>
          </div>
        </div>
      </div>

      {/* Resume Parser - Only show when editing */}
      {isEditing && (
        <ResumeParser onParseComplete={handleResumeParseComplete} />
      )}

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'personal', label: 'Personal Info' },
            { id: 'experience', label: 'Experience' },
            { id: 'education', label: 'Education' },
            { id: 'preferences', label: 'Career Preferences' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
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
  );
};

export default Profile;