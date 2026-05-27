import React from 'react';
import { Download } from 'lucide-react';

interface ActionBarProps {
  assignmentId: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({ assignmentId }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#2A2B2D] text-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden mx-8 mt-6">
      <div className="max-w-3xl">
         <p className="text-[15px] font-medium leading-relaxed opacity-90">
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade {assignmentId ? '8' : ''} Science classes on the NCERT chapters:
         </p>
      </div>
      <button 
        onClick={handlePrint}
        className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full text-sm font-bold flex items-center transition-colors shadow-sm shrink-0"
      >
        <Download className="w-4 h-4 mr-2" />
        Download as PDF
      </button>
    </div>
  );
};
