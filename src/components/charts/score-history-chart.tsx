'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Performance } from '@/lib/types';

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function ScoreHistoryChart({ performanceData }: { performanceData: Performance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Quiz Performance Over Time</CardTitle>
        <CardDescription>Your scores from the last few quizzes.</CardDescription>
      </CardHeader>
      <CardContent>
        {performanceData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64">
            <AreaChart
              accessibilityLayer
              data={performanceData}
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
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No performance data yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
