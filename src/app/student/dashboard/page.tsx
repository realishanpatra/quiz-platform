'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuizCard } from "@/components/student/quiz-card";
import { QuizRecommendation } from "@/components/student/quiz-recommendation";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "quizzes"));
                const fetchedQuizzes: Quiz[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedQuizzes.push({ id: doc.id, ...doc.data() } as Quiz);
                });
                setQuizzes(fetchedQuizzes);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your progress and available quizzes.</p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-headline">Available Quizzes</h2>
            {loading ? (
                 <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-60 rounded-lg" />
                    <Skeleton className="h-60 rounded-lg" />
                 </div>
            ) : quizzes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No quizzes are available at the moment.</p>
                    </CardContent>
                </Card>
            )}
        </div>
        <div className="space-y-6">
             <h2 className="text-2xl font-bold font-headline">Personalized Plan</h2>
             <QuizRecommendation availableQuizzes={quizzes} />
        </div>
      </div>

    </>
  );
}
