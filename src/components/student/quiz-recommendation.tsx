'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizRecommendation } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Wand2, Lightbulb, Loader2 } from 'lucide-react';
import type { QuizRecommendationOutput } from '@/ai/flows/quiz-recommendation';
import type { Quiz, Performance } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function generatePerformanceSummary(performance: Performance[]): string {
    if (performance.length === 0) {
        return "The student has not completed any quizzes yet. Recommend some introductory quizzes to get them started.";
    }

    let summary = "The student's recent performance is as follows:\n";
    performance.forEach(p => {
        summary += `- Quiz "${p.quizTitle}" with a score of ${p.score}%. `;
        if (p.score >= 80) {
            summary += "(Strong performance)\n";
        } else if (p.score >= 60) {
            summary += "(Good performance)\n";
        } else {
            summary += "(Area for improvement)\n";
        }
    });

    const lowScores = performance.filter(p => p.score < 60);
    if (lowScores.length > 0) {
        summary += "\nThe student seems to be struggling with: " + lowScores.map(p => p.quizTitle).join(', ') + ". Please recommend quizzes that can help reinforce these topics.";
    } else {
        summary += "\nThe student is performing well. Recommend more advanced or related topics to challenge them.";
    }

    return summary;
}

export function QuizRecommendation({ availableQuizzes }: { availableQuizzes: Quiz[] }) {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState<QuizRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [performance, setPerformance] = useState<Performance[]>([]);
  
  useEffect(() => {
    if (!user) return;

    const fetchPerformance = async () => {
      const q = query(
        collection(db, "submissions"), 
        where("studentId", "==", user.uid),
        orderBy("date", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const fetchedPerformance: Performance[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPerformance.push(doc.data() as Performance);
      });
      setPerformance(fetchedPerformance);
    };

    fetchPerformance();
  }, [user]);

  const handleGetRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    
    const performanceSummary = generatePerformanceSummary(performance);
    const availableQuizzesForAI = JSON.stringify(availableQuizzes.map(q => ({id: q.id, title: q.title, topic: q.description})));

    const result = await getQuizRecommendation({
      studentPerformanceSummary: performanceSummary,
      availableQuizzes: availableQuizzesForAI,
    });
    setIsLoading(false);
    if ('error' in result) {
      setError(result.error as string);
    } else {
      setRecommendation(result);
    }
  };
  
    const recommendedQuiz = recommendation?.recommendedQuizzes
    ? availableQuizzes.find(q => recommendation.recommendedQuizzes.includes(q.title))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="text-primary"/>
            AI-Powered Recommendations
        </CardTitle>
        <CardDescription>
          Get personalized quiz suggestions based on your recent performance to help you improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Analyzing your performance...</span>
            </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {recommendation && (
            <Alert className="bg-accent/30 border-accent/50">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-headline">Here are your suggestions!</AlertTitle>
                <AlertDescription className="space-y-4 mt-2">
                    <div>
                        <h4 className="font-semibold mb-1">Reasoning:</h4>
                        <p>{recommendation.reasoning}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-1">Recommended Quiz:</h4>
                        <p>{recommendation.recommendedQuizzes}</p>
                        {recommendedQuiz && (
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" asChild>
                                    <Link href={`/student/quiz/${recommendedQuiz.id}`}>Try {recommendedQuiz.title}</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </AlertDescription>
            </Alert>
        )}
        {!isLoading && !recommendation && (
            <div className="text-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Click the button to get your personalized quiz plan.</p>
                <Button onClick={handleGetRecommendation} disabled={isLoading || availableQuizzes.length === 0}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                    Generate My Plan
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
