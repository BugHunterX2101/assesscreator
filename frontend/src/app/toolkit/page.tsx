'use client';
import React from 'react';
import { Sparkles, MessageSquare, BookOpen, PenTool, BrainCircuit } from 'lucide-react';

export default function ToolkitPage() {
  const tools = [
    { title: 'Question Generator', icon: MessageSquare, desc: 'Generate diverse questions based on a topic or syllabus.', color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Rubric Creator', icon: BookOpen, desc: 'Automatically create detailed grading rubrics.', color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Essay Grader', icon: PenTool, desc: 'AI-assisted grading for long-form essays.', color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Lesson Planner', icon: BrainCircuit, desc: 'Generate structured lesson plans instantly.', color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </span>
          <span>AI Teacher's Toolkit</span>
        </h1>
        <p className="text-gray-500 text-lg">Supercharge your teaching workflow with AI-powered tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <div className={`w-14 h-14 ${tool.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <tool.icon className={`w-7 h-7 ${tool.color}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
            <p className="text-gray-500">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
