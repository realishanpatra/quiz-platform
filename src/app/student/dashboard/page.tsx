import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCard } from "@/components/student/quiz-card";
import { mockQuizzes, mockPerformance } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp } from "lucide-react";
import { QuizRecommendation } from "@/components/student/quiz-recommendation";

export default function StudentDashboardPage() {
    const averageScore = mockPerformance.length > 0
        ? mockPerformance.reduce((acc, p) => acc + p.score, 0) / mockPerformance.length
        : 0;

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
                <p className="text-4xl font-bold">{mockPerformance.length}</p>
                 <p className="text-sm text-muted-foreground">Keep up the great work!</p>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold font-headline">Available Quizzes</h2>
            <div className="grid gap-6 md:grid-cols-2">
            {mockQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
            ))}
            </div>
        </div>
        <div className="space-y-6">
             <h2 className="text-2xl font-bold font-headline">Personalized Plan</h2>
             <QuizRecommendation />
        </div>
      </div>

    </>
  );
}
