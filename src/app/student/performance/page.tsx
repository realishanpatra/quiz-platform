'use client';

import { useState, useEffect } from 'react';
import { ScoreHistoryChart } from "@/components/charts/score-history-chart";
import { ScoreDistributionChart } from "@/components/charts/score-distribution-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';
import type { Performance } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentPerformancePage() {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "submissions"), 
          where("studentId", "==", user.uid),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedPerformance: Performance[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPerformance.push({
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            score: data.score,
            date: data.date,
          });
        });
        setPerformance(fetchedPerformance);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [user]);

  if (loading) {
      return (
          <div className="space-y-8">
              <div className="space-y-2">
                  <Skeleton className="h-8 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                  <Skeleton className="h-80 rounded-lg" />
                  <Skeleton className="h-80 rounded-lg" />
              </div>
              <Skeleton className="h-60 rounded-lg" />
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Performance</h1>
        <p className="text-muted-foreground">A detailed look at your quiz results and progress.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ScoreHistoryChart performanceData={performance} />
        <ScoreDistributionChart performanceData={performance} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Quiz History</CardTitle>
          <CardDescription>A log of all the quizzes you have completed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performance.length > 0 ? performance.map((p, index) => (
                <TableRow key={p.quizId + p.date + index}>
                  <TableCell className="font-medium">{p.quizTitle}</TableCell>
                  <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={p.score >= 70 ? 'default' : 'destructive'}>
                      {p.score}%
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                        You have not completed any quizzes yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
