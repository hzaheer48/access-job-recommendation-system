import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}
      {...props}
    />
  );
};

export const CardHeader: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    />
  );
};

export const CardTitle: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}
      {...props}
    />
  );
};

export const CardDescription: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <p
      className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}
      {...props}
    />
  );
};

export const CardContent: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    />
  );
};

export const CardFooter: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    />
  );
}; 