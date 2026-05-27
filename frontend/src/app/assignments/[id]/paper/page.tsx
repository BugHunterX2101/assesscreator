"use client";

import { useEffect, use } from 'react';
import axios from 'axios';
import { usePaperStore } from '../../../../store/paperStore';
import { PaperHeader } from '../../../../components/paper/PaperHeader';
import { StudentInfoSection } from '../../../../components/paper/StudentInfoSection';
import { SectionBlock } from '../../../../components/paper/SectionBlock';
import { ActionBar } from '../../../../components/paper/ActionBar';
import { Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;
  const { paper, isLoading, error, setPaper, setIsLoading, setError } = usePaperStore();

  useEffect(() => {
    const fetchPaper = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await axios.get(`${baseUrl}/api/assignments/${assignmentId}/paper`);
        setPaper(res.data.paper);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to fetch paper');
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) {
      fetchPaper();
    }
  }, [assignmentId, setPaper, setIsLoading, setError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your question paper...</p>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Paper</h2>
          <p className="text-gray-500 mb-6">{error || "Could not find the paper."}</p>
          <a href="/create" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            Create New Assessment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12 print:bg-white print:pb-0">
      <ActionBar assignmentId={assignmentId} />
      
      <main className="max-w-[210mm] mx-auto mt-8 bg-white shadow-2xl print:shadow-none print:mt-0 px-10 py-12 min-h-[297mm] rounded-sm print:rounded-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PaperHeader 
            subject={paper.subject} 
            grade={paper.grade} 
            totalMarks={paper.totalMarks} 
          />
          
          <StudentInfoSection />
          
          <div className="space-y-8 mt-8">
            {paper.sections.map((section, index) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SectionBlock section={section} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center text-sm font-medium text-gray-400 print:block">
            — End of Paper —
          </div>
        </motion.div>
      </main>
    </div>
  );
}
