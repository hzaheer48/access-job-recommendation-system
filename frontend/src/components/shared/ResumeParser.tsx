import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateApiCall } from '../../services/mockData';
import { ResumeData, Experience, Education } from '../../types';

interface ResumeParserProps {
  onParseComplete: (data: {
    skills: string[];
    experience: Experience[];
    education: Education[];
    summary: string;
  }) => void;
}

const ResumeParser: React.FC<ResumeParserProps> = ({ onParseComplete }) => {
  const { showModal, setLoading } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock resume data for different file types
  const mockResumeData = {
    'john_doe_resume.pdf': {
      skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker'],
      experience: [
        {
          id: 'exp_parsed_1',
          company: 'Tech Solutions Inc.',
          position: 'Senior Frontend Developer',
          description: 'Led development of responsive web applications using React and TypeScript. Collaborated with cross-functional teams to deliver high-quality software solutions. Mentored junior developers and implemented best practices.',
          startDate: '2022-06-01',
          endDate: '2024-01-15',
          location: 'San Francisco, CA',
          skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML']
        },
        {
          id: 'exp_parsed_2',
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          description: 'Developed and maintained web applications using MERN stack. Implemented RESTful APIs and integrated third-party services. Optimized application performance and user experience.',
          startDate: '2020-03-01',
          endDate: '2022-05-31',
          location: 'Remote',
          skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript']
        }
      ],
      education: [
        {
          id: 'edu_parsed_1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016-09-01',
          endDate: '2020-05-15',
          gpa: 3.8
        }
      ],
      summary: 'Experienced full-stack developer with 4+ years of expertise in modern web technologies. Proven track record of delivering scalable applications and leading development teams. Passionate about clean code, user experience, and continuous learning.'
    },
    'jane_smith_resume.pdf': {
      skills: ['Python', 'Django', 'PostgreSQL', 'React', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker', 'Kubernetes'],
      experience: [
        {
          id: 'exp_parsed_3',
          company: 'DataCorp Analytics',
          position: 'Backend Developer',
          description: 'Built scalable backend systems using Python and Django. Designed and optimized database schemas. Implemented data processing pipelines and API integrations.',
          startDate: '2021-08-01',
          endDate: '2024-01-01',
          location: 'New York, NY',
          skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery']
        }
      ],
      education: [
        {
          id: 'edu_parsed_2',
          institution: 'State University',
          degree: 'Master of Science',
          fieldOfStudy: 'Data Science',
          startDate: '2019-09-01',
          endDate: '2021-05-15',
          gpa: 3.9
        }
      ],
      summary: 'Backend developer specializing in Python and data-driven applications. Strong background in machine learning and data analysis with experience in building robust, scalable systems.'
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      showModal({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload a PDF, DOC, DOCX, or TXT file.',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showModal({
        type: 'error',
        title: 'File Too Large',
        message: 'Please upload a file smaller than 5MB.',
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setLoading({ isLoading: true, message: 'Parsing resume and extracting information...' });

    try {
      // Simulate API call for resume parsing
      await simulateApiCall(null, 2500);

      // Get mock data based on filename or use default
      const fileName = file.name.toLowerCase();
      let resumeData;
      
      if (fileName.includes('john') || fileName.includes('doe')) {
        resumeData = mockResumeData['john_doe_resume.pdf'];
      } else if (fileName.includes('jane') || fileName.includes('smith')) {
        resumeData = mockResumeData['jane_smith_resume.pdf'];
      } else {
        // Default mock data for unknown files
        resumeData = {
          skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Git'],
          experience: [
            {
              id: 'exp_default_1',
              company: 'Tech Company',
              position: 'Software Developer',
              description: 'Developed web applications and collaborated with team members.',
              startDate: '2022-01-01',
              endDate: '2023-12-31',
              location: 'City, State',
              skills: ['JavaScript', 'React', 'CSS']
            }
          ],
          education: [
            {
              id: 'edu_default_1',
              institution: 'University',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Computer Science',
              startDate: '2018-09-01',
              endDate: '2022-05-15'
            }
          ],
          summary: 'Motivated software developer with experience in web technologies and a passion for creating innovative solutions.'
        };
      }

      // Call the callback with parsed data
      onParseComplete(resumeData);

      showModal({
        type: 'success',
        title: 'Resume Parsed Successfully',
        message: `Successfully extracted information from ${file.name}. Please review and edit the auto-populated fields as needed.`,
      });

    } catch (error) {
      showModal({
        type: 'error',
        title: 'Parsing Failed',
        message: 'Failed to parse resume. Please try again or enter information manually.',
      });
    } finally {
      setIsProcessing(false);
      setLoading({ isLoading: false });
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Parser</h3>
      <p className="text-gray-600 mb-4">
        Upload your resume to automatically populate your profile with extracted information.
      </p>

      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your resume here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF, DOC, DOCX, and TXT files (max 5MB)
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Choose File
              </span>
            </label>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          
          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                <span className="text-sm text-gray-600">Processing resume...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1">• Supported formats: PDF, DOC, DOCX, TXT</p>
        <p className="mb-1">• Maximum file size: 5MB</p>
        <p>• Your resume data is processed securely and not stored permanently</p>
      </div>
    </div>
  );
};

export default ResumeParser;