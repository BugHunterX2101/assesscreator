import React from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, as = 'input', options, className, ...props }) => {
  const inputClasses = `
    block w-full text-sm font-semibold text-gray-900 placeholder-gray-400
    ${as === 'select' ? 'h-12 px-4' : 'h-12 px-4'}
    bg-gray-50/50 border ${error ? 'border-red-300' : 'border-gray-200'}
    rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
    transition-colors ${className || ''}
  `;

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        {as === 'select' ? (
          <select className={inputClasses} {...(props as any)}>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : as === 'textarea' ? (
          <textarea className={`${inputClasses} py-3 h-auto min-h-[100px]`} {...(props as any)} />
        ) : (
          <input className={inputClasses} {...(props as any)} />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};
