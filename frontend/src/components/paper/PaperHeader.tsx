import React from 'react';

interface Props {
  subject: string;
  grade: string;
  totalMarks: number;
}

export const PaperHeader: React.FC<Props> = ({ subject, grade, totalMarks }) => {
  return (
    <div className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
      <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-900 mb-2">VedaAI Academy</h1>
      <div className="flex justify-between items-center text-sm font-semibold text-gray-800 uppercase px-4">
        <span>Subject: {subject}</span>
        <span>Class: {grade}</span>
      </div>
      <div className="flex justify-between items-center text-sm font-semibold text-gray-800 uppercase px-4 mt-1">
        <span>Time Allowed: 2 Hours</span>
        <span>Max Marks: {totalMarks}</span>
      </div>
    </div>
  );
};
