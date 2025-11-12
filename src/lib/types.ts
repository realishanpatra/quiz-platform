export type User = {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  createdBy: string; // Teacher UID
  questions: Question[];
};

export type Performance = {
  quizId: string;
  quizTitle: string;
  score: number;
  date: string;
};

export type Submission = {
  studentId: string;
  studentName: string;
  quizId: string;
  quizTitle: string;
  score: number;
  date: string;
};
