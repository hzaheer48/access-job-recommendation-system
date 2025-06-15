import React, { useState } from 'react';
import {
  LoginExample,
  JobsListExample,
  InfiniteJobsExample,
  JobApplicationExample,
  SkillsManagementExample,
  RecommendationsExample
} from './ApiExamples';

const ApiTestPage: React.FC = () => {
  const [activeTest, setActiveTest] = useState<string>('login');

  const tests = [
    { id: 'login', name: 'Authentication Test' },
    { id: 'jobs', name: 'Jobs List Test' },
    { id: 'infinite-jobs', name: 'Infinite Jobs Test' },
    { id: 'application', name: 'Job Application Test' },
    { id: 'skills', name: 'Skills Management Test' },
    { id: 'recommendations', name: 'Recommendations Test' }
  ];

  const renderTest = () => {
    switch (activeTest) {
      case 'login':
        return <LoginExample />;
      case 'jobs':
        return <JobsListExample />;
      case 'infinite-jobs':
        return <InfiniteJobsExample />;
      case 'application':
        return <JobApplicationExample jobId="1" />;
      case 'skills':
        return <SkillsManagementExample />;
      case 'recommendations':
        return <RecommendationsExample />;
      default:
        return <div>Select a test to begin</div>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">API Integration Tests</h1>
      
      <div className="flex space-x-4 mb-8">
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => setActiveTest(test.id)}
            className={`px-4 py-2 rounded ${
              activeTest === test.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {test.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderTest()}
      </div>
    </div>
  );
};

export default ApiTestPage; 