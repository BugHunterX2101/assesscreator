'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Criteria {
  name: string;
  points: string;
  description: string;
}

interface RubricResult {
  title: string;
  criteria: Criteria[];
}

export default function RubricCreatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RubricResult | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    assignmentDescription: '', totalMarks: 100, gradingScale: '1-5 (Poor to Excellent)'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/toolkit/generate-rubric`, form);
      setResult(res.data.data.content);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to generate rubric');
      } else {
        setError('An unexpected error occurred');
      }
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
        <h1 className="text-3xl font-bold text-gray-900">Rubric Creator</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Description</label>
            <textarea required value={form.assignmentDescription} onChange={e => setForm({...form, assignmentDescription: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-32 text-gray-900 placeholder:text-gray-400 bg-white" placeholder="Describe the assignment in detail..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input type="number" required value={form.totalMarks} onChange={e => setForm({...form, totalMarks: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder:text-gray-400 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grading Scale</label>
              <input type="text" required value={form.gradingScale} onChange={e => setForm({...form, gradingScale: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder:text-gray-400 bg-white" placeholder="e.g. 1-5 Scale, Letter Grades" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full mt-4 bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2 disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Rubric</span>}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-6">{result.title}</h2>
          <div className="space-y-4">
            {result.criteria?.map((c: Criteria, i: number) => (
              <div key={i} className="p-5 border border-gray-200 rounded-xl bg-green-50/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">{c.points} Points</span>
                </div>
                <p className="text-gray-700">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
