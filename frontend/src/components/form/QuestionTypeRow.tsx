import React from 'react';
import { FormField } from './FormField';
import { QuestionTypeConfig } from '@vedaai/shared';

interface Props {
  index: number;
  config: QuestionTypeConfig;
  onChange: (index: number, field: keyof QuestionTypeConfig, value: any) => void;
  onRemove: (index: number) => void;
}

export const QuestionTypeRow: React.FC<Props> = ({ index, config, onChange, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex-1 w-full">
        <FormField
          label="Question Type"
          as="select"
          value={config.type}
          onChange={(e) => onChange(index, 'type', e.target.value)}
          options={[
            { value: 'MCQ', label: 'Multiple Choice (MCQ)' },
            { value: 'ShortAnswer', label: 'Short Answer' },
            { value: 'LongAnswer', label: 'Long Answer' },
            { value: 'TrueFalse', label: 'True / False' },
            { value: 'FillBlank', label: 'Fill in the Blank' }
          ]}
        />
      </div>
      <div className="w-full sm:w-32">
        <FormField
          label="Count"
          type="number"
          min="1"
          value={config.count}
          onChange={(e) => onChange(index, 'count', parseInt(e.target.value))}
        />
      </div>
      <div className="w-full sm:w-32">
        <FormField
          label="Marks Each"
          type="number"
          min="1"
          value={config.marksEach}
          onChange={(e) => onChange(index, 'marksEach', parseInt(e.target.value))}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mb-4 text-red-500 hover:text-red-700 p-2"
        title="Remove"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
