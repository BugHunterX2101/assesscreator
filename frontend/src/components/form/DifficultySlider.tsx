import React from 'react';
import { DifficultyConfig } from '@vedaai/shared';

interface Props {
  difficulty: DifficultyConfig;
  onChange: (difficulty: DifficultyConfig) => void;
  error?: string;
}

export const DifficultySlider: React.FC<Props> = ({ difficulty, onChange, error }) => {
  const handleChange = (field: keyof DifficultyConfig, value: string) => {
    const num = parseInt(value) || 0;
    const newDiff = { ...difficulty, [field]: num };
    
    // Auto-balance logic (simple version)
    if (field === 'easy') {
      newDiff.medium = Math.max(0, 100 - newDiff.easy - newDiff.hard);
    } else if (field === 'medium') {
      newDiff.hard = Math.max(0, 100 - newDiff.easy - newDiff.medium);
    } else if (field === 'hard') {
      newDiff.easy = Math.max(0, 100 - newDiff.medium - newDiff.hard);
    }
    
    onChange(newDiff);
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Difficulty Distribution (%)
      </label>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-green-600 font-semibold mb-1">Easy</label>
          <input 
            type="number" 
            min="0" max="100" 
            value={difficulty.easy}
            onChange={(e) => handleChange('easy', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs text-yellow-600 font-semibold mb-1">Medium</label>
          <input 
            type="number" 
            min="0" max="100" 
            value={difficulty.medium}
            onChange={(e) => handleChange('medium', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-xs text-red-600 font-semibold mb-1">Hard</label>
          <input 
            type="number" 
            min="0" max="100" 
            value={difficulty.hard}
            onChange={(e) => handleChange('hard', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div className="mt-4 flex h-3 w-full rounded-full overflow-hidden bg-gray-200">
        <div style={{ width: `${difficulty.easy}%` }} className="bg-green-500 h-full" />
        <div style={{ width: `${difficulty.medium}%` }} className="bg-yellow-500 h-full" />
        <div style={{ width: `${difficulty.hard}%` }} className="bg-red-500 h-full" />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {(difficulty.easy + difficulty.medium + difficulty.hard) !== 100 && (
        <p className="mt-2 text-sm text-amber-600">Total must equal 100%. Currently: {difficulty.easy + difficulty.medium + difficulty.hard}%</p>
      )}
    </div>
  );
};
