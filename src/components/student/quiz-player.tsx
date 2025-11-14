'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Quiz, Submission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Flag, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter, FirestorePermissionError } from '@/lib/errors';

interface QuizPlayerProps {
  quiz: Quiz;
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "You must be logged in to submit a quiz.",
        });
        return;
    }

    setIsSubmitting(true);
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);

    const submission: Submission = {
        studentId: user.uid,
        studentName: user.name,
        quizId: quiz.id,
        quizTitle: quiz.title,
        teacherId: quiz.createdBy,
        score: finalScore,
        date: new Date().toISOString(),
        answers: selectedAnswers,
    };

    try {
        const submissionsCol = collection(db, "submissions")
        await addDoc(submissionsCol, submission).catch(e => {
            if (e.code === 'permission-denied') {
                const customError = new FirestorePermissionError({
                    operation: 'create',
                    path: submissionsCol.path,
                    requestResourceData: submission
                });
                errorEmitter.emit('permission-error', customError);
            }
            throw e;
        });
        setIsFinished(true);
    } catch (error) {
        console.error("Error submitting quiz:", error);
         if (error instanceof FirestorePermissionError === false) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error submitting your quiz. Please try again.",
            });
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (isFinished) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
          <CardDescription>You have finished the {quiz.title} quiz.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground">Your Score:</p>
          <p className={`text-6xl font-bold ${score >= 70 ? 'text-primary' : 'text-destructive'}`}>{score}%</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/student/dashboard')}>Back to Dashboard</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{quiz.title}</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold">{currentQuestion.text}</p>
        <RadioGroup
          value={selectedAnswers[currentQuestionIndex]?.toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <Label key={index} className="flex items-center space-x-3 p-4 border rounded-md has-[:checked]:bg-accent has-[:checked]:border-accent-foreground/50 transition-colors cursor-pointer">
              <RadioGroupItem value={index.toString()} id={`q${currentQuestionIndex}-o${index}`} />
              <span>{option.value}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Flag className="mr-2 h-4 w-4" />
            )}
            Finish Quiz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
