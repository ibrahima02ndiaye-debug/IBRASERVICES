import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// FIX: Spread additional props to the underlying div to allow for attributes like onClick.
const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden transition-shadow duration-300 hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;