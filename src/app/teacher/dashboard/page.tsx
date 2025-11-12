'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Target, UserCheck, UserX } from "lucide-react";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';
import type { Quiz, Submission } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [classPerformance, setClassPerformance] = useState({
    averageScore: 0,
    topStudent: { name: 'N/A', score: 0 },
    strugglingStudent: { name: 'N/A', score: 100 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch quizzes created by the teacher
        const quizQuery = query(collection(db, "quizzes"), where("createdBy", "==", user.uid));
        const quizSnapshot = await getDocs(quizQuery);
        const fetchedQuizzes: Quiz[] = [];
        quizSnapshot.forEach(doc => fetchedQuizzes.push({ id: doc.id, ...doc.data() } as Quiz));
        setQuizzes(fetchedQuizzes);
        
        // Fetch recent submissions for those quizzes
        if (fetchedQuizzes.length > 0) {
          const quizIds = fetchedQuizzes.map(q => q.id);
          const subQuery = query(
            collection(db, "submissions"), 
            where("quizId", "in", quizIds)
          );
          const subSnapshot = await getDocs(subQuery);
          const fetchedSubmissions: Submission[] = [];
          subSnapshot.forEach(doc => fetchedSubmissions.push(doc.data() as Submission));
          
          // Sort client-side and get the 10 most recent
          fetchedSubmissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const recentSubmissions = fetchedSubmissions.slice(0, 10);
          setSubmissions(recentSubmissions);

          // Calculate class performance based on all submissions for this teacher's quizzes
          if (fetchedSubmissions.length > 0) {
            let totalScore = 0;
            let topStudent = { name: 'N/A', score: 0 };
            let strugglingStudent = { name: 'N/A', score: 100 };

            fetchedSubmissions.forEach(sub => {
              totalScore += sub.score;
              if (sub.score > topStudent.score) {
                topStudent = { name: sub.studentName, score: sub.score };
              }
              if (sub.score < strugglingStudent.score) {
                strugglingStudent = { name: sub.studentName, score: sub.score };
              }
            });

            setClassPerformance({
              averageScore: Math.round(totalScore / fetchedSubmissions.length),
              topStudent: topStudent.name !== 'N/A' ? topStudent : { name: 'N/A', score: 0 },
              strugglingStudent: strugglingStudent.name !== 'N/A' ? strugglingStudent : { name: 'N/A', score: 0 }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching teacher dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[1][0]}`;
    return name.substring(0, 2).toUpperCase();
  };

  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
             </div>
             <Skeleton className="h-80 rounded-lg" />
        </div>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
        <p className="text-muted-foreground">An overview of your class's activity and performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Total Quizzes</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{quizzes.length}</div>
                <p className="text-xs text-muted-foreground">quizzes available</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Class Average</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{classPerformance.averageScore}%</div>
                <p className="text-xs text-muted-foreground">across all submissions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Top Performer</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{classPerformance.topStudent.name}</div>
                <p className="text-xs text-muted-foreground">with a score of {classPerformance.topStudent.score}%</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Needs Help</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{classPerformance.strugglingStudent.name}</div>
                <p className="text-xs text-muted-foreground">with a score of {classPerformance.strugglingStudent.score}%</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Submissions</CardTitle>
          <CardDescription>The latest quizzes completed by your students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length > 0 ? submissions.map((sub, index) => (
                <TableRow key={`${sub.studentId}-${sub.quizId}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${sub.studentName}.png`} />
                        <AvatarFallback>{getInitials(sub.studentName)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{sub.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{sub.quizTitle}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(sub.date), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={sub.score >= 70 ? 'default' : 'destructive'} className={sub.score >= 70 ? 'bg-green-600' : ''}>
                      {sub.score}%
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No recent submissions.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
