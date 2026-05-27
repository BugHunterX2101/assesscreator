'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LessonPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    topic: '', subject: '', grade: '', duration: '45 minutes'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/toolkit/generate-lesson-plan`, form);
      setResult(res.data.data.content);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate lesson plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/toolkit" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Lesson Planner</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input type="text" required value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. The Water Cycle" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
              <input type="text" required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. 5th Grade" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. 45 minutes" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full mt-4 bg-orange-600 text-white font-medium py-3 rounded-lg hover:bg-orange-700 transition flex items-center justify-center space-x-2 disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Generate Lesson Plan</span>}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8 space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4">{result.title}</h2>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Objectives</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {result.objectives?.map((obj: string, i: number) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Required Materials</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {result.materials?.map((mat: string, i: number) => (
                <li key={i}>{mat}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activities</h3>
            <div className="space-y-4">
              {result.activities?.map((act: any, i: number) => (
                <div key={i} className="flex space-x-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                  <div className="flex-shrink-0 w-24">
                    <span className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm">{act.time}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-800">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
