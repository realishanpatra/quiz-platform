    // src/app/signup/page.tsx
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), { displayName: name, email, role, createdAt: serverTimestamp() });
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h1>Sign up</h1>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /><br />
        <label><input type="radio" checked={role === "student"} onChange={() => setRole("student")} /> Student</label>
        <label><input type="radio" checked={role === "teacher"} onChange={() => setRole("teacher")} /> Teacher</label>
        <br />
        <button type="submit">Create account</button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
