export interface QuestionTypeConfig {
  type: 'MCQ' | 'ShortAnswer' | 'LongAnswer' | 'TrueFalse' | 'FillBlank';
  count: number;
  marksEach: number;
}

export interface DifficultyConfig {
  easy: number;
  medium: number;
  hard: number;
}

export interface AssignmentFormData {
  title: string;
  subject: string;
  topic: string;
  grade: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  difficulty: DifficultyConfig;
  instructions: string;
  referenceFileKey: string | null;
}

export type JobStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

export interface Question {
  number: number;
  text: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

export interface Section {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  sections: Section[];
}
