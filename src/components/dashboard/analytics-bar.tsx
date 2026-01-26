'use client';

import { properties } from "@/lib/data";
import { DollarSign, Building, TrendingUp, TrendingDown, Rocket } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon,
  change,
  changeType,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
  color: string;
}) {
  const Icon = icon;
  return (
    <div className="glassmorphism flex items-center p-4 rounded-lg">
      <div className={cn("rounded-md p-3 mr-4", color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-headline text-2xl font-semibold">{value}</p>
      </div>
      {change && (
        <div
          className={cn(
            'ml-auto flex items-center gap-1 text-xs',
            changeType === 'increase' ? 'text-profit' : 'text-destructive'
          )}
        >
          {changeType === 'increase' ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {change}
        </div>
      )}
    </div>
  );
}


export function AnalyticsBar() {
    const totalProperties = properties.length;
    const totalIncome = properties.reduce((sum, p) => sum + p.totalIncome, 0);
    const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
    const netProfit = totalIncome - totalExpenses;
    const avgAiScore = properties.reduce((sum, p) => sum + p.aiScore, 0) / totalProperties;

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
            label="Total Properties"
            value={String(totalProperties)}
            icon={Building}
            color="bg-blue-500/80"
        />
        <StatCard 
            label="Monthly Income"
            value={formatCurrency(totalIncome)}
            icon={TrendingUp}
            color="bg-profit/80"
            change="+5.2%"
            changeType="increase"
        />
        <StatCard 
            label="Monthly Expenses"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
            color="bg-neutral/80"
             change="+2.1%"
            changeType="increase"
        />
        <StatCard 
            label="Net Profit"
            value={formatCurrency(netProfit)}
            icon={DollarSign}
            color="bg-primary/80"
            change="+8.3%"
            changeType="increase"
        />
        <StatCard 
            label="AI Score"
            value={avgAiScore.toFixed(0)}
            icon={Rocket}
            color="bg-accent/80"
             change="+3 pts"
            changeType="increase"
        />
    </div>
  );
}
