import mongoose, { Schema, Document } from 'mongoose';
import { Assignment as IAssignment, GeneratedPaper as IGeneratedPaper } from '../types';

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  number: { type: Number, required: true },
  text: { type: String, required: true },
  type: { type: String, required: true, enum: ['mcq', 'short', 'long', 'truefalse', 'fillinblanks'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  marks: { type: Number, required: true },
  options: [{ type: String }],
  answer: { type: String }
});

const SectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
});

const PaperSchema = new Schema({
  title: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  duration: { type: String, required: true },
  sections: [SectionSchema]
});

export interface AssignmentDocument extends Omit<IAssignment, 'id' | '_id'>, Document {}

const AssignmentSchema = new Schema<AssignmentDocument>({
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  topic: { type: String, required: true },
  dueDate: { type: String, required: true },
  questionTypes: [{ type: String, required: true }],
  numQuestions: { type: Number, required: true },
  marksPerQuestion: { type: Number, required: true },
  difficultyDistribution: {
    easy: { type: Number, required: true },
    medium: { type: Number, required: true },
    hard: { type: Number, required: true }
  },
  additionalInstructions: { type: String },
  uploadedFilePath: { type: String },
  status: { type: String, required: true, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  jobId: { type: String },
  generatedPaper: { type: PaperSchema }
}, {
  timestamps: true
});

export const AssignmentModel = mongoose.models.Assignment || mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);
