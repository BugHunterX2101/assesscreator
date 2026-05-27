import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent {
  name: string;
  addedAt: Date;
}

export interface IGroup extends Document {
  name: string;
  color: string;
  students: IStudent[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema({
  name: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String, required: true, default: 'bg-purple-100 text-purple-600' },
    students: { type: [StudentSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
