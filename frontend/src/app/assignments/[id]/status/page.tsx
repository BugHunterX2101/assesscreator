"use client";

import { useEffect, use } from 'react';
import { useAssignmentSocket } from '../../../../hooks/useAssignmentSocket';
import { useAssignmentStore } from '../../../../store/assignmentStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;
  const router = useRouter();
  
  useAssignmentSocket(assignmentId);
  const { jobStatus, jobProgress, jobStep, jobError, wsConnected } = useAssignmentStore();

  const getStepText = (step: string) => {
    switch (step) {
      case 'building_prompt': return 'Analyzing your configuration...';
      case 'calling_llm': return 'Generating questions with AI...';
      case 'parsing_response': return 'Formatting the question paper...';
      default: return 'Starting up...';
    }
  };

  useEffect(() => {
    if (jobStatus === 'completed') {
      router.push(`/assignments/${assignmentId}/paper`);
    }
  }, [jobStatus, assignmentId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-100 p-8 text-center">
        {!wsConnected && jobStatus !== 'completed' && jobStatus !== 'failed' && (
          <div className="mb-4 text-xs font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full inline-block">
            Reconnecting to server...
          </div>
        )}

        {jobStatus === 'pending' || jobStatus === 'processing' || jobStatus === 'idle' ? (
          <>
            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full text-gray-200" viewBox="0 0 100 100">
                <circle className="stroke-current stroke-2" fill="none" cx="50" cy="50" r="45" />
              </svg>
              <svg className="w-full h-full text-indigo-600 absolute top-0 left-0 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  className="stroke-current stroke-2 transition-all duration-500 ease-out" 
                  fill="none" 
                  cx="50" cy="50" r="45" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * Math.max(5, jobProgress)) / 100} 
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-1" />
                <span className="text-sm font-semibold text-gray-700">{Math.max(5, jobProgress)}%</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Generating Assessment</h2>
            <p className="text-gray-500 text-sm animate-pulse">{getStepText(jobStep)}</p>
            <p className="text-gray-400 text-xs mt-6">This usually takes around 15-20 seconds.</p>
          </>
        ) : jobStatus === 'failed' ? (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Generation Failed</h2>
            <p className="text-red-500 text-sm mb-6">{jobError}</p>
            <button 
              onClick={() => router.push('/create')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete!</h2>
            <p className="text-gray-500 text-sm">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}
