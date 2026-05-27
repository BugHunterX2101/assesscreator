'use client';
import React from 'react';
import { Clock, Book, FileText, Search, Filter } from 'lucide-react';

export default function LibraryPage() {
  const items = [
    { title: 'Midterm Physics Assessment', type: 'Assessment', date: 'Oct 15, 2023', icon: FileText },
    { title: 'History Chapter 4 Quiz', type: 'Quiz', date: 'Sep 28, 2023', icon: Book },
    { title: 'Math Final Exam Template', type: 'Template', date: 'Sep 10, 2023', icon: FileText },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </span>
            <span>My Library</span>
          </h1>
          <p className="text-gray-500 text-lg">Your collection of past assessments and templates.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Filter Library" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
        </div>
        <div className="relative flex-1 max-w-sm sm:ml-auto">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Search Materials" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-400">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
