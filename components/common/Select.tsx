import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, id, children, ...props }, ref) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
      {label}
    </label>
    <select
      id={id}
      ref={ref}
      className="w-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-3 py-2 text-gray-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      {...props}
    >
      {children}
    </select>
  </div>
));

Select.displayName = 'Select';
export default Select;