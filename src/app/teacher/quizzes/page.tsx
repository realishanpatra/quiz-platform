'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';
import type { Quiz } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherQuizzesPage() {
  const { user, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, "quizzes"), where("createdBy", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedQuizzes: Quiz[] = [];
        querySnapshot.forEach((doc) => {
          fetchedQuizzes.push({ id: doc.id, ...doc.data() } as Quiz);
        });
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your quizzes.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuizzes();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  const handleDelete = async (quizId: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      toast({
        title: "Quiz Deleted",
        description: "The quiz has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting quiz: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the quiz. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Quizzes</h1>
            <p className="text-muted-foreground">Create, edit, and view your quizzes.</p>
        </div>
        <Button asChild>
            <Link href="/teacher/quiz/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Quiz
            </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.length > 0 ? quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-sm truncate">{quiz.description}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell className="text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>Edit (Coming Soon)</DropdownMenuItem>
                            <DropdownMenuItem disabled>View Submissions</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(quiz.id)} className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    You haven't created any quizzes yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
