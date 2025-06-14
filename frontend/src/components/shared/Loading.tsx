import React from 'react';
import { useApp } from '../../context/AppContext';

interface LoadingProps {
  inline?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ inline = false, size = 'medium', message }) => {
  const { state } = useApp();
  const { loading } = state;

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-12 w-12';
      default:
        return 'h-8 w-8';
    }
  };

  const displayMessage = message || loading.message || 'Loading...';

  if (inline) {
    return (
      <div className="flex items-center space-x-3">
        <div className={`animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 ${getSizeClasses()}`}></div>
        {displayMessage && <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-primary-700 bg-clip-text text-transparent">{displayMessage}</span>}
      </div>
    );
  }

  if (!loading.isLoading && !message) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/20 to-primary-900/20 backdrop-blur-sm">
      <div className="card-glass backdrop-blur-sm border border-white/20 p-8 text-center">
        <div className={`mx-auto animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 ${getSizeClasses()}`}></div>
        <p className="mt-4 text-sm font-medium bg-gradient-to-r from-gray-700 to-primary-700 bg-clip-text text-transparent">{displayMessage}</p>
      </div>
    </div>
  );
};

export default Loading;