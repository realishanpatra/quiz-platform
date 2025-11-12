import { QuizPlayer } from '@/components/student/quiz-player';
import { getQuizById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  const quiz = getQuizById(params.id);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
        <QuizPlayer quiz={quiz} />
    </div>
  );
}
