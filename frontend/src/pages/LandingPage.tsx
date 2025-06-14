import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const words = ['Dream Job', 'Perfect Match', 'Career Growth', 'Success'];
  const fullText = 'Find Your ';
  
  useEffect(() => {
    setIsVisible(true);
    
    const typeText = () => {
      const currentWord = words[currentWordIndex];
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= currentWord.length) {
          setTypedText(fullText + currentWord.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            const deleteInterval = setInterval(() => {
              if (currentIndex > fullText.length) {
                setTypedText(fullText + currentWord.slice(0, currentIndex - fullText.length));
                currentIndex--;
              } else {
                clearInterval(deleteInterval);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
              }
            }, 50);
          }, 2000);
        }
      }, 100);
    };
    
    typeText();
  }, [currentWordIndex]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-primary-100/20"></div>
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-primary-400/20 rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-primary-300/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-300/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-300/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className={`sm:text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 mb-6 shadow-lg border border-primary-200/50 backdrop-blur-sm">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  AI-Powered Job Matching
                </div>
                
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="block mb-2">{typedText}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800">
                    <span className="inline-block w-1 h-16 bg-primary-600 ml-1 animate-pulse"></span>
                  </span>
                  <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                    with AI Intelligence
                  </span>
                </h1>
                
                <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 sm:max-w-xl sm:mx-auto lg:mx-0 animate-slide-up" style={{animationDelay: '0.3s'}}>
                  Experience the future of job searching with our revolutionary AI platform. 
                  Get <span className="font-semibold text-primary-600">95% accurate matches</span>, 
                  intelligent resume parsing, and personalized career insights that transform your job hunt.
                </p>
                
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start animate-slide-up space-y-4 sm:space-y-0 sm:space-x-4" style={{animationDelay: '0.5s'}}>
                  <div className="group">
                    <Link
                      to="/register"
                      className="relative w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 md:py-4 md:text-lg md:px-12 transition-all duration-300 hover:shadow-2xl hover:scale-105 transform overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center">
                        Get Started Free
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                  <div className="group">
                    <Link
                      to="/login"
                      className="relative w-full flex items-center justify-center px-8 py-4 border-2 border-primary-200 dark:border-primary-700 text-base font-semibold rounded-xl text-primary-700 dark:text-primary-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-primary-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-12 transition-all duration-300 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600"
                    >
                      <span className="flex items-center">
                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In
                      </span>
                    </Link>
                  </div>
                </div>
                
                {/* Enhanced Stats */}
                <div className="mt-16 grid grid-cols-3 gap-6 sm:gap-8 animate-slide-up" style={{animationDelay: '0.7s'}}>
                  <div className="group text-center p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 group-hover:from-primary-700 group-hover:to-primary-900 transition-all duration-300">
                      10K+
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Active Jobs</div>
                    <div className="w-8 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto mt-2 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                  <div className="group text-center p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-success-600 to-success-800 group-hover:from-success-700 group-hover:to-success-900 transition-all duration-300">
                      95%
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">AI Accuracy</div>
                    <div className="w-8 h-1 bg-gradient-to-r from-success-400 to-success-600 rounded-full mx-auto mt-2 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                  <div className="group text-center p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 group-hover:from-purple-700 group-hover:to-purple-900 transition-all duration-300">
                      5K+
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Success Stories</div>
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mt-2 group-hover:w-12 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Enhanced Hero Visual */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
              {/* Dynamic Background Pattern */}
              <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Interactive Floating Cards */}
              <div className="absolute top-16 right-8 group cursor-pointer">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center animate-pulse-slow hover:scale-110 transition-all duration-300 border border-white/30 shadow-2xl">
                  <svg className="w-12 h-12 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
              </div>
              
              <div className="absolute top-1/3 left-4 group cursor-pointer">
                <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center animate-slide-down hover:scale-110 transition-all duration-300 border border-white/20 shadow-xl" style={{animationDelay: '0.3s'}}>
                  <svg className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8 group cursor-pointer">
                <div className="w-18 h-18 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center animate-slide-up hover:scale-110 transition-all duration-300 border border-white/20 shadow-xl" style={{animationDelay: '0.6s'}}>
                  <svg className="w-8 h-8 text-white group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Central Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">AI Career Assistant</h3>
                  <p className="text-white/90 text-sm mb-4">Powered by Advanced Machine Learning</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
              ✨ Powerful Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4">
              Everything you need for your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800"> job search</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive tools to accelerate your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Recommendations */}
            <div className="group relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI-Powered Recommendations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get personalized job matches with 95% accuracy using advanced machine learning algorithms that understand your unique profile.
                </p>
                <div className="flex items-center text-primary-600 font-medium">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Skill Analysis */}
            <div className="group relative bg-gradient-to-br from-success-50 to-success-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Skill Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Identify skill gaps and get personalized learning paths with curated courses and resources to boost your career prospects.
                </p>
                <div className="flex items-center text-success-600 font-medium">
                  <span>Explore skills</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Application Tracking */}
            <div className="group relative bg-gradient-to-br from-warning-50 to-warning-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Application Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Organize and track all your job applications, interviews, and follow-ups in one comprehensive dashboard.
                </p>
                <div className="flex items-center text-warning-600 font-medium">
                  <span>Track progress</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Resume Parsing */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Resume Parsing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upload your resume and let our AI automatically extract and organize your experience, skills, and education.
                </p>
                <div className="flex items-center text-purple-600 font-medium">
                  <span>Try parser</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Job Alerts */}
            <div className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM4 16l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intelligent Job Alerts</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Set up smart alerts based on your preferences and get notified instantly when matching opportunities arise.
                </p>
                <div className="flex items-center text-indigo-600 font-medium">
                  <span>Set alerts</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Career Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get detailed insights into your job search performance and market trends to optimize your strategy.
                </p>
                <div className="flex items-center text-pink-600 font-medium">
                  <span>View insights</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
              🚀 How It Works
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4">
              Get started in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800"> 3 simple steps</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our streamlined process gets you from signup to your dream job faster than ever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400 z-0"></div>
            
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Create Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up and build your comprehensive profile with our AI-powered resume parser or manual input.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get AI Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI analyzes your profile and preferences to deliver personalized job matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Apply & Track</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Apply to jobs with one click and track your progress through our comprehensive dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-primary-600">Start your job search today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white dark:bg-gray-700 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;