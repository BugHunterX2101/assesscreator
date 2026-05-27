import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, Clock, Sparkles } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { name: 'Home', href: '/', icon: LayoutGrid },
  { name: 'Assignments', href: '/assignments', icon: FileText },
  { name: 'Library', href: '/library', icon: Clock },
  { name: 'AI Toolkit', href: '/toolkit', icon: Sparkles },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#2A2B2D] md:bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#F5F6F8] md:rounded-l-[2.5rem] overflow-hidden md:my-2 md:mr-2 shadow-2xl relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A] rounded-t-3xl px-6 py-4 flex justify-between items-center z-50">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Floating Action Button for Create (Mobile) */}
        <Link 
          href="/create"
          className="absolute -top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-lg border border-gray-100"
        >
          <span className="text-2xl leading-none font-light mb-1">+</span>
        </Link>
      </div>
    </div>
  );
};
