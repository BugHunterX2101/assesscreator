import { z } from 'zod';

export const QuestionTypeConfigSchema = z.object({
  type: z.enum(['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank']),
  count: z.number().int().min(1),
  marksEach: z.number().int().min(1)
});

export const DifficultyConfigSchema = z.object({
  easy: z.number().min(0).max(100),
  medium: z.number().min(0).max(100),
  hard: z.number().min(0).max(100)
}).refine(data => data.easy + data.medium + data.hard === 100, {
  message: "Difficulty percentages must sum to 100"
});

export const AssignmentFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  grade: z.string().min(1, "Grade/Class is required"),
  dueDate: z.string().refine(val => new Date(val) >= new Date(), {
    message: "Due date must be in the future"
  }),
  questionTypes: z.array(QuestionTypeConfigSchema).min(1, "Select at least one question type"),
  difficulty: DifficultyConfigSchema,
  instructions: z.string().max(500).optional(),
  referenceFileKey: z.string().nullable().optional()
});

export const QuestionSchema = z.object({
  number: z.number().int().positive(),
  text: z.string().min(10),
  type: z.enum(['MCQ', 'ShortAnswer', 'LongAnswer', 'TrueFalse', 'FillBlank']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().int().positive()
});

export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  instruction: z.string(),
  questions: z.array(QuestionSchema).min(1)
});

export const GeneratedPaperSchema = z.object({
  title: z.string(),
  subject: z.string(),
  grade: z.string(),
  totalMarks: z.number().int().positive(),
  sections: z.array(SectionSchema).min(1)
});
