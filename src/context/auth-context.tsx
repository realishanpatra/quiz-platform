'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import { mockStudent, mockTeacher } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: 'student' | 'teacher', email?: string) => void;
  logout: () => void;
  signup: (name: string, email: string, role: 'student' | 'teacher') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('quizverse-user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        if (pathname === '/') {
          router.replace(`/${parsedUser.role}/dashboard`);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('quizverse-user');
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  const login = (role: 'student' | 'teacher') => {
    setLoading(true);
    const userToLogin = role === 'student' ? mockStudent : mockTeacher;
    localStorage.setItem('quizverse-user', JSON.stringify(userToLogin));
    setUser(userToLogin);
    setLoading(false);
    router.push(`/${role}/dashboard`);
    toast({
      title: 'Login Successful',
      description: `Welcome back, ${userToLogin.name}!`,
    });
  };
  
  const signup = (name: string, email: string, role: 'student' | 'teacher') => {
    setLoading(true);
    const newUser: User = {
        uid: `new-user-${Date.now()}`,
        name,
        email,
        role,
    };
    localStorage.setItem('quizverse-user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    router.push(`/${role}/dashboard`);
    toast({
        title: 'Account Created!',
        description: `Welcome to QuizVerse, ${name}!`,
    });
  };

  const logout = () => {
    localStorage.removeItem('quizverse-user');
    setUser(null);
    router.push('/');
    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
    });
  };

  const value = { user, loading, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
