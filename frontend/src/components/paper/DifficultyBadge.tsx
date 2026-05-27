import React from 'react';

interface Props {
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DifficultyBadge: React.FC<Props> = ({ difficulty }) => {
  const getBadgeStyle = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${getBadgeStyle()}`}>
      {difficulty}
    </span>
  );
};
