import { create } from 'zustand';
import { AssignmentFormData, JobStatus } from '@vedaai/shared';

interface AssignmentState {
  form: AssignmentFormData;
  formErrors: Partial<Record<keyof AssignmentFormData, string>>;
  currentAssignmentId: string | null;
  jobStatus: JobStatus;
  jobProgress: number;
  jobStep: string;
  jobError: string | null;
  wsConnected: boolean;

  updateForm: (updates: Partial<AssignmentFormData>) => void;
  setFormError: (field: keyof AssignmentFormData, error: string) => void;
  clearFormErrors: () => void;
  setJobStatus: (status: JobStatus, progress?: number, step?: string) => void;
  setJobError: (error: string) => void;
  setCurrentAssignmentId: (id: string | null) => void;
  setWsConnected: (connected: boolean) => void;
  reset: () => void;
}

const initialForm: AssignmentFormData = {
  title: '',
  subject: '',
  topic: '',
  grade: '',
  dueDate: '',
  questionTypes: [
    { type: 'MCQ', count: 5, marksEach: 1 }
  ],
  difficulty: {
    easy: 40,
    medium: 40,
    hard: 20
  },
  instructions: '',
  referenceFileKey: null
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  form: initialForm,
  formErrors: {},
  currentAssignmentId: null,
  jobStatus: 'idle',
  jobProgress: 0,
  jobStep: '',
  jobError: null,
  wsConnected: false,

  updateForm: (updates) => set((state) => ({ form: { ...state.form, ...updates } })),
  setFormError: (field, error) => set((state) => ({ formErrors: { ...state.formErrors, [field]: error } })),
  clearFormErrors: () => set({ formErrors: {} }),
  setJobStatus: (status, progress, step) => set((state) => ({ 
    jobStatus: status, 
    jobProgress: progress !== undefined ? progress : state.jobProgress,
    jobStep: step !== undefined ? step : state.jobStep
  })),
  setJobError: (error) => set({ jobError: error }),
  setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  reset: () => set({ 
    form: initialForm, 
    formErrors: {}, 
    currentAssignmentId: null, 
    jobStatus: 'idle', 
    jobProgress: 0, 
    jobStep: '', 
    jobError: null 
  })
}));
