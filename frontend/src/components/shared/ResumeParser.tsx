import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateApiCall } from '../../services/mockData';
import { parseResumeWithNovitaAI } from '../../services/novitaAI';
import { ResumeData, Experience, Education } from '../../types';

interface ResumeParserProps {
  onParseComplete: (data: {
    skills: string[];
    experience: Experience[];
    education: Education[];
    summary: string;
  }) => void;
}

interface ResumeVersion {
  id: string;
  fileName: string;
  uploadDate: string;
  isCurrent: boolean;
  parsedData?: {
    skills: string[];
    experience: Experience[];
    education: Education[];
    summary: string;
  };
}

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  sections: string[];
}

const ResumeParser: React.FC<ResumeParserProps> = ({ onParseComplete }) => {
  const { showModal, setLoading } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Mock resume templates
  const resumeTemplates: ResumeTemplate[] = [
    {
      id: 'template1',
      name: 'Professional',
      description: 'Clean and professional design suitable for most industries',
      thumbnail: '/templates/professional.png',
      sections: ['Summary', 'Experience', 'Education', 'Skills']
    },
    {
      id: 'template2',
      name: 'Creative',
      description: 'Modern and creative design for creative industries',
      thumbnail: '/templates/creative.png',
      sections: ['Summary', 'Experience', 'Education', 'Skills', 'Projects']
    },
    {
      id: 'template3',
      name: 'Technical',
      description: 'Technical-focused design for IT and engineering roles',
      thumbnail: '/templates/technical.png',
      sections: ['Summary', 'Experience', 'Education', 'Skills', 'Certifications']
    }
  ];

  // Load resume versions on component mount
  useEffect(() => {
    loadResumeVersions();
  }, []);

  const loadResumeVersions = async () => {
    try {
      // In a real app, this would be an API call
      const versions = await simulateApiCall([
        {
          id: 'v1',
          fileName: 'resume_v1.pdf',
          uploadDate: '2024-01-15',
          isCurrent: true
        },
        {
          id: 'v2',
          fileName: 'resume_v2.pdf',
          uploadDate: '2024-02-01',
          isCurrent: false
        }
      ]);
      setResumeVersions(versions);
    } catch (error) {
      console.error('Failed to load resume versions:', error);
    }
  };

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    showModal({
      type: 'success',
      title: 'Template Selected',
      message: `You've selected the ${template.name} template. Your resume will be formatted according to this template.`
    });
  };

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
      // Check if Novita AI API key is available
      const hasApiKey = process.env.REACT_APP_NOVITA_API_KEY;
      
      if (hasApiKey) {
        // Use real AI parsing with Novita AI
        const resumeData = await parseResumeWithNovitaAI(file);
        onParseComplete(resumeData);
        
        showModal({
          type: 'success',
          title: 'Resume Parsed Successfully',
          message: `Successfully extracted information from ${file.name} using AI. Please review and edit the auto-populated fields as needed.`,
        });
        
        // Log if text was truncated (for debugging)
        if (resumeData && file.size > 50000) { // Rough estimate for large files
          console.log('Note: Large resume file may have been truncated to fit AI model limits');
        }
      } else {
        // Fallback to mock data system when API key is not configured
        console.warn('Novita AI API key not configured, falling back to mock data');
        
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
          title: 'Resume Parsed Successfully (Demo Mode)',
          message: `Successfully extracted information from ${file.name} using mock data. To enable AI parsing, configure your Novita AI API key.`,
        });
      }

    } catch (error) {
      console.error('Resume parsing error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to parse resume. Please try again or enter information manually.';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'AI parsing is not configured. Please set up your Novita AI API key or use manual entry.';
        } else if (error.message.includes('extract sufficient text')) {
          errorMessage = 'Unable to extract text from this file. This may happen with scanned PDFs or image-based documents. Please try a text-based PDF or enter information manually.';
        } else if (error.message.includes('Failed to extract text from PDF')) {
          errorMessage = 'PDF parsing failed. This file may be password-protected, corrupted, or contain only images. Please try a different PDF or enter information manually.';
        } else if (error.message.includes('Unsupported file type')) {
          errorMessage = 'This file type is not supported for automatic parsing. Please upload a PDF, DOC, DOCX, or TXT file.';
        } else if (error.message.includes('Novita AI API error')) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later or enter information manually.';
        }
      }
      
      showModal({
        type: 'error',
        title: 'Parsing Failed',
        message: errorMessage,
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">Resume Parser</h3>
        <div className="flex items-center space-x-2">
          {!process.env.REACT_APP_NOVITA_API_KEY && (
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
              Demo Mode
            </span>
          )}
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {selectedTemplate ? `Template: ${selectedTemplate.name}` : 'Select Template'}
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Upload your resume to automatically populate your profile.
      </p>

      {/* Template Selection Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Select Resume Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeTemplates.map(template => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-primary-500"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Resume Versions */}
      {resumeVersions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resume Versions</h4>
          <div className="space-y-2">
            {resumeVersions.map(version => (
              <div
                key={version.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
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
                  <span className="text-sm">{version.fileName}</span>
                  {version.isCurrent && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">Current</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* Handle version restore */}}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => {/* Handle version delete */}}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragOver
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2"
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
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Drop your resume here or click to browse
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              PDF, DOC, DOCX, TXT (max 5MB)
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
              <span className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Choose File
              </span>
            </label>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-red-500 dark:text-red-400 mr-3"
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
                <p className="font-medium text-gray-900 dark:text-white">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
                <span className="text-sm text-gray-600 dark:text-gray-300">Processing resume...</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p>Supported: PDF, DOC, DOCX, TXT (max 5MB) • Data processed securely</p>
      </div>
    </div>
  );
};

export default ResumeParser;