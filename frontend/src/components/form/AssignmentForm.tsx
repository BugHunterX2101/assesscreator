import React from 'react';
import { useAssignmentStore } from '../../store/assignmentStore';
import { FormField } from './FormField';
import { QuestionTypeRow } from './QuestionTypeRow';
import { DifficultySlider } from './DifficultySlider';
import { FileUploader } from './FileUploader';
import { AssignmentFormSchema } from '@vedaai/shared';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export const AssignmentForm: React.FC = () => {
  const { form, formErrors, updateForm, setFormError, clearFormErrors, setJobStatus, setCurrentAssignmentId, jobStatus } = useAssignmentStore();
  const router = useRouter();

  const handleQuestionTypeChange = (index: number, field: string, value: any) => {
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
        setFormError(issue.path[0] as any, issue.message);
      });
      return;
    }

    setJobStatus('pending');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/assignments`, form);
      
      setCurrentAssignmentId(res.data.assignmentId);
      router.push(`/assignments/${res.data.assignmentId}/status`);
    } catch (err: any) {
      setJobStatus('failed');
      if (err.response?.data?.error?.details) {
        // Handle server-side validation errors
      } else {
        alert(err.response?.data?.error?.message || 'Submission failed');
      }
    }
  };

  const isSubmitting = jobStatus === 'pending';

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Create Assessment</h2>
        <p className="text-gray-500 mt-1">Fill in the details below to generate an AI-powered question paper.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Assignment Title"
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          placeholder="e.g., Midterm Examination"
          error={formErrors.title}
        />
        
        <FormField
          label="Subject"
          value={form.subject}
          onChange={(e) => updateForm({ subject: e.target.value })}
          placeholder="e.g., Mathematics"
          error={formErrors.subject}
        />
        
        <FormField
          label="Topic / Chapter"
          value={form.topic}
          onChange={(e) => updateForm({ topic: e.target.value })}
          placeholder="e.g., Quadratic Equations"
          error={formErrors.topic}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Grade / Class"
            value={form.grade}
            onChange={(e) => updateForm({ grade: e.target.value })}
            placeholder="e.g., Class 10"
            error={formErrors.grade}
          />
          <FormField
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => updateForm({ dueDate: e.target.value })}
            error={formErrors.dueDate}
          />
        </div>
      </div>

      <div className="mt-8 mb-4 border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Question Configuration</h3>
      </div>
      
      {form.questionTypes.map((qt, idx) => (
        <QuestionTypeRow
          key={idx}
          index={idx}
          config={qt}
          onChange={handleQuestionTypeChange}
          onRemove={removeQuestionType}
        />
      ))}
      
      {formErrors.questionTypes && <p className="text-red-500 text-sm mb-4">{formErrors.questionTypes}</p>}

      <button
        type="button"
        onClick={addQuestionType}
        className="mb-8 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        <span className="mr-1">+</span> Add Question Type
      </button>

      <DifficultySlider
        difficulty={form.difficulty}
        onChange={(diff) => updateForm({ difficulty: diff })}
        error={formErrors.difficulty as any}
      />

      <div className="mt-8 mb-4 border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
      </div>

      <FormField
        label="Additional Instructions"
        as="textarea"
        value={form.instructions}
        onChange={(e) => updateForm({ instructions: e.target.value })}
        placeholder="e.g., Ensure the difficulty is balanced, avoid generic questions."
        error={formErrors.instructions}
      />

      <FileUploader
        onUploadSuccess={(fileKey) => updateForm({ referenceFileKey: fileKey })}
      />

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating...
            </>
          ) : (
            'Generate Question Paper'
          )}
        </button>
      </div>
    </form>
  );
};
