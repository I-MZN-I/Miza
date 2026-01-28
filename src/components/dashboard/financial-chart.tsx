
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type FinancialChartProps = {
    chartData: any[];
    chartConfig: ChartConfig;
    dataKey: string;
};

export function FinancialChart({ chartData, chartConfig, dataKey }: FinancialChartProps) {
  if (!chartData || chartData.length === 0) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">No data available to display chart.</p>
        </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
          />
           <YAxis 
                tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)}
           />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent
                indicator="dot"
                formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value as number)}
            />}
          />
          <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
