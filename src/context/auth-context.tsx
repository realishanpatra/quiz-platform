'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AppUser } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FirestorePermissionError, errorEmitter } from '@/lib/errors';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const appUser = userDoc.data() as AppUser;
              setUser(appUser);
            } else {
               // Handle case where user exists in Auth but not in Firestore
               setUser(null);
               await signOut(auth);
            }
        } catch(e: any) {
            if (e.code === 'permission-denied') {
                const customError = new FirestorePermissionError({operation: 'get', path: userDocRef.path });
                errorEmitter.emit('permission-error', customError);
            }
             setUser(null);
             await signOut(auth);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const appUser = userDoc.data() as AppUser;
        // The onAuthStateChanged listener will handle setting the user
        router.push(`/${appUser.role}/dashboard`);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${appUser.name}!`,
        });
      } else {
        // If user exists in Auth but not in Firestore DB, sign them out.
        await signOut(auth);
        throw new Error("User data not found in database. Please sign up again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      const newUser: AppUser = {
          uid: firebaseUser.uid,
          name,
          email: email,
          role,
      };
      
      const userDocRef = doc(db, "users", firebaseUser.uid);

      // Use setDoc to explicitly use the user's UID as the document ID
      await setDoc(userDocRef, newUser).catch(e => {
        if (e.code === 'permission-denied') {
          const customError = new FirestorePermissionError({
            operation: 'create',
            path: userDocRef.path,
            requestResourceData: newUser
          });
          errorEmitter.emit('permission-error', customError);
        }
        // Re-throw the original error to be caught by the outer try/catch
        throw e;
      });
      
      // The onAuthStateChanged listener will handle setting the user
      router.push(`/${role}/dashboard`);
      toast({
          title: 'Account Created!',
          description: `Welcome to QuizVerse, ${name}!`,
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      // Don't show a toast for permission errors as the dialog will handle it
      if (error.code !== 'permission-denied') {
         toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: error.message || 'Could not create your account. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle setting the user to null
      router.push('/');
      toast({
          title: 'Logged Out',
          description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'There was an issue logging out.',
      });
    }
  };

  const isPublicRoute = ['/'].includes(pathname);
  
  useEffect(() => {
    if (loading) return;

    if (user && pathname === '/') {
       router.replace(`/${user.role}/dashboard`);
    }

    if (!user && !isPublicRoute) {
      router.replace('/');
    }
  }, [user, loading, isPublicRoute, pathname, router]);


  const value = { user, loading, login, logout, signup };
  
  // Show a loading state while we determine auth status, unless on the public homepage
  if (loading && !isPublicRoute) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  // Prevent rendering of protected routes for unauthenticated users
  if (!user && !isPublicRoute) {
    return (
         <div className="flex h-screen items-center justify-center">
            <p>Redirecting to login...</p>
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
