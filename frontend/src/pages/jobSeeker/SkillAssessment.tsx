import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  simulateApiCall, 
  mockAvailableSkills, 
  mockLearningPaths, 
  mockSkillAssessmentQuestions, 
  mockAssessmentResults,
  mockSkillGapAnalysis 
} from '../../services/mockData';
import { SkillGapAnalysis, SkillGap, LearningPath, LearningResource } from '../../types';
import Loading from '../../components/shared/Loading';

interface SkillAssessmentQuestion {
  id: string;
  skill: string;
  question: string;
  type: 'multiple-choice' | 'coding' | 'scenario';
  options?: string[];
  correctAnswer?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number; // in minutes
}

interface AssessmentResult {
  id: string;
  skill: string;
  score: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  completedAt: string;
  timeSpent: number; // in minutes
  questionsAnswered: number;
  totalQuestions: number;
  strengths: string[];
  weaknesses: string[];
}

interface SkillAssessmentState {
  currentAssessment: SkillAssessmentQuestion[] | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  isActive: boolean;
  selectedSkill: string;
}

const SkillAssessment: React.FC = () => {
  const { state, setLoading, showModal } = useApp();
  const { user, loading } = state;
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'results' | 'learning'>('overview');
  const [assessment, setAssessment] = useState<SkillAssessmentState>({
    currentAssessment: null,
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 0,
    isActive: false,
    selectedSkill: ''
  });
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (assessment.isActive && assessment.timeRemaining > 0) {
      interval = setInterval(() => {
        setAssessment(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (assessment.isActive && assessment.timeRemaining === 0) {
      finishAssessment();
    }
    return () => clearInterval(interval);
  }, [assessment.isActive, assessment.timeRemaining]);

  const loadData = async () => {
    setLoading({ isLoading: true, message: 'Loading skill assessment data...' });
    
    try {
      await simulateApiCall(null, 1000);
      
      // Use centralized mock data
      const skills = mockAvailableSkills;
      
      // Use centralized mock skill gap analysis
      const mockSkillGap = {
        ...mockSkillGapAnalysis,
        userId: user?.id || ''
      };
      
      // Use centralized mock assessment results
      const mockResults = mockAssessmentResults;
      
      setAvailableSkills(skills);
      setSkillGapAnalysis(mockSkillGap);
      setAssessmentResults(mockResults);
      setLearningPaths(mockLearningPaths);
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to load skill assessment data'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const startAssessment = async (skill: string) => {
    setLoading({ isLoading: true, message: 'Preparing assessment...' });
    
    try {
      await simulateApiCall(null, 500);
      
      // Use centralized mock assessment questions
      const mockQuestions = mockSkillAssessmentQuestions;
      
      const totalTime = mockQuestions.reduce((sum, q) => sum + q.timeLimit, 0) * 60; // Convert to seconds
      
      setAssessment({
        currentAssessment: mockQuestions,
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: totalTime,
        isActive: true,
        selectedSkill: skill
      });
      
      setActiveTab('assessment');
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to start assessment'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const answerQuestion = (answer: string) => {
    if (!assessment.currentAssessment) return;
    
    const currentQuestion = assessment.currentAssessment[assessment.currentQuestionIndex];
    setAssessment(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer
      }
    }));
  };

  const nextQuestion = () => {
    if (!assessment.currentAssessment) return;
    
    if (assessment.currentQuestionIndex < assessment.currentAssessment.length - 1) {
      setAssessment(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = async () => {
    if (!assessment.currentAssessment) return;
    
    setLoading({ isLoading: true, message: 'Calculating results...' });
    
    try {
      await simulateApiCall(null, 1000);
      
      // Calculate score (mock calculation)
      const totalQuestions = assessment.currentAssessment.length;
      const answeredQuestions = Object.keys(assessment.answers).length;
      const score = Math.floor((answeredQuestions / totalQuestions) * 85 + Math.random() * 15);
      
      const result: AssessmentResult = {
        id: Date.now().toString(),
        skill: assessment.selectedSkill,
        score,
        level: score >= 80 ? 'advanced' : score >= 60 ? 'intermediate' : 'beginner',
        completedAt: new Date().toISOString(),
        timeSpent: Math.floor((assessment.currentAssessment.reduce((sum, q) => sum + q.timeLimit, 0) * 60 - assessment.timeRemaining) / 60),
        questionsAnswered: answeredQuestions,
        totalQuestions,
        strengths: ['Core Concepts', 'Best Practices'],
        weaknesses: ['Advanced Features', 'Performance']
      };
      
      setAssessmentResults(prev => [result, ...prev]);
      setAssessment({
        currentAssessment: null,
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 0,
        isActive: false,
        selectedSkill: ''
      });
      
      setActiveTab('results');
      
      showModal({
        type: 'success',
        title: 'Assessment Complete',
        message: `You scored ${score}% on the ${assessment.selectedSkill} assessment!`
      });
    } catch (error) {
      showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to complete assessment'
      });
    } finally {
      setLoading({ isLoading: false });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="card-glass backdrop-blur-sm border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <Loading inline message={loading.message} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-primary-800 bg-clip-text text-transparent">
                Skill Assessment
              </h1>
              <p className="text-lg text-gray-600 mt-1">Evaluate your skills and identify areas for improvement</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="card-glass backdrop-blur-sm border border-white/20 p-2">
            <nav className="flex space-x-2">
              {[
                { key: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { key: 'assessment', label: 'Take Assessment', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { key: 'results', label: 'Results', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { key: 'learning', label: 'Learning Paths', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-white/50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Skill Gap Analysis */}
          {skillGapAnalysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Skill Gap Analysis</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Skill Gaps for {skillGapAnalysis.targetRole}</span>
                  <span className="text-lg font-bold text-blue-600">
                    {skillGapAnalysis.skillGaps.length} gaps identified
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, 100 - (skillGapAnalysis.skillGaps.length * 20))}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillGapAnalysis.skillGaps && Array.isArray(skillGapAnalysis.skillGaps) && skillGapAnalysis.skillGaps.map((gap, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{gap.skill}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${gap.importance === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {gap.importance}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Learning Time: <span className="font-medium">{gap.estimatedLearningTime}</span></p>
                    </div>
                  </div>
                ))}
              </div>
              

            </div>
          )}

          {/* Recent Assessment Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Assessment Results</h2>
            {assessmentResults.length === 0 ? (
              <p className="text-gray-500">No assessments completed yet. Take your first assessment to get started!</p>
            ) : (
              <div className="space-y-4">
                {assessmentResults.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{result.skill}</h3>
                      <p className="text-sm text-gray-600">
                        Completed {new Date(result.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(result.level)}`}>
                        {result.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {!assessment.isActive ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Choose a Skill to Assess</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSkills && Array.isArray(availableSkills) && availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => startAssessment(skill)}
                    className="p-4 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                  >
                    <h3 className="font-medium mb-2">{skill}</h3>
                    <p className="text-sm text-gray-600">~15-20 questions • 30-45 minutes</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              {/* Assessment Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{assessment.selectedSkill} Assessment</h2>
                  <p className="text-sm text-gray-600">
                    Question {assessment.currentQuestionIndex + 1} of {assessment.currentAssessment?.length}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {formatTime(assessment.timeRemaining)}
                  </div>
                  <p className="text-sm text-gray-600">Time remaining</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((assessment.currentQuestionIndex + 1) / (assessment.currentAssessment?.length || 1)) * 100}%` 
                  }}
                />
              </div>

              {/* Current Question */}
              {assessment.currentAssessment && (
                <div className="space-y-6">
                  {assessment.currentAssessment && assessment.currentAssessment[assessment.currentQuestionIndex] && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assessment.currentAssessment[assessment.currentQuestionIndex]?.difficulty === 'advanced' 
                            ? 'bg-red-100 text-red-800'
                            : assessment.currentAssessment[assessment.currentQuestionIndex]?.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {assessment.currentAssessment[assessment.currentQuestionIndex]?.difficulty}
                        </span>
                        <span className="text-sm text-gray-600">
                          Time Limit: {assessment.currentAssessment[assessment.currentQuestionIndex]?.timeLimit} min
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-4">
                        {assessment.currentAssessment[assessment.currentQuestionIndex]?.question}
                      </h3>
                    </div>
                  )}

                  {/* Question Content */}
                  {assessment.currentAssessment && assessment.currentAssessment[assessment.currentQuestionIndex]?.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      {assessment.currentAssessment[assessment.currentQuestionIndex]?.options && Array.isArray(assessment.currentAssessment[assessment.currentQuestionIndex]?.options) && assessment.currentAssessment[assessment.currentQuestionIndex]?.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => answerQuestion(option)}
                          className={`w-full p-4 text-left border rounded-lg transition-colors ${
                            assessment.answers[assessment.currentAssessment![assessment.currentQuestionIndex]?.id || ''] === option
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {assessment.currentAssessment && assessment.currentAssessment[assessment.currentQuestionIndex]?.type === 'scenario' && (
                    <div>
                      <textarea
                        value={assessment.answers[assessment.currentAssessment[assessment.currentQuestionIndex]?.id || ''] || ''}
                        onChange={(e) => answerQuestion(e.target.value)}
                        placeholder="Describe your approach to this scenario..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}

                  {assessment.currentAssessment && assessment.currentAssessment[assessment.currentQuestionIndex]?.type === 'coding' && (
                    <div>
                      <textarea
                        value={assessment.answers[assessment.currentAssessment[assessment.currentQuestionIndex]?.id || ''] || ''}
                        onChange={(e) => answerQuestion(e.target.value)}
                        placeholder="Write your code here..."
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                      />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setAssessment(prev => ({
                        ...prev,
                        currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1)
                      }))}
                      disabled={assessment.currentQuestionIndex === 0}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextQuestion}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      {assessment.currentQuestionIndex === assessment.currentAssessment.length - 1 ? 'Finish' : 'Next'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {assessmentResults.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Results</h3>
              <p className="text-gray-500 mb-4">Take your first assessment to see your results here</p>
              <button
                onClick={() => setActiveTab('assessment')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Take Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
                {assessmentResults && Array.isArray(assessmentResults) && assessmentResults.map((result) => (
                <div key={result.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{result.skill} Assessment</h3>
                      <p className="text-sm text-gray-600">
                        Completed on {new Date(result.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(result.level)}`}>
                        {result.level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold">{result.timeSpent}</div>
                      <div className="text-sm text-gray-600">Minutes</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold">{result.questionsAnswered}/{result.totalQuestions}</div>
                      <div className="text-sm text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold">{Math.round((result.questionsAnswered / result.totalQuestions) * 100)}%</div>
                      <div className="text-sm text-gray-600">Completion</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {result.strengths && Array.isArray(result.strengths) && result.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {result.weaknesses && Array.isArray(result.weaknesses) && result.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-gray-600">• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Learning Paths Tab */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          {learningPaths.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Paths Available</h3>
              <p className="text-gray-500">Complete skill assessments to get personalized learning recommendations</p>
            </div>
          ) : (
            <div className="space-y-6">
              {learningPaths && Array.isArray(learningPaths) && learningPaths.map((path, pathIndex) => (
                <div key={pathIndex} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{path.skill} Learning Path</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Skill: <strong>{path.skill}</strong></span>
                      </div>
                    </div>
                  </div>



                  <div>
                    <h4 className="font-medium mb-3">Learning Resources</h4>
                    <div className="space-y-3">
                      {path.resources && Array.isArray(path.resources) && path.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h5 className="font-medium">{resource.title}</h5>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="capitalize">{resource.type}</span>
                              <span>•</span>
                              <span>{resource.duration} hours</span>
                              <span>•</span>
                              <span>{resource.provider}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(resource.difficulty)}`}>
                                {resource.difficulty}
                              </span>
                            </div>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
                          >
                            Start
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default SkillAssessment;