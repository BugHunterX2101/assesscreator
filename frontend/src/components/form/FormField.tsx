import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, as = 'input', options, className, ...props }) => {
  const baseClasses = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500";
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {as === 'input' && (
        <input className={`${baseClasses} ${className}`} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {as === 'textarea' && (
        <textarea className={`${baseClasses} ${className}`} rows={4} {...(props as React.InputHTMLAttributes<HTMLTextAreaElement>)} />
      )}
      {as === 'select' && (
        <select className={`${baseClasses} ${className}`} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          <option value="" disabled>Select an option</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
