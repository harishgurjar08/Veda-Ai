export interface Question {
  id: string;
  number: number;
  text: string;
  type: 'mcq' | 'short' | 'long' | 'truefalse' | 'fillinblanks';
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  options?: string[]; // for MCQ only
  answer?: string; // optional, for teacher's copy
}

export interface Section {
  id: string;
  title: string; // "Section A", "Section B"
  instruction: string; // "Attempt all questions"
  questions: Question[];
}

export interface GeneratedPaper {
  title: string;
  totalMarks: number;
  duration: string; // e.g. "2 hours"
  sections: Section[];
}

export interface Assignment {
  id?: string;
  _id?: string;
  subject: string;
  grade: string;
  topic: string;
  dueDate: string;
  questionTypes: string[];
  numQuestions: number;
  marksPerQuestion: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  additionalInstructions?: string;
  uploadedFilePath?: string; // local path or S3 key
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  generatedPaper?: GeneratedPaper; // populated after generation
  createdAt?: string;
  updatedAt?: string;
}
