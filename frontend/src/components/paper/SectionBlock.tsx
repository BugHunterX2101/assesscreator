import React from 'react';
import { Section } from '@vedaai/shared';
import { QuestionItem } from './QuestionItem';

interface Props {
  section: Section;
}

export const SectionBlock: React.FC<Props> = ({ section }) => {
  return (
    <div className="mb-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1 border-b border-gray-300 pb-2 uppercase tracking-wide">
          Section {section.id} — {section.title}
        </h2>
        {section.instruction && (
          <p className="text-sm font-medium text-gray-600 italic">Instruction: {section.instruction}</p>
        )}
      </div>
      
      <div>
        {section.questions.map((question) => (
          <QuestionItem key={question.number} question={question} />
        ))}
      </div>
    </div>
  );
};
