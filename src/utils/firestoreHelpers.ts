// src/utils/firestoreHelpers.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export async function getAttemptsForQuiz(quizId: string) {
  const q = query(collection(db, "quizAttempts"), where("quizId", "==", quizId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
