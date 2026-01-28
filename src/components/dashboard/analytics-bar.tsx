'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Bot, ChevronRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import type { Property, WithId } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AnimatedCounter } from './AnimatedCounter';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type AnalyticsType = 'income' | 'expenses' | 'net-profit';
type Period = '1M' | '3M' | '6M' | '1Y' | 'All';

const MOCK_HISTORICAL_DATA = {
    income: [48000, 50000, 52000, 51000, 55000, 58000, 53000, 61000, 59000, 60000, 62000, 57000],
    expenses: [22000, 21000, 25000, 23000, 26000, 24000, 27000, 25000, 28000, 26000, 29000, 30000],
};
const MOCK_EXPENSE_CATEGORIES = [
    { name: 'Maintenance', value: 8000, fill: 'hsl(var(--chart-1))'},
    { name: 'Utilities', value: 6000, fill: 'hsl(var(--chart-2))'},
    { name: 'Repairs', value: 5000, fill: 'hsl(var(--chart-3))'},
    { name: 'Taxes', value: 3000, fill: 'hsl(var(--chart-4))'},
    { name: 'Misc', value: 2000, fill: 'hsl(var(--chart-5))'},
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- SUB-COMPONENTS for the Sheet ---

const PeriodSelector = ({ selected, onSelect }: { selected: Period; onSelect: (p: Period) => void }) => {
    const periods: Period[] = ['1M', '3M', '6M', '1Y', 'All'];
    return (
        <div className="flex items-center gap-1 rounded-full bg-black/20 p-1 self-center">
            {periods.map(p => (
                <button
                    key={p}
                    onClick={() => onSelect(p)}
                    className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
                        selected === p ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                >{p}</button>
            ))}
        </div>
    );
};

const chartConfig: ChartConfig = {
    income: { label: "Income", color: "hsl(var(--profit))" },
    expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
    profit: { label: "Profit", color: "hsl(var(--net-profit))" },
    maintenance: { label: 'Maintenance', color: 'hsl(var(--chart-1))'},
    utilities: { label: 'Utilities', color: 'hsl(var(--chart-2))'},
    repairs: { label: 'Repairs', color: 'hsl(var(--chart-3))'},
    taxes: { label: 'Taxes', color: 'hsl(var(--chart-4))'},
    misc: { label: 'Misc', color: 'hsl(var(--chart-5))'},
};

const IncomeChart = () => (
    <ChartContainer config={chartConfig} className="h-64 w-full">
        <LineChart data={MOCK_HISTORICAL_DATA.income.map((v, i) => ({month: months[i], income: v}))} margin={{ left: -20, right: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Line type="monotone" dataKey="income" stroke="hsl(var(--profit))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--profit))" }} />
        </LineChart>
    </ChartContainer>
);

const ExpensesChart = () => (
     <ChartContainer config={chartConfig} className="h-64 w-full">
        <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={MOCK_EXPENSE_CATEGORIES} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={5} />
            <Legend content={({ payload }) => (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                {payload?.map((entry, index) => (
                  <div key={`item-${index}`} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color }}/>
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            )} />
        </PieChart>
     </ChartContainer>
);

const NetProfitChart = () => {
    const data = useMemo(() => MOCK_HISTORICAL_DATA.income.map((v, i) => ({
      month: months[i],
      profit: v - MOCK_HISTORICAL_DATA.expenses[i]
    })), []);
  
    return (
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <AreaChart data={data} margin={{ left: -20, right: 10 }}>
            <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--profit))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--profit))" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
            <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area type="monotone" dataKey="profit" stroke="hsl(var(--profit))" fill="url(#fillGradient)" />
        </AreaChart>
    </ChartContainer>
    );
};


const BreakdownList = ({ properties }: { properties: WithId<Property>[] | null }) => (
    <div className="space-y-3">
        {properties?.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg bg-black/10 p-3 transition-colors hover:bg-black/20">
                <p className="font-semibold">{p.buildingName}</p>
                <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits:0 }).format(p.totalRent ?? 0)}</p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
        ))}
    </div>
);

const KPIChip = ({ title, value, date }: { title: string, value: number, date: string }) => (
    <div className="glassmorphism rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-base font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation:'compact' }).format(value)}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
    </div>
);

