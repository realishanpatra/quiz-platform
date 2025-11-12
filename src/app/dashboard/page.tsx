// src/app/dashboard/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user.displayName || user.email}</h1>
      {user.role === "teacher" ? (
        <>
          <p>Teacher Dashboard</p>
          <Link href="/teacher/create-quiz">Create a Quiz</Link><br />
          <Link href="/teacher/quizzes">All your quizzes</Link>
        </>
      ) : (
        <>
          <p>Student Dashboard</p>
          <Link href="/student/available-quizzes">Available quizzes</Link><br />
          <Link href="/student/attempt-result/[quizId]">Recent performance</Link>
        </>
      )}
    </div>
  );
}
