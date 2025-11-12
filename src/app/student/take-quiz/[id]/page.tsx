// src/app/student/take-quiz/[id]/page.tsx
"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/context/AuthContext";

export default function TakeQuizPage() {
  const params = useParams();
  const quizId = params?.id;
  const [quiz, setQuiz] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!quizId) return;
    const load = async () => {
      if (typeof quizId !== "string") return;
      const d = await getDoc(doc(db, "quizzes", quizId));
      if (d.exists()) setQuiz({ id: d.id, ...d.data() });
    };
    load();
  }, [quizId]);

  if (!quiz) return <div>Loading quiz...</div>;

  const submit = async () => {
    if (!user) return alert("Sign in first");
    let score = 0;
    const maxScore = quiz.questions.length;
    for (const q of quiz.questions) {
      const sel = answers[q.id];
      if (sel === q.correctIndex) score++;
    }
    await addDoc(collection(db, "quizAttempts"), {
      quizId: quiz.id,
      studentId: user.uid,
      answers: Object.entries(answers).map(([questionId, selectedIndex]) => ({ questionId, selectedIndex })),
      score,
      maxScore,
      startedAt: serverTimestamp(),
      finishedAt: serverTimestamp(),
    });
    router.push(`/student/attempt-result/${quiz.id}?score=${score}&max=${maxScore}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((q: any, i: number) => (
        <div key={q.id} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8 }}>
          <p><strong>{i + 1}.</strong> {q.text}</p>
          {q.options.map((opt: string, idx: number) => (
            <div key={idx}>
              <label>
                <input type="radio" name={q.id} checked={answers[q.id] === idx} onChange={() => setAnswers(a => ({ ...a, [q.id]: idx }))} />
                {opt}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={submit}>Submit</button>
    </div>
  );
}
