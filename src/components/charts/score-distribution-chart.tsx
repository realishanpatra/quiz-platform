'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Performance } from '@/lib/types';
import { useMemo } from 'react';

const chartConfig = {
  score: {
    label: 'Score',
  },
} satisfies ChartConfig;

interface ScoreDistributionChartProps {
    performanceData: Performance[];
}

export function ScoreDistributionChart({ performanceData }: ScoreDistributionChartProps) {
  const chartData = useMemo(() => {
    if (performanceData.length === 0) {
      return [
        { label: 'Latest Score', score: 0, fill: "hsl(var(--chart-1))" },
        { label: 'Your Average', score: 0, fill: "hsl(var(--chart-2))" },
      ];
    }
    // performanceData is sorted desc by date, so the first item is the latest.
    const latestScore = performanceData[0].score;
    
    const averageScore = Math.round(performanceData.reduce((acc, p) => acc + p.score, 0) / performanceData.length);
    
    return [
      { label: 'Latest Score', score: latestScore, fill: "hsl(var(--chart-1))" },
      { label: 'Your Average', score: averageScore, fill: "hsl(var(--chart-2))" },
    ];
  }, [performanceData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Score Comparison</CardTitle>
        <CardDescription>Your latest quiz score vs. your average score.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis domain={[0, 100]} unit="%" />
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
