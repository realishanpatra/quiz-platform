import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSubmissions, mockClassPerformance, mockQuizzes } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Target, UserCheck, UserX } from "lucide-react";

export default function TeacherDashboardPage() {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[1][0]}`;
    return name.substring(0, 2).toUpperCase();
  };

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
                <div className="text-2xl font-bold">{mockQuizzes.length}</div>
                <p className="text-xs text-muted-foreground">quizzes available</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Class Average</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockClassPerformance.averageScore}%</div>
                <p className="text-xs text-muted-foreground">across all submissions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Top Performer</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockClassPerformance.topStudent.name}</div>
                <p className="text-xs text-muted-foreground">with a score of {mockClassPerformance.topStudent.score}%</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-headline">Needs Help</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockClassPerformance.strugglingStudent.name}</div>
                <p className="text-xs text-muted-foreground">with a score of {mockClassPerformance.strugglingStudent.score}%</p>
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
              {mockSubmissions.map((sub) => (
                <TableRow key={sub.studentId}>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
