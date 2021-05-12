import mongoose from 'mongoose';
import { RegionDoc } from './Region';

export interface QuestionDoc extends mongoose.Document {
  text: string;
  answer: string;
  hints: [];
  keywords: [];
  level: number;
  region: RegionDoc;
}

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  hints: {
    type: Array,
  },
  keywords: {
    type: Array,
  },
  level: {
    type: Number,
    required: true,
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model<QuestionDoc>('Question', QuestionSchema);