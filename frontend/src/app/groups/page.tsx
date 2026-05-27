'use client';
import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Student {
  _id?: string;
  name: string;
  addedAt: string;
}

interface Group {
  _id: string;
  name: string;
  color: string;
  students: Student[];
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGroups = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.get(`${baseUrl}/api/groups`);
      setGroups(res.data.groups);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      await axios.post(`${baseUrl}/api/groups`, { name: newGroupName });
      toast.success('Group created successfully!');
      setIsCreateModalOpen(false);
      setNewGroupName('');
      fetchGroups(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error('Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedGroupId) return;

    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      await axios.post(`${baseUrl}/api/groups/${selectedGroupId}/students`, { name: newStudentName });
      toast.success('Student added successfully!');
      setIsAddStudentModalOpen(false);
      setNewStudentName('');
      setSelectedGroupId(null);
      fetchGroups(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error('Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStudentModal = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsAddStudentModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
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
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#2A2B2D] hover:bg-black text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Group</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
           <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-gray-900 mb-2">No Groups Yet</h3>
           <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first group to start managing your students and assignments more efficiently.</p>
           <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="text-green-600 font-semibold hover:underline"
           >
             + Create a group now
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className={`w-12 h-12 rounded-full ${group.color} flex items-center justify-center mb-4 shrink-0`}>
                <span className="font-bold text-lg">{group.name.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{group.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">{group.students.length} Students</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto shrink-0">
                <div className="flex -space-x-2 overflow-hidden">
                  {group.students.length > 0 ? (
                    group.students.slice(0, 4).map((student, i) => (
                      <div key={student._id || i} title={student.name} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    ))
                  ) : (
                     <span className="text-xs text-gray-400 pl-2">Empty</span>
                  )}
                  {group.students.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                      +{group.students.length - 4}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => openStudentModal(group._id)}
                  title="Add Student"
                  className="text-gray-400 hover:text-green-600 transition-colors p-1"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Group</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Class 10-A Science"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={!newGroupName.trim() || isSubmitting}
                className="w-full bg-[#2A2B2D] hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Group'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Student</h2>
              <button onClick={() => { setIsAddStudentModalOpen(false); setNewStudentName(''); }} className="text-gray-400 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                <input 
                  type="text" 
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Alice Smith"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={!newStudentName.trim() || isSubmitting}
                className="w-full bg-[#2A2B2D] hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Student'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
