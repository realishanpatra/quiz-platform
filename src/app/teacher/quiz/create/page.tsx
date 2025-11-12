import { QuizForm } from "@/components/teacher/quiz-form";

export default function CreateQuizPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Create a New Quiz</h1>
            <p className="text-muted-foreground">Fill out the details below to build your quiz.</p>
        </div>
        <QuizForm />
    </div>
  );
}
