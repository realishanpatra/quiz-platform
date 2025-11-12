// src/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

type AppUser = { uid: string; email?: string | null; displayName?: string | null; role?: "student" | "teacher" };

const AuthContext = createContext<{ user: AppUser | null; loading: boolean }>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const uRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(uRef);
      if (!snap.exists()) {
        await setDoc(uRef, { displayName: fbUser.displayName || null, email: fbUser.email, role: "student", createdAt: serverTimestamp() });
      }
      const data = (await getDoc(uRef)).data();
      setUser({ uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName || null, role: data?.role });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
