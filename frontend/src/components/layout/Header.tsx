"use client";

import React from 'react';

import { Bell, ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';


export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Basic title logic based on pathname
  let title = 'Dashboard';
  if (pathname.includes('/assignments')) title = 'Assignments';
  if (pathname.includes('/create')) title = 'Create Assignment';

  return (
    <header className="h-20 bg-[#F5F6F8] flex items-center justify-between px-8 w-full sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        {pathname !== '/' && pathname !== '/assignments' && (
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
            <div className="bg-current rounded-[2px]" />
            <div className="bg-current rounded-[2px]" />
            <div className="bg-current rounded-[2px]" />
            <div className="bg-current rounded-[2px]" />
          </div>
          <span className="text-gray-900 font-semibold text-lg">{title}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#F5F6F8]"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200/50 p-1.5 pr-3 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
             <span className="text-lg">🧑‍💼</span>
          </div>
          <span className="text-sm font-medium text-gray-700">John Doe</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};
