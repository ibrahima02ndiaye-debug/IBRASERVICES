
import React from 'react';
import Card from './Card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <Card className="text-center p-8 md:p-12">
      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-blue-500">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-950 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {message}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
};

export default EmptyState;
