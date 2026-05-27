import React from 'react';
import { DifficultyBadge } from './DifficultyBadge';
import { Question } from '@vedaai/shared';

interface Props {
  question: Question;
}

export const QuestionItem: React.FC<Props> = ({ question }) => {
  return (
    <div className="mb-6 flex gap-4">
      <div className="flex-shrink-0 font-bold text-gray-900 w-6">
        {question.number}.
      </div>
      <div className="flex-1">
        <p className="text-gray-800 text-base mb-2 whitespace-pre-wrap">{question.text}</p>
        <div className="flex items-center gap-3">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">{question.type}</span>
        </div>
      </div>
      <div className="flex-shrink-0 text-sm font-semibold text-gray-700 whitespace-nowrap pt-1">
        [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
      </div>
    </div>
  );
};
