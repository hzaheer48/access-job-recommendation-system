import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { state, logout, showModal } = useApp();
  const { user, isAuthenticated } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout: authLogout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        navDropdownRef.current &&
        !navDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    if (isMenuOpen || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, activeDropdown]);

  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const jobSeekerNavGroups = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z'
          />
        </svg>
      ),
      single: true,
    },
    {
      name: 'Jobs & Applications',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V6m-8 0H8m8 0v10a2 2 0 01-2 2H10a2 2 0 01-2-2V6'
          />
        </svg>
      ),
      items: [
        { name: 'Browse Jobs', path: '/jobs' },
        { name: 'My Applications', path: '/applications' },
        { name: 'Interview Tracking', path: '/interview-tracking' },
        { name: 'Job Alerts', path: '/job-alerts' },
        { name: 'Bookmarks', path: '/bookmarks' },
      ],
    },
    {
      name: 'Career Tools',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
          />
        </svg>
      ),
      items: [{ name: 'Skill Assessment', path: '/skill-assessment' }],
    },
  ];

  const adminNavGroups = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      ),
      single: true,
    },
    {
      name: 'Management',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
          />
        </svg>
      ),
      items: [
        { name: 'Users', path: '/admin/users' },
        { name: 'Jobs', path: '/admin/jobs' },
      ],
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      ),
      single: true,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      ),
      single: true,
    },
  ];

  const navGroups =
    user?.role === 'admin' ? adminNavGroups : jobSeekerNavGroups;

  return (
    <header className='bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link
            to={
              isAuthenticated
                ? user?.role === 'admin'
                  ? '/admin/dashboard'
                  : '/dashboard'
                : '/'
            }
            className='flex items-center group'
          >
            <div className='flex-shrink-0 flex items-center space-x-2'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200'>
                <span className='text-white font-bold text-lg'>A</span>
              </div>
              <h1 className='text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent'>
                AccessJobs
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className='hidden md:flex space-x-1' ref={navDropdownRef}>
              {navGroups.map((group) => (
                <div key={group.name} className='relative'>
                  {group.single ? (
                    <Link
                      to={group.path!}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(group.path!)
                          ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-white/60 backdrop-blur-sm'
                      }`}
                    >
                      {group.icon}
                      <span>{group.name}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === group.name ? null : group.name
                          )
                        }
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          group.items?.some((item) => isActive(item.path))
                            ? 'text-white bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-white/60 backdrop-blur-sm'
                        }`}
                      >
                        {group.icon}
                        <span>{group.name}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === group.name ? 'rotate-180' : ''
                          }`}
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      </button>

                      {activeDropdown === group.name && (
                        <div className='absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl z-50 rounded-xl py-2'>
                          {group.items?.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 ${
                                isActive(item.path)
                                  ? 'text-primary-600 bg-primary-50/50 font-medium'
                                  : 'text-gray-700 hover:text-primary-600 hover:bg-white/50'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* User Menu */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className='flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-xl px-4 py-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200'
                >
                  <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg'>
                    <span className='text-sm font-bold text-white'>
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className='hidden sm:block font-medium'>
                    {user?.firstName} {user?.lastName}
                  </span>
                  <svg
                    className='h-4 w-4 transition-transform duration-200'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    style={{
                      transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className='absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl z-50 rounded-xl'>
                    <div className='py-2'>
                      <div className='px-4 py-3 border-b border-white/10'>
                        <p className='font-semibold text-gray-800'>
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className='text-sm text-gray-600'>{user?.email}</p>
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 mt-1 capitalize'>
                          {user?.role?.replace('_', ' ')}
                        </span>
                      </div>
                      <Link
                        to='/profile'
                        className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-white/50 transition-colors duration-200'
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg
                          className='w-4 h-4 mr-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                          />
                        </svg>
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors duration-200'
                      >
                        <svg
                          className='w-4 h-4 mr-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex space-x-3'>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl text-sm font-medium bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200'
                >
                  Sign in
                </Link>
                <Link
                  to='/register'
                  className='bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-all duration-200'
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='md:hidden p-2 rounded-xl text-gray-700 hover:text-primary-600 bg-white/60 backdrop-blur-sm hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200'
              >
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && isMenuOpen && (
          <div className='md:hidden border-t border-white/20 py-4 bg-white/30 backdrop-blur-sm'>
            <nav className='space-y-3 px-4'>
              {navGroups.map((group) => (
                <div key={group.name}>
                  {group.single ? (
                    <Link
                      to={group.path!}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive(group.path!)
                          ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg'
                          : 'text-gray-700 hover:text-primary-600 bg-white/60 hover:bg-white/80 backdrop-blur-sm'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {group.icon}
                      <span>{group.name}</span>
                    </Link>
                  ) : (
                    <div className='space-y-1'>
                      <div className='flex items-center space-x-3 px-4 py-2 text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                        {group.icon}
                        <span>{group.name}</span>
                      </div>
                      <div className='space-y-1 ml-4'>
                        {group.items?.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                              isActive(item.path)
                                ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg'
                                : 'text-gray-700 hover:text-primary-600 bg-white/60 hover:bg-white/80 backdrop-blur-sm'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
