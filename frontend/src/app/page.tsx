'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, CheckSquare, Presentation, Plus, ArrowRight, LayoutGrid } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [stats, setStats] = useState({ assignments: 0, library: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const [assigRes, libRes] = await Promise.all([
          axios.get(`${baseUrl}/api/assignments`).catch(() => ({ data: { assignments: [] } })),
          axios.get(`${baseUrl}/api/toolkit/library`).catch(() => ({ data: { data: [] } }))
        ]);
        
        setStats({
          assignments: assigRes.data?.assignments?.length || 0,
          library: libRes.data?.data?.length || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-5 h-5 text-white" />
            </span>
            <span>Welcome back, John!</span>
          </h1>
          <p className="text-gray-500 text-lg">Here's an overview of your teaching workspace today.</p>
        </div>
        <Link 
          href="/create"
          className="bg-[#2A2B2D] hover:bg-black text-white px-6 py-3 rounded-full font-medium transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Assignment</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="w-24 h-24 text-blue-600 transform translate-x-4 -translate-y-4" />
           </div>
           <h3 className="text-gray-500 font-medium mb-1">Total Assignments</h3>
           <p className="text-4xl font-bold text-gray-900 mb-4">{loading ? '-' : stats.assignments}</p>
           <Link href="/assignments" className="text-blue-600 text-sm font-semibold flex items-center hover:underline">
             View all <ArrowRight className="w-4 h-4 ml-1" />
           </Link>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckSquare className="w-24 h-24 text-green-600 transform translate-x-4 -translate-y-4" />
           </div>
           <h3 className="text-gray-500 font-medium mb-1">Library Items</h3>
           <p className="text-4xl font-bold text-gray-900 mb-4">{loading ? '-' : stats.library}</p>
           <Link href="/library" className="text-green-600 text-sm font-semibold flex items-center hover:underline">
             Browse library <ArrowRight className="w-4 h-4 ml-1" />
           </Link>
        </div>
        
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 rounded-3xl shadow-lg relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 p-6 opacity-20">
              <Sparkles className="w-24 h-24 text-white transform translate-x-4 -translate-y-4" />
           </div>
           <h3 className="text-white/90 font-medium mb-1">AI Credits</h3>
           <p className="text-4xl font-bold mb-4">Unlimited</p>
           <span className="text-white/90 text-sm font-semibold flex items-center">
             Pro Plan Active
           </span>
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">AI Teacher's Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/toolkit/question-generator" className="group block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Question Generator</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Instantly generate quizzes and practice questions.</p>
          </Link>

          <Link href="/toolkit/rubric-creator" className="group block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Rubric Creator</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Create detailed grading rubrics automatically.</p>
          </Link>

          <Link href="/toolkit/essay-grader" className="group block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Essay Grader</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Get AI assistance for grading essays.</p>
          </Link>

          <Link href="/toolkit/lesson-planner" className="group block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Lesson Planner</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Design engaging lesson plans in seconds.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
