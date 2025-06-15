import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

export const Alert: React.FC<AlertProps> = ({
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    destructive: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  };

  return (
    <div
      className={`p-4 rounded-md ${variants[variant]} ${className}`}
      role="alert"
      {...props}
    />
  );
};

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <p
      className={`text-sm ${className}`}
      {...props}
    />
  );
}; 