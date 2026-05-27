'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  createdAt: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await axios.get(`${baseUrl}/api/assignments`);
        setAssignments(res.data.assignments);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
  }

  // 0-State
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center mt-20">
        <div className="relative mb-8">
          {/* Mock illustration circle */}
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center relative shadow-sm border border-gray-100">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                <div className="text-[100px]">📄</div>
             </div>
             <div className="absolute right-8 bottom-8 text-red-500 bg-white rounded-full p-2 shadow-lg">
                <span className="text-3xl font-bold px-2">×</span>
             </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No assignments yet</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link 
          href="/create"
          className="bg-[#2A2B2D] hover:bg-black text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-md"
        >
          + Create Your First Assignment
        </Link>
      </div>
    );
  }

  // Filled State
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
            <span>Assignments</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 pl-4.5">Manage and create assignments for your classes.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
           <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Filter By" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
        </div>
        <div className="relative flex-1 max-w-sm sm:ml-auto">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Search Assignment" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {assignments.map((assignment) => (
          <Link href={`/assignments/${assignment._id}/paper`} key={assignment._id}>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-12">
                <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                <button 
                  onClick={(e) => { e.preventDefault(); /* Prevent link click */ toast('Options coming soon', { icon: '🚧' }); }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-800">
              <span className="flex items-center space-x-1">
                 <span className="text-gray-500 font-normal">Assigned on: </span>
                 <span>{new Date(assignment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
              </span>
              <span className="flex items-center space-x-1">
                 <span className="text-gray-500 font-normal">Due: </span>
                 <span>{new Date(assignment.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-')}</span>
              </span>
            </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
