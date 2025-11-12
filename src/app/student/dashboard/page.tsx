'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCard } from "@/components/student/quiz-card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp } from "lucide-react";
import { QuizRecommendation } from "@/components/student/quiz-recommendation";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    // This data would come from student's actual performance records
    const averageScore = 78;
    const quizzesCompleted = 5;

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-lg">
                    <BarChart3 className="text-primary"/>
                    Your Average Score
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{Math.round(averageScore)}%</p>
                <Progress value={averageScore} className="mt-2" />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2 text-lg">
                    <TrendingUp className="text-primary"/>
                    Quizzes Completed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{quizzesCompleted}</p>
                 <p className="text-sm text-muted-foreground">Keep up the great work!</p>
            </CardContent>
        </Card>
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
