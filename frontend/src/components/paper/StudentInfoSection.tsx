import React from 'react';

export const StudentInfoSection: React.FC = () => {
  return (
    <div className="border border-gray-300 p-4 mb-8 rounded-sm bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-end">
          <span className="font-semibold text-gray-700 mr-2 whitespace-nowrap">Name:</span>
          <div className="flex-1 border-b border-gray-400 h-6"></div>
        </div>
        <div className="flex items-end">
          <span className="font-semibold text-gray-700 mr-2 whitespace-nowrap">Roll No:</span>
          <div className="flex-1 border-b border-gray-400 h-6"></div>
        </div>
        <div className="flex items-end">
          <span className="font-semibold text-gray-700 mr-2 whitespace-nowrap">Section:</span>
          <div className="flex-1 border-b border-gray-400 h-6"></div>
        </div>
      </div>
    </div>
  );
};
