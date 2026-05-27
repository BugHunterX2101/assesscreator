import React from 'react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { FormField } from './FormField';
import { QuestionTypeRow } from './QuestionTypeRow';
import { DifficultySlider } from './DifficultySlider';
import { FileUploader } from './FileUploader';
import { AssignmentFormSchema } from '@vedaai/shared';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export const AssignmentForm: React.FC = () => {
  const { form, formErrors, updateForm, setFormError, clearFormErrors, setJobStatus, setCurrentAssignmentId, jobStatus } = useAssignmentStore();
  const router = useRouter();

  const handleQuestionTypeChange = (index: number, field: string, value: string | number) => {
    const newTypes = [...form.questionTypes];
    newTypes[index] = { ...newTypes[index], [field]: value };
    updateForm({ questionTypes: newTypes });
  };

  const addQuestionType = () => {
    updateForm({
      questionTypes: [...form.questionTypes, { type: 'ShortAnswer', count: 5, marksEach: 2 }]
    });
  };

  const removeQuestionType = (index: number) => {
    const newTypes = form.questionTypes.filter((_, i) => i !== index);
    updateForm({ questionTypes: newTypes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFormErrors();

    const validation = AssignmentFormSchema.safeParse(form);
    if (!validation.success) {
      validation.error.issues.forEach(issue => {
        setFormError(issue.path[0] as keyof typeof form, issue.message);
      });
      return;
    }

    setJobStatus('pending');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/assignments`, form);
      
      setCurrentAssignmentId(res.data.assignmentId);
      router.push(`/assignments/${res.data.assignmentId}/status`);
    } catch (error) {
      setJobStatus('failed');
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error?.message || 'Submission failed');
      } else {
        toast.error('Submission failed');
      }
    }
  };

  const totalQuestions = form.questionTypes.reduce((acc, curr) => acc + curr.count, 0);
  const totalMarks = form.questionTypes.reduce((acc, curr) => acc + (curr.count * curr.marksEach), 0);

  const isSubmitting = jobStatus === 'pending';

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Optional Top Stepper / Heading */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
          <span className="font-semibold text-gray-900">Create Assignment</span>
        </div>
        <p className="text-xs text-gray-400 pl-4.5">Set up a new assignment for your students</p>
      </div>

      {/* Progress Bar (Visual Mock) */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-8 max-w-sm">
         <div className="h-full bg-gray-600 rounded-full w-1/2"></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 border border-gray-100">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Assignment Details</h2>
          <p className="text-xs text-gray-400">Basic information about your assignment</p>
        </div>

        {/* Hidden inputs to capture basic form data that was in the old form but not in the screenshot to keep functionality intact, or we can just default them in state. The screenshot only shows Due Date explicitly, along with File Upload and Question Types. For functionality, we'll include title/subject/topic as standard inputs stylized softly. */}
        <div className="space-y-5 mb-8">
          <FormField
            label="Assignment Title"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            placeholder="e.g., Quiz on Electricity"
            error={formErrors.title}
          />
          <div className="grid grid-cols-2 gap-4">
             <FormField
               label="Subject"
               value={form.subject}
               onChange={(e) => updateForm({ subject: e.target.value })}
               placeholder="e.g., Physics"
               error={formErrors.subject}
             />
             <FormField
               label="Grade / Class"
               value={form.grade}
               onChange={(e) => updateForm({ grade: e.target.value })}
               placeholder="e.g., Class 10"
               error={formErrors.grade}
             />
          </div>
        </div>

        {/* File Uploader area exactly like Figma */}
        <div className="mb-8">
          <FileUploader
            onUploadSuccess={(fileKey) => updateForm({ referenceFileKey: fileKey })}
          />
          <p className="text-center text-xs text-gray-400 mt-3">Upload images of your preferred document/image</p>
        </div>

        {/* Due Date */}
        <div className="mb-8">
          <FormField
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => updateForm({ dueDate: e.target.value })}
            error={formErrors.dueDate}
          />
        </div>

        {/* Question Configuration */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-gray-900">Question Type</h3>
            <div className="flex space-x-12 text-xs font-semibold text-gray-900 pr-4">
              <span>No. of Questions</span>
              <span>Marks</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {form.questionTypes.map((qt, idx) => (
              <QuestionTypeRow
                key={idx}
                index={idx}
                config={qt}
                onChange={handleQuestionTypeChange}
                onRemove={removeQuestionType}
              />
            ))}
          </div>
          
          {formErrors.questionTypes && <p className="text-red-500 text-sm mt-2">{formErrors.questionTypes}</p>}

          <div className="mt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={addQuestionType}
              className="bg-[#2A2B2D] hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-full flex items-center space-x-1 transition-colors"
            >
              <span className="text-base leading-none mb-0.5">+</span> <span>Add Question Type</span>
            </button>
            <div className="text-right text-xs font-bold text-gray-900 space-y-1">
               <p>Total Questions : {totalQuestions}</p>
               <p>Total Marks : {totalMarks}</p>
            </div>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-8">
           <DifficultySlider
            difficulty={form.difficulty}
            onChange={(diff) => updateForm({ difficulty: diff })}
            error={formErrors.difficulty as string | undefined}
          />
        </div>

        {/* Additional Info */}
        <div className="mb-10">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Additional Information (For better output)
          </label>
          <textarea
            className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none h-24 placeholder-gray-400"
            value={form.instructions}
            onChange={(e) => updateForm({ instructions: e.target.value })}
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
          />
          {formErrors.instructions && (
            <p className="mt-1 text-sm text-red-600">{formErrors.instructions}</p>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
          >
            <span className="mr-2">←</span> Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2A2B2D] hover:bg-black text-white px-8 py-2.5 rounded-full text-sm font-semibold flex items-center transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              <>
                Next <span className="ml-2">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
