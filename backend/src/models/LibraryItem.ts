import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryItem extends Document {
  title: string;
  type: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ILibraryItem>('LibraryItem', LibraryItemSchema);
