// src/app/student/attempt-result/[quizId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useSearchParams } from "next/navigation";

export default function AttemptResultPage() {
  const params = useSearchParams();
  const scoreParam = params.get("score");
  const maxParam = params.get("max");
  const [attempts, setAttempts] = useState<any[]>([]);
  const [avg, setAvg] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      // quizId is in route but we can get it later if needed. For listing attempts pass quizId via route param if you want stricter load
      // For simplicity, fetch all attempts for a quiz if the route param exists
      // (In App Router, you'd fetch by route param — this demo is kept minimal)
    };
    load();
  }, []);

  useEffect(() => {
    // We can compute average if attempts were loaded. For now, we keep it simple.
    if (attempts.length) {
      const avgScore = attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length;
      setAvg(avgScore);
    }
  }, [attempts]);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>Quiz Result</h1>
      {scoreParam && maxParam && <p>Your score: {scoreParam} / {maxParam}</p>}
      {avg !== null ? <p>Average score: {avg.toFixed(2)}</p> : <p>Average not available yet</p>}
      <h3>Recent attempts</h3>
      {attempts.map(a => (
        <div key={a.id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 6 }}>
          <p>Student: {a.studentId} — Score: {a.score} / {a.maxScore}</p>
        </div>
      ))}
    </div>
  );
}
    