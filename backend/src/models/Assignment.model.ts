import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  topic: string;
  grade: string;
  dueDate: Date;
  questionTypes: {
    type: string;
    count: number;
    marksEach: number;
  }[];
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  instructions?: string;
  referenceFileKey?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  grade: { type: String, required: true },
  dueDate: { type: Date, required: true },
  questionTypes: [{
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marksEach: { type: Number, required: true }
  }],
  difficulty: {
    easy: { type: Number, required: true },
    medium: { type: Number, required: true },
    hard: { type: Number, required: true }
  },
  instructions: { type: String },
  referenceFileKey: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  jobId: { type: String }
}, { timestamps: true });

AssignmentSchema.index({ status: 1 });
AssignmentSchema.index({ createdAt: -1 });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
