'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockPerformance } from '@/lib/mock-data';

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ScoreHistoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Quiz Performance Over Time</CardTitle>
        <CardDescription>Your scores from the last few quizzes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <AreaChart
            accessibilityLayer
            data={mockPerformance}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis domain={[0, 100]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="score"
              type="natural"
              fill="var(--color-score)"
              fillOpacity={0.4}
              stroke="var(--color-score)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
