import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, RefreshCw, ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useAssignmentStore } from '../../store/assignmentStore';

interface Props {
  assignmentId: string;
}

export const ActionBar: React.FC<Props> = ({ assignmentId }) => {
  const router = useRouter();
  const { setJobStatus, setJobError } = useAssignmentStore();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setJobStatus('pending');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      await axios.post(`${baseUrl}/api/assignments/${assignmentId}/regenerate`, { feedback });
      router.push(`/assignments/${assignmentId}/status`);
    } catch (err: any) {
      setJobStatus('failed');
      setJobError(err.response?.data?.error?.message || 'Regeneration failed');
      router.push(`/assignments/${assignmentId}/status`);
    } finally {
      setIsRegenerating(false);
      setShowFeedbackModal(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 sticky top-0 z-10 shadow-sm print:hidden">
        <button
          onClick={() => router.push('/create')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm mb-4 sm:mb-0"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Form
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4 text-indigo-600">
              <MessageSquare className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Regenerate Paper</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Would you like to provide any feedback to the AI to improve the generation? (Optional)
            </p>
            <textarea
              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4"
              rows={4}
              placeholder="e.g., Make the MCQ questions harder, avoid questions about X..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isRegenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
