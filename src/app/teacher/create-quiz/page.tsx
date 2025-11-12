// src/app/teacher/create-quiz/page.tsx
"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [questions, setQuestions] = useState([{ id: Date.now().toString(), text: "", options: ["", ""], correctIndex: 0 }]);

  if (!user) return <div>Sign in to continue</div>;

  const addQuestion = () => setQuestions(qs => [...qs, { id: Date.now().toString(), text: "", options: ["", ""], correctIndex: 0 }]);
  const addOption = (i: number) => setQuestions(qs => { const c = [...qs]; c[i].options.push(""); return c; });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Title required");
    await addDoc(collection(db, "quizzes"), { title, description: desc, createdBy: user.uid, createdAt: serverTimestamp(), questions });
    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h1>Create Quiz</h1>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br />
        <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} /><br />
        <h3>Questions</h3>
        {questions.map((q, i) => (
          <div key={q.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 8 }}>
            <input placeholder="Question text" value={q.text} onChange={(e) => { const c = [...questions]; c[i].text = e.target.value; setQuestions(c); }} /><br />
            {q.options.map((opt, oi) => (
              <div key={oi}>
                <input placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => { const c = [...questions]; c[i].options[oi] = e.target.value; setQuestions(c); }} />
              </div>
            ))}
            <button type="button" onClick={() => addOption(i)}>Add option</button>
            <div>
              Correct:
              <select value={q.correctIndex} onChange={(e) => { const c = [...questions]; c[i].correctIndex = Number(e.target.value); setQuestions(c); }}>
                {q.options.map((_, idx) => <option key={idx} value={idx}>{idx + 1}</option>)}
              </select>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add question</button><br />
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}
