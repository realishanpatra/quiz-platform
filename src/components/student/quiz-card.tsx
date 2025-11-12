import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText, HelpCircle } from 'lucide-react';
import type { Quiz } from '@/lib/types';

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            {quiz.title}
        </CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>{quiz.questions.length} questions</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/student/quiz/${quiz.id}`}>Start Quiz</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
