import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  number: number;
  text: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

export interface ISection {
  id: string;
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  sections: ISection[];
  version: number;
  generatedAt: Date;
}

const QuestionSchema = new Schema({
  number: { type: Number, required: true },
  text: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  marks: { type: Number, required: true }
});

const SectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
});

const GeneratedPaperSchema: Schema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  sections: [SectionSchema],
  version: { type: Number, default: 1 },
  generatedAt: { type: Date, default: Date.now }
});

GeneratedPaperSchema.index({ assignmentId: 1, version: -1 });

export default mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
