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
      <div className="flex items-center space-x-2">
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${getSizeClasses()}`}></div>
        {displayMessage && <span className="text-sm text-gray-600">{displayMessage}</span>}
      </div>
    );
  }

  if (!loading.isLoading && !message) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="text-center">
        <div className={`mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 ${getSizeClasses()}`}></div>
        <p className="mt-2 text-sm text-gray-600">{displayMessage}</p>
      </div>
    </div>
  );
};

export default Loading; 