// --- Expanded Sheet Component ---
const AnalyticsSheetContent = ({ type, value, properties }: { type: AnalyticsType; value: number; properties: WithId<Property>[] | null }) => {
    const [period, setPeriod] = useState<Period>('6M');

    const cardDetails = {
        income: { title: "Income", color: "text-profit", icon: TrendingUp, insight: "Your income grew 12.5% this month due to higher occupancy.", Chart: IncomeChart, breakdownTitle: "Income by Property" },
        expenses: { title: "Expenses", color: "text-destructive", icon: TrendingDown, insight: "Maintenance costs spiked in March due to repairs.", Chart: ExpensesChart, breakdownTitle: "Expenses by Category" },
        'net-profit': { title: "Net Profit", color: "text-net-profit", icon: Wallet, insight: "Net profit peaked in July. Consider reinvesting.", Chart: NetProfitChart, breakdownTitle: "Profit by Property" },
    };
    const details = cardDetails[type];
    const { Chart } = details;

    return (
        <div className="p-4 pb-24">
            <div className="flex flex-col items-center text-center">
                <p className="font-semibold capitalize text-muted-foreground">{details.title}</p>
                <AnimatedCounter value={value} className={cn("text-5xl font-bold tracking-tighter", details.color)} />
                <p className="text-sm text-muted-foreground mt-1">Across {properties?.length ?? 0} properties</p>
            </div>
            
            <div className="my-6 flex justify-center">
                <PeriodSelector selected={period} onSelect={setPeriod} />
            </div>

            <Chart />

            <div className="my-8 space-y-4">
                <h3 className="font-semibold text-lg px-2">{details.breakdownTitle}</h3>
                <BreakdownList properties={properties} />
            </div>

             <div className="my-8 space-y-4">
                <h3 className="font-semibold text-lg px-2">Comparison</h3>
                <div className="grid grid-cols-3 gap-3">
                    <KPIChip title="Best Month" value={61000} date="July" />
                    <KPIChip title="Worst Month" value={48000} date="Jan" />
                    <KPIChip title="Avg / mo" value={55416} date="" />
                </div>
            </div>

            <div className="my-6 flex items-start gap-3 rounded-xl bg-primary/10 p-4">
                <Bot className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-primary">AI Insight</h4>
                    <p className="text-sm text-muted-foreground">{details.insight}</p>
                </div>
            </div>
        </div>
    );
}

// --- Collapsed Card Component ---
const AnalyticsCard = ({ type, title, value, trend, onClick }: { type: AnalyticsType; title: string; value: number; trend: number; onClick: () => void; }) => {
    const cardDetails = {
        income: { glow: "shadow-profit/20", color: "text-profit", icon: TrendingUp },
        expenses: { glow: "shadow-destructive/20", color: "text-destructive", icon: TrendingDown },
        'net-profit': { glow: "shadow-net-profit/20", color: "text-net-profit", icon: Wallet },
    };
    const details = cardDetails[type];
    const TrendIcon = trend >= 0 ? ArrowUp : ArrowDown;

    return (
        <div
            onClick={onClick}
            className={cn("glassmorphism flex h-36 cursor-pointer flex-col justify-between rounded-3xl p-4 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1", details.glow)}
        >
            <div className="flex items-center justify-between text-muted-foreground">
                <p className="font-semibold">{title}</p>
                <details.icon className="h-5 w-5" />
            </div>
            <div className="text-right">
                <p className="text-3xl font-bold tracking-tight">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact' }).format(value)}</p>
                <div className={cn("flex items-center justify-end text-xs font-semibold", trend >= 0 ? 'text-profit' : 'text-destructive')}>
                    <TrendIcon className="mr-1 h-3 w-3" />
                    <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Export Component ---
export function AnalyticsBar({ properties, isLoading }: { properties: WithId<Property>[] | null; isLoading: boolean }) {
    const [selectedCard, setSelectedCard] = useState<AnalyticsType | null>(null);

    const { totalIncome, totalExpenses, netProfit, incomeTrend, expenseTrend, netProfitTrend } = useMemo(() => {
        if (!properties) return { totalIncome: 0, totalExpenses: 0, netProfit: 0, incomeTrend: 0, expenseTrend: 0, netProfitTrend: 0 };
        
        const income = properties.reduce((sum, p) => sum + (p.totalRent ?? 0), 0);
        const expenses = properties.reduce((sum, p) => sum + (p.totalExpenses ?? 0), 0);

        // NOTE: Trend calculation is mocked. A real implementation would need historical data.
        return {
            totalIncome: income,
            totalExpenses: expenses,
            netProfit: income - expenses,
            incomeTrend: 12.5,
            expenseTrend: -5.2,
            netProfitTrend: 15.8,
        };
    }, [properties]);

    const analyticsData: { type: AnalyticsType, title: string, value: number, trend: number }[] = [
        { type: 'income', title: 'Income', value: totalIncome, trend: incomeTrend },
        { type: 'expenses', title: 'Expenses', value: totalExpenses, trend: expenseTrend },
        { type: 'net-profit', title: 'Net Profit', value: netProfit, trend: netProfitTrend },
    ];
    
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Skeleton className="h-36 w-full rounded-3xl" />
                <Skeleton className="h-36 w-full rounded-3xl" />
                <Skeleton className="h-36 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {analyticsData.map((data) => (
                    <AnalyticsCard
                        key={data.type}
                        type={data.type}
                        title={data.title}
                        value={data.value}
                        trend={data.trend}
                        onClick={() => setSelectedCard(data.type)}
                    />
                ))}
            </div>

            <Sheet open={!!selectedCard} onOpenChange={(isOpen) => !isOpen && setSelectedCard(null)}>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-t-2 border-white/10 bg-card/80 p-0 backdrop-blur-xl">
                    <div className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-muted-foreground/50" />
                    <div className="h-full overflow-y-auto pt-8">
                       {selectedCard && (
                         <AnalyticsSheetContent
                            type={selectedCard}
                            value={analyticsData.find(d => d.type === selectedCard)?.value ?? 0}
                            properties={properties}
                        />
                       )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
