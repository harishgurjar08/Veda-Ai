import { create } from 'zustand';
import axios from 'axios';

export interface QuestionTypeRow {
  id: string;
  type: 'mcq' | 'short' | 'long' | 'truefalse' | 'fillinblanks' | string;
  count: number;
  marks: number;
}

interface AssignmentStore {
  subject: string;
  grade: string;
  topic: string;
  dueDate: string;
  questionRows: QuestionTypeRow[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
  additionalInstructions: string;
  uploadedFile: File | null;
  errors: Record<string, string>;
  isGenerating: boolean;
  jobId: string | null;
  assignmentId: string | null;
  setField: (field: string, value: any) => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
  validateForm: () => boolean;
  submit: () => Promise<{ jobId: string; assignmentId: string }>;
  resetForm: () => void;
  addQuestionRow: () => void;
  removeQuestionRow: (id: string) => void;
  updateQuestionRow: (id: string, updates: Partial<QuestionTypeRow>) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const defaultRows: QuestionTypeRow[] = [
  { id: '1', type: 'mcq', count: 4, marks: 1 },
  { id: '2', type: 'short', count: 4, marks: 2 },
  { id: '3', type: 'diagram', count: 5, marks: 5 },
  { id: '4', type: 'numerical', count: 5, marks: 5 }
];

const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const initialState = {
  subject: 'Science',
  grade: 'Class 5th',
  topic: 'Electricity',
  dueDate: getTomorrowString(),
  questionRows: defaultRows,
  difficultyDistribution: { easy: 50, medium: 30, hard: 20 },
  additionalInstructions: '',
  uploadedFile: null,
  errors: {},
  isGenerating: false,
  jobId: null,
  assignmentId: null,
};

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  ...initialState,

  setField: (field, value) => {
    set((state) => ({ [field]: value }));
    if (get().errors[field]) {
      set((state) => {
        const errors = { ...state.errors };
        delete errors[field];
        return { errors };
      });
    }
  },

  setError: (field, error) => {
    set((state) => ({
      errors: { ...state.errors, [field]: error }
    }));
  },

  clearErrors: () => set({ errors: {} }),

  resetForm: () => set({
    ...initialState,
    dueDate: getTomorrowString()
  }),

  addQuestionRow: () => {
    const newId = 'row_' + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      questionRows: [...state.questionRows, { id: newId, type: 'mcq', count: 5, marks: 2 }]
    }));
  },

  removeQuestionRow: (id) => {
    set((state) => ({
      questionRows: state.questionRows.filter(r => r.id !== id)
    }));
  },

  updateQuestionRow: (id, updates) => {
    set((state) => ({
      questionRows: state.questionRows.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  },

  validateForm: () => {
    const s = get();
    const errors: Record<string, string> = {};

    if (!s.subject.trim()) errors.subject = 'Subject is required';
    if (!s.grade) errors.grade = 'Grade/Level is required';
    if (!s.topic.trim()) errors.topic = 'Topic/Chapter is required';
    
    if (!s.dueDate) {
      errors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(s.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        errors.dueDate = 'Due date must be in the future';
      }
    }

    if (s.questionRows.length === 0) {
      errors.questionRows = 'At least one question type is required';
    }

    s.questionRows.forEach(row => {
      if (row.count < 1 || row.count > 50) {
        errors.questionRows = 'Question count per row must be between 1 and 50';
      }
      if (row.marks < 1 || row.marks > 20) {
        errors.questionRows = 'Marks per question must be between 1 and 20';
      }
    });

    const { easy, medium, hard } = s.difficultyDistribution;
    const sum = Number(easy) + Number(medium) + Number(hard);
    if (sum !== 100) {
      errors.difficultyDistribution = `Difficulty must sum to exactly 100% (currently ${sum}%)`;
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  submit: async () => {
    const s = get();
    if (!s.validateForm()) {
      set((state) => ({
        errors: {
          ...state.errors,
          submit: 'Form validation failed. Please check all fields (Subject, Grade, Topic, Due Date) and try again.'
        }
      }));
      throw new Error('Form validation failed');
    }

    set({ isGenerating: true });

    try {
      const formData = new FormData();
      formData.append('subject', s.subject);
      formData.append('grade', s.grade);
      formData.append('topic', s.topic);
      formData.append('dueDate', s.dueDate);
      
      // Map rows for the backend endpoint (schema expects string[] of types, total question count, and base marks)
      const types = s.questionRows.map(r => r.type);
      const totalCount = s.questionRows.reduce((acc, curr) => acc + curr.count, 0);
      const avgMarks = Math.round(s.questionRows.reduce((acc, curr) => acc + (curr.marks * curr.count), 0) / totalCount) || 2;
      
      formData.append('questionTypes', JSON.stringify(types));
      formData.append('numQuestions', totalCount.toString());
      formData.append('marksPerQuestion', avgMarks.toString());
      formData.append('difficultyDistribution', JSON.stringify(s.difficultyDistribution));
      formData.append('additionalInstructions', s.additionalInstructions);

      if (s.uploadedFile) {
        formData.append('uploadedFile', s.uploadedFile);
      }

      console.log('Submitting assignment creation request...');
      const response = await axios.post(`${API_URL}/api/assignments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { jobId, assignmentId } = response.data;
      set({ jobId, assignmentId, isGenerating: false });
      return { jobId, assignmentId };
    } catch (error: any) {
      set({ isGenerating: false });
      const errMsg = error.response?.data?.error || error.message || 'Submission failed';
      set((state) => ({
        errors: { ...state.errors, submit: errMsg }
      }));
      throw new Error(errMsg);
    }
  },
}));
