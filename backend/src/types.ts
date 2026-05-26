// Inlined shared types — self-contained so the backend builds standalone on Render/Railway
export interface Question {
  id: string;
  number: number;
  text: string;
  type: 'mcq' | 'short' | 'long' | 'truefalse' | 'fillinblanks';
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  options?: string[];
  answer?: string;
}

export interface Section {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  title: string;
  totalMarks: number;
  duration: string;
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
  uploadedFilePath?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  generatedPaper?: GeneratedPaper;
  createdAt?: string;
  updatedAt?: string;
}
