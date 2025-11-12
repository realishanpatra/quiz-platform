import type { User, Quiz, Question, Performance, Submission } from './types';

export const mockStudent: User = {
  uid: 'student123',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  role: 'student',
};

export const mockTeacher: User = {
  uid: 'teacher456',
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@example.com',
  role: 'teacher',
};

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Algebra Basics',
    description: 'Test your knowledge of fundamental algebraic concepts.',
    createdBy: 'teacher456',
    questions: [
      { id: 'q1', text: 'Solve for x: 2x + 3 = 7', options: ['1', '2', '3', '4'], correctAnswer: 1 },
      { id: 'q2', text: 'What is (a+b)^2 ?', options: ['a^2 + b^2', 'a^2 + 2ab + b^2', 'a^2 - 2ab + b^2'], correctAnswer: 1 },
    ],
  },
  {
    id: 'quiz-2',
    title: 'Introduction to Calculus',
    description: 'An introductory quiz on derivatives and limits.',
    createdBy: 'teacher456',
    questions: [
      { id: 'q1', text: 'What is the derivative of x^2?', options: ['2x', 'x', 'x^2/2', '2'], correctAnswer: 0 },
      { id: 'q2', text: 'lim x->0 (sin(x)/x) = ?', options: ['0', '1', 'Infinity', 'Not defined'], correctAnswer: 1 },
    ],
  },
  {
    id: 'quiz-3',
    title: 'World War II History',
    description: 'A quiz covering major events and figures of WWII.',
    createdBy: 'teacher456',
    questions: [
      { id: 'q1', text: 'In which year did WWII begin?', options: ['1935', '1939', '1941', '1945'], correctAnswer: 1 },
      { id: 'q2', text: 'The Battle of Stalingrad was a major turning point on which front?', options: ['Western Front', 'Pacific Theatre', 'Eastern Front', 'North African Campaign'], correctAnswer: 2 },
    ],
  },
  {
    id: 'quiz-4',
    title: 'Cellular Biology',
    description: 'Explore the basic building blocks of life.',
    createdBy: 'teacher456',
    questions: [
      { id: 'q1', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Cell Membrane'], correctAnswer: 2 },
    ],
  }
];

export const mockPerformance: Performance[] = [
    { quizId: 'quiz-1', quizTitle: 'Algebra Basics', score: 50, date: '2024-05-01' },
    { quizId: 'quiz-2', quizTitle: 'Introduction to Calculus', score: 80, date: '2024-05-05' },
    { quizId: 'quiz-3', quizTitle: 'World War II History', score: 95, date: '2024-05-10' },
];

export const mockStudentPerformanceSummary = "The student shows strong performance in history (World War II History: 95%) and a good grasp of introductory calculus (Introduction to Calculus: 80%). However, they seem to be struggling with fundamental concepts in algebra (Algebra Basics: 50%). It would be beneficial to reinforce these foundational math skills.";

export const mockAvailableQuizzesForAI = JSON.stringify(mockQuizzes.map(q => ({id: q.id, title: q.title, topic: q.description})));

export const mockSubmissions: Submission[] = [
  { studentId: 'student1', studentName: 'Charlie Brown', quizId: 'quiz-1', quizTitle: 'Algebra Basics', score: 88, date: new Date().toISOString() },
  { studentId: 'student2', studentName: 'Lucy van Pelt', quizId: 'quiz-1', quizTitle: 'Algebra Basics', score: 95, date: new Date(Date.now() - 3600000).toISOString() },
  { studentId: 'student3', studentName: 'Linus van Pelt', quizId: 'quiz-2', quizTitle: 'Intro to Calculus', score: 72, date: new Date(Date.now() - 86400000).toISOString() },
  { studentId: 'student4', studentName: 'Snoopy', quizId: 'quiz-3', quizTitle: 'WWII History', score: 100, date: new Date(Date.now() - 172800000).toISOString() },
];

export const mockClassPerformance = {
  averageScore: 82,
  completionRate: 0.75,
  topStudent: { name: 'Snoopy', score: 100 },
  strugglingStudent: { name: 'Linus van Pelt', score: 72 },
};

export const getQuizById = (id: string): Quiz | undefined => {
  return mockQuizzes.find(quiz => quiz.id === id);
}
