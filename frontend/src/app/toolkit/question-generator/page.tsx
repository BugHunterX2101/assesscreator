'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function QuestionGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    topic: '', subject: '', grade: '', questionType: 'MCQ'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/toolkit/generate-questions`, form);
      setResult(res.data.data.content);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate');
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
        <h1 className="text-3xl font-bold text-gray-900">Question Generator</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input type="text" required value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Photosynthesis" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Biology" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <input type="text" required value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. 10th Grade" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select value={form.questionType} onChange={e => setForm({...form, questionType: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="MCQ">Multiple Choice</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Long Essay">Long Essay</option>
              </select>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Generate Questions</span>}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-4">{result.title}</h2>
          <div className="space-y-6">
            {result.questions?.map((q: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">{i + 1}. {q.text}</p>
                <p className="text-gray-600"><span className="font-medium text-green-700">Answer:</span> {q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
