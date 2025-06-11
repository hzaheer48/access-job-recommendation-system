import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockSkillAnalysis, simulateApiCall } from '../../services/mockData';
import { SkillGapAnalysis, LearningPath } from '../../types';
import Loading from '../../components/shared/Loading';

const SkillsAnalysis: React.FC = () => {
  const { state, showModal, setLoading } = useApp();
  const { user } = state;
  
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadSkillAnalysis();
  }, []);

  const loadSkillAnalysis = async () => {
    setIsLoading(true);
    try {
      await simulateApiCall(null, 800);
      setAnalysis(mockSkillAnalysis);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load skills analysis',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalysis = async () => {
    setIsGenerating(true);
    setLoading({ isLoading: true, message: 'Analyzing skills and generating recommendations...' });
    
    try {
      await simulateApiCall(null, 2000);
      
      const newAnalysis: SkillGapAnalysis = {
        ...mockSkillAnalysis,
        targetRole: selectedRole,
        generatedAt: new Date().toISOString()
      };
      
      setAnalysis(newAnalysis);
      
      showModal({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your skills analysis has been updated with new recommendations.',
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to generate analysis',
      });
    } finally {
      setIsGenerating(false);
      setLoading({ isLoading: false });
    }
  };

  const getSkillMatchPercentage = () => {
    if (!analysis) return 0;
    const total = analysis.currentSkills.length + analysis.skillGaps.length;
    return total > 0 ? Math.round((analysis.currentSkills.length / total) * 100) : 0;
  };

  const getPriorityColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'important':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'nice-to-have':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading inline message="Loading skills analysis..." />
      </div>
    );
  }

  const skillMatchPercentage = getSkillMatchPercentage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Skills Analysis</h1>
        <p className="text-gray-600">Understand your skill gaps and get personalized learning recommendations</p>
      </div>

      {/* Generate New Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Analysis for Target Role</h2>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
            </select>
          </div>
          <button
            onClick={generateAnalysis}
            disabled={isGenerating}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-md font-medium"
          >
            {isGenerating ? 'Analyzing...' : 'Analyze Skills'}
          </button>
        </div>
      </div>

      {analysis && (
        <>
          {/* Analysis Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Skills Match</p>
                  <p className="text-2xl font-semibold text-gray-900">{skillMatchPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">📚</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Skills to Learn</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.skillGaps.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">🎯</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Target Role</p>
                  <p className="text-lg font-semibold text-gray-900">{analysis.targetRole}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Skills */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills to Develop</h3>
            <div className="space-y-4">
              {analysis.skillGaps.map((gap, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getPriorityColor(gap.importance)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{gap.skill}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                        {gap.importance}
                      </span>
                      <span className="text-xs text-gray-600">
                        ⏱️ {gap.estimatedLearningTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm opacity-80">
                    Priority: {gap.importance.charAt(0).toUpperCase() + gap.importance.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recommended Learning Paths</h3>
            <div className="space-y-8">
              {analysis.learningPaths.map((path, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">{path.skill}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {path.resources.map((resource, resourceIndex) => (
                      <div
                        key={resourceIndex}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900 text-sm">{resource.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            resource.cost === 'free' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {resource.cost}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          <div className="flex items-center justify-between">
                            <span>{resource.provider}</span>
                            <span className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </span>
                          </div>
                          <div className="mt-1">
                            ⏱️ {resource.duration} • 📚 {resource.type}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => window.open(resource.url, '_blank')}
                          className="w-full mt-3 px-3 py-2 text-xs font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                        >
                          Start Learning
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Metadata */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Analysis generated on {new Date(analysis.generatedAt).toLocaleString()}
          </div>
        </>
      )}

      {!analysis && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No analysis available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Generate your first skills analysis to get personalized learning recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsAnalysis; 