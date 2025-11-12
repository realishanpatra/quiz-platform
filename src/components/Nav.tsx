// src/components/Nav.tsx
"use client";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useAuth } from "@/context/AuthContext";

export default function Nav() {
  const { user } = useAuth();

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
      <Link href="/">Home</Link>
      {user ? (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <button onClick={() => signOut(auth)}>Sign out</button>
        </>
      ) : (
        <>
          <Link href="/signin">Sign in</Link>
          <Link href="/signup">Sign up</Link>
        </>
      )}
    </nav>
  );
}
