'use client';
import React from 'react';
import { Users, Plus, UserPlus } from 'lucide-react';

export default function GroupsPage() {
  const groups = [
    { name: 'Class 10-A Science', students: 34, color: 'bg-purple-100 text-purple-600' },
    { name: 'Class 12 Math Honors', students: 28, color: 'bg-pink-100 text-pink-600' },
    { name: 'Debate Club', students: 15, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </span>
            <span>My Groups</span>
          </h1>
          <p className="text-gray-500 text-lg">Manage your student groups and classes.</p>
        </div>
        <button className="bg-[#2A2B2D] hover:bg-black text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className={`w-12 h-12 rounded-full ${group.color} flex items-center justify-center mb-4`}>
              <span className="font-bold text-lg">{group.name.charAt(0)}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{group.name}</h3>
            <p className="text-gray-500 text-sm mb-6">{group.students} Students</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                    S{i+1}
                  </div>
                ))}
              </div>
              <button className="text-gray-400 hover:text-gray-700">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
