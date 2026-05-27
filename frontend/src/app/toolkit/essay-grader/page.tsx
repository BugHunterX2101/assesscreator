'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface EssayResult {
  score: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function EssayGraderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EssayResult | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    essay: '', promptText: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/toolkit/grade-essay`, form);
      setResult(res.data.data.content);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to grade essay');
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
        <h1 className="text-3xl font-bold text-gray-900">Essay Grader</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Prompt / Rubric</label>
            <textarea required value={form.promptText} onChange={e => setForm({...form, promptText: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 text-gray-900 placeholder:text-gray-400 bg-white" placeholder="What was the student asked to write about?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Essay</label>
            <textarea required value={form.essay} onChange={e => setForm({...form, essay: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-64 text-gray-900 placeholder:text-gray-400 bg-white" placeholder="Paste the student's essay here..." />
          </div>
          
          <button type="submit" disabled={loading} className="w-full mt-4 bg-purple-600 text-white font-medium py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2 disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Grade Essay</span>}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold">Grading Result</h2>
            <div className="text-3xl font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-xl">
              {result.score}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Overall Feedback</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">{result.feedback}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-green-700 mb-2">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {result.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-600 mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {result.improvements?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
