// src/app/signin/page.tsx
"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} /><br />
        <button type="submit">Sign in</button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
