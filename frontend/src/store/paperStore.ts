import { create } from 'zustand';
import { GeneratedPaper } from '@vedaai/shared';

interface PaperState {
  paper: GeneratedPaper | null;
  isLoading: boolean;
  error: string | null;
  studentName: string;
  studentRollNo: string;
  studentSection: string;

  setPaper: (paper: GeneratedPaper | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStudentInfo: (field: 'studentName' | 'studentRollNo' | 'studentSection', value: string) => void;
  clearPaper: () => void;
}

export const usePaperStore = create<PaperState>((set) => ({
  paper: null,
  isLoading: false,
  error: null,
  studentName: '',
  studentRollNo: '',
  studentSection: '',

  setPaper: (paper) => set({ paper }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setStudentInfo: (field, value) => set(() => ({ [field]: value })),
  clearPaper: () => set({ paper: null, error: null, studentName: '', studentRollNo: '', studentSection: '' })
}));
