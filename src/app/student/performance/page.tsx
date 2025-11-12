import { ScoreHistoryChart } from "@/components/charts/score-history-chart";
import { ScoreDistributionChart } from "@/components/charts/score-distribution-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPerformance } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function StudentPerformancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Your Performance</h1>
        <p className="text-muted-foreground">A detailed look at your quiz results and progress.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ScoreHistoryChart />
        <ScoreDistributionChart />
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
              {mockPerformance.map((p) => (
                <TableRow key={p.quizId}>
                  <TableCell className="font-medium">{p.quizTitle}</TableCell>
                  <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={p.score >= 70 ? 'default' : 'destructive'} className={p.score >= 70 ? 'bg-green-600' : ''}>
                      {p.score}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
