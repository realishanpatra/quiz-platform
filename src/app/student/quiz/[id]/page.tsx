'use client';

import { useState, useEffect } from 'react';
import { QuizPlayer } from '@/components/student/quiz-player';
import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TakeQuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuiz({ id: docSnap.id, ...docSnap.data() } as Quiz);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  if (loading) {
    return (
        <div className="container mx-auto py-8">
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-full mt-4" />
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (error || !quiz) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
        <QuizPlayer quiz={quiz} />
    </div>
  );
}
