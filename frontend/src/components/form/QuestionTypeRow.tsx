import React from 'react';

interface QuestionTypeRowProps {
  index: number;
  config: {
    type: string;
    count: number;
    marksEach: number;
  };
  onChange: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
}

const QUESTION_TYPES = [
  { value: 'MultipleChoice', label: 'Multiple Choice Questions' },
  { value: 'ShortAnswer', label: 'Short Questions' },
  { value: 'LongAnswer', label: 'Long Answer Questions' },
  { value: 'TrueFalse', label: 'True / False Questions' },
  { value: 'DiagramBased', label: 'Diagram/Graph-Based Questions' },
  { value: 'Numerical', label: 'Numerical Problems' }
];

export const QuestionTypeRow: React.FC<QuestionTypeRowProps> = ({ index, config, onChange, onRemove }) => {
  
  const handleCountChange = (delta: number) => {
    const newVal = Math.max(1, config.count + delta);
    onChange(index, 'count', newVal);
  };

  const handleMarksChange = (delta: number) => {
    const newVal = Math.max(1, config.marksEach + delta);
    onChange(index, 'marksEach', newVal);
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
      <div className="flex-1 relative">
        <select
          value={config.type}
          onChange={(e) => onChange(index, 'type', e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-full px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 pr-10"
        >
          {QUESTION_TYPES.map(qt => (
            <option key={qt.value} value={qt.value}>{qt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={() => onRemove(index)}
        className="text-gray-400 hover:text-gray-600 font-medium px-2"
      >
        ×
      </button>

      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm h-10 w-28">
          <button type="button" onClick={() => handleCountChange(-1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-600">−</button>
          <span className="flex-1 text-center text-sm font-bold text-gray-900">{config.count}</span>
          <button type="button" onClick={() => handleCountChange(1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-600">+</button>
        </div>

        <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm h-10 w-28">
          <button type="button" onClick={() => handleMarksChange(-1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-600">−</button>
          <span className="flex-1 text-center text-sm font-bold text-gray-900">{config.marksEach}</span>
          <button type="button" onClick={() => handleMarksChange(1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-600">+</button>
        </div>
      </div>
    </div>
  );
};
