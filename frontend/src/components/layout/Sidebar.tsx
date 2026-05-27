import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, FileText, Sparkles, Clock, Settings, Plus } from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
  { name: 'Home', href: '/', icon: LayoutGrid },
  { name: 'My Groups', href: '/groups', icon: Users },
  { name: 'Assignments', href: '/assignments', icon: FileText },
  { name: 'AI Teacher\'s Toolkit', href: '/toolkit', icon: Sparkles },
  { name: 'My Library', href: '/library', icon: Clock },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-[280px] bg-white h-screen flex flex-col border-r border-gray-100 hidden md:flex rounded-r-3xl m-4 shadow-sm overflow-hidden z-10 sticky top-0">
      <div className="p-6 pb-4">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            VedaAI
          </span>
        </div>

        {/* Create Button */}
        <Link 
          href="/create"
          className="w-full bg-[#2A2B2D] hover:bg-black text-white rounded-full py-3 px-4 flex items-center justify-center space-x-2 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] border border-gray-700/50 mb-8"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="font-medium text-sm tracking-wide">Create Assignment</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-gray-100 text-gray-900 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
              <span className="text-sm">{item.name}</span>
              {item.name === 'Assignments' && (
                <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  10
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-2">
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-sm">Settings</span>
        </Link>
        
        <div className="flex items-center p-3 space-x-3 rounded-2xl bg-gray-50/80 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-xl">👨‍🏫</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">Delhi Public School</p>
            <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  );
};
