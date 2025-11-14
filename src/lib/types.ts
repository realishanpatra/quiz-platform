export type AppUser = {
  uid: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
};

export type Question = {
  id?: string;
  text: string;
  options: {value: string}[];
  correctAnswer: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  createdBy: string; // Teacher UID
  questions: Question[];
  createdAt?: any;
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
  teacherId: string; // UID of the teacher who created the quiz
  score: number;
  date: string; // ISO 8601 string
  answers: (number | null)[];
};
