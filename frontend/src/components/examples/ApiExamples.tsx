import React, { useState, useEffect } from 'react';
import {
  useAuth,
  useJobs,
  useApplications,
  useSkills,
  useRecommendations,
  useFetch,
  usePagination
} from '../../services/apiHooks';
import { jobsAPI, authAPI } from '../../services/api';

// Example 1: Authentication Component
export const LoginExample: React.FC = () => {
  const { login, getProfile } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login.execute(credentials);
      console.log('Login successful:', result);
      // Fetch user profile after login
      await getProfile.execute();
    } catch (error) {
      console.error('Login failed:', login.error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={login.loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {login.loading ? 'Logging in...' : 'Login'}
        </button>
        {login.error && (
          <p className="text-red-500 text-sm mt-2">{login.error}</p>
        )}
      </form>
      
      {getProfile.data && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold">Welcome back!</h3>
          <p>Email: {getProfile.data.email}</p>
          <p>Role: {getProfile.data.role}</p>
        </div>
      )}
    </div>
  );
};

// Example 2: Jobs List with Fetch Hook
export const JobsListExample: React.FC = () => {
  const { data: jobs, loading, error, refetch } = useFetch<any[]>(
    () => jobsAPI.getJobs({ page: 1, page_size: 10 })
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={refetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Available Jobs</h2>
        <button
          onClick={refetch}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs?.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 mb-4">{job.location}</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-bold">
                ${job.salary_min} - ${job.salary_max}
              </span>
              <span className="text-sm text-gray-500">{job.job_type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 3: Infinite Scroll Jobs with Pagination Hook
export const InfiniteJobsExample: React.FC = () => {
  const {
    data: jobs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount
  } = usePagination(jobsAPI.getJobs);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          All Jobs ({totalCount} total)
        </h2>
        <button
          onClick={refresh}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-bold">
                  ${job.salary_min} - ${job.salary_max}
                </p>
                <p className="text-sm text-gray-500">{job.job_type}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 line-clamp-3">{job.description}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Jobs'}
          </button>
        </div>
      )}
    </div>
  );
};

// Example 4: Job Application Component
export const JobApplicationExample: React.FC<{ jobId: string }> = ({ jobId }) => {
  const { createApplication } = useApplications();
  const [coverLetter, setCoverLetter] = useState('');
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    try {
      await createApplication.execute({
        job_id: jobId,
        cover_letter: coverLetter,
        status: 'applied'
      });
      setApplied(true);
    } catch (error) {
      console.error('Application failed:', createApplication.error);
    }
  };

  if (applied) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p className="font-bold">Application Submitted!</p>
        <p>Your application has been successfully submitted.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Apply for this Job</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Cover Letter
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Write your cover letter here..."
        />
      </div>

      <button
        onClick={handleApply}
        disabled={createApplication.loading || !coverLetter.trim()}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {createApplication.loading ? 'Submitting...' : 'Submit Application'}
      </button>

      {createApplication.error && (
        <p className="text-red-500 text-sm mt-2">{createApplication.error}</p>
      )}
    </div>
  );
};

// Example 5: Skills Management Component
export const SkillsManagementExample: React.FC = () => {
  const { getUserSkills, addUserSkill, deleteUserSkill } = useSkills();
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'beginner' });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const userSkills = await getUserSkills.execute();
        setSkills(userSkills);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedSkill = await addUserSkill.execute(newSkill);
      setSkills([...skills, addedSkill]);
      setNewSkill({ name: '', proficiency: 'beginner' });
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteUserSkill.execute(skillId);
      setSkills(skills.filter(skill => skill.id !== skillId));
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Manage Your Skills</h3>
      
      {/* Add New Skill Form */}
      <form onSubmit={handleAddSkill} className="mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Proficiency
            </label>
            <select
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={addUserSkill.loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {addUserSkill.loading ? 'Adding...' : 'Add Skill'}
          </button>
        </div>
      </form>

      {/* Skills List */}
      <div className="space-y-2">
        {getUserSkills.loading && <p>Loading skills...</p>}
        {skills.map((skill) => (
          <div key={skill.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{skill.name}</span>
              <span className="ml-2 text-sm text-gray-500">({skill.proficiency})</span>
            </div>
            <button
              onClick={() => handleDeleteSkill(skill.id)}
              disabled={deleteUserSkill.loading}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {addUserSkill.error && (
        <p className="text-red-500 text-sm mt-2">{addUserSkill.error}</p>
      )}
    </div>
  );
};

// Example 6: Recommendations Component
export const RecommendationsExample: React.FC = () => {
  const { getRecommendations, submitFeedback } = useRecommendations();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recs = await getRecommendations.execute();
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);

  const handleFeedback = async (recommendationId: string, feedback: 'positive' | 'negative') => {
    try {
      await submitFeedback.execute({
        recommendation_id: recommendationId,
        feedback_type: feedback
      });
      // Update local state to reflect feedback
      setRecommendations(recommendations.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, user_feedback: feedback }
          : rec
      ));
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Job Recommendations</h2>
      
      {getRecommendations.loading && (
        <div className="text-center">Loading recommendations...</div>
      )}
      
      <div className="space-y-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{rec.job.title}</h3>
                <p className="text-gray-600">{rec.job.company}</p>
                <p className="text-green-600 font-bold">
                  Match Score: {Math.round(rec.match_score * 100)}%
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback(rec.id, 'positive')}
                  disabled={submitFeedback.loading}
                  className={`px-3 py-1 rounded ${
                    rec.user_feedback === 'positive'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 hover:bg-green-100'
                  }`}
                >
                  👍
                </button>
                <button
                  onClick={() => handleFeedback(rec.id, 'negative')}
                  disabled={submitFeedback.loading}
                  className={`px-3 py-1 rounded ${
                    rec.user_feedback === 'negative'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 hover:bg-red-100'
                  }`}
                >
                  👎
                </button>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{rec.job.description}</p>
            
            {rec.explanation && (
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Why this job matches you:</h4>
                <p className="text-sm">{rec.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component that demonstrates all examples
export const ApiExamplesDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState('login');

  const examples = {
    login: { component: <LoginExample />, title: 'Authentication' },
    jobs: { component: <JobsListExample />, title: 'Jobs List' },
    infinite: { component: <InfiniteJobsExample />, title: 'Infinite Scroll' },
    application: { component: <JobApplicationExample jobId="1" />, title: 'Job Application' },
    skills: { component: <SkillsManagementExample />, title: 'Skills Management' },
    recommendations: { component: <RecommendationsExample />, title: 'Recommendations' },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">API Integration Examples</h1>
        
        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(examples).map(([key, { title }]) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              className={`px-4 py-2 rounded-lg ${
                activeExample === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
        
        {/* Active Example */}
        <div className="max-w-4xl mx-auto">
          {examples[activeExample as keyof typeof examples].component}
        </div>
      </div>
    </div>
  );
};