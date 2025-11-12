// src/app/student/available-quizzes/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Link from "next/link";

export default function AvailableQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setQuizzes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h1>Available Quizzes</h1>
      {quizzes.map(q => (
        <div key={q.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 8 }}>
          <h3>{q.title}</h3>
          <p>{q.description}</p>
          <Link href={`/student/take-quiz/${q.id}`}>Take quiz</Link>
        </div>
      ))}   
    </div>
  );
}
