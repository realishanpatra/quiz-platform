'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizRecommendation } from '@/lib/actions';
import { mockStudentPerformanceSummary, mockAvailableQuizzesForAI } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Wand2, Lightbulb, Loader2 } from 'lucide-react';
import type { QuizRecommendationOutput } from '@/ai/flows/quiz-recommendation';
import Link from 'next/link';

export function QuizRecommendation() {
  const [recommendation, setRecommendation] = useState<QuizRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    const result = await getQuizRecommendation({
      studentPerformanceSummary: mockStudentPerformanceSummary,
      availableQuizzes: mockAvailableQuizzesForAI,
    });
    setIsLoading(false);
    if ('error' in result) {
      setError(result.error as string);
    } else {
      setRecommendation(result);
    }
  };

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
                        <h4 className="font-semibold mb-1">Recommended Quizzes:</h4>
                        <p>{recommendation.recommendedQuizzes}</p>
                        {/* This part would need more sophisticated parsing in a real app */}
                        <div className="flex gap-2 mt-2">
                            <Button size="sm" asChild><Link href="/student/quiz/quiz-1">Try Algebra Basics</Link></Button>
                        </div>
                    </div>
                </AlertDescription>
            </Alert>
        )}
        {!isLoading && !recommendation && (
            <div className="text-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Click the button to get your personalized quiz plan.</p>
                <Button onClick={handleGetRecommendation} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                    Generate My Plan
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
