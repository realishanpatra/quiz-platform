'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { label: 'Your Score', score: 95, fill: "hsl(var(--chart-1))" },
  { label: 'Class Average', score: 82, fill: "hsl(var(--chart-2))" },
];

const chartConfig = {
  score: {
    label: 'Score',
  },
} satisfies ChartConfig;

export function ScoreDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Score Comparison</CardTitle>
        <CardDescription>Your latest quiz score vs. the class average</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="score" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
