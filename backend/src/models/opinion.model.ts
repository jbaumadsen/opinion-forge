import mongoose, { Schema, Document } from 'mongoose';

export interface IOpinion extends Document {
  content: string;
  author: string;
  question: string;
  bucket: string;
  createdAt: Date;
  updatedAt: Date;
}

const OpinionSchema: Schema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  question: { type: String, required: true },
  bucket: { type: String, required: true },
}, { timestamps: true });

export const Opinion = mongoose.model<IOpinion>('Opinion', OpinionSchema);