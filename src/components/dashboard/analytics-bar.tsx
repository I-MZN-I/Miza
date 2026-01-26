'use client';

import { properties } from "@/lib/data";
import { DollarSign, Building, TrendingUp, TrendingDown, Rocket } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

function StatPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  const Icon = icon;
  return (
    <div className="glassmorphism flex items-center p-3 rounded-full shrink-0">
      <div className="bg-white/10 rounded-full p-2 mr-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-headline text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}


export function AnalyticsBar() {
    const totalProperties = properties.length;
    const totalIncome = properties.reduce((sum, p) => sum + p.totalIncome, 0);
    const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
    const netProfit = totalIncome - totalExpenses;
    const avgAiScore = properties.reduce((sum, p) => sum + p.aiScore, 0) / totalProperties;

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(value);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        <StatPill
            label="Properties"
            value={String(totalProperties)}
            icon={Building}
        />
        <StatPill 
            label="Income"
            value={formatCurrency(totalIncome)}
            icon={TrendingUp}
        />
        <StatPill
            label="Expenses"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
        />
        <StatPill 
            label="Net Profit"
            value={formatCurrency(netProfit)}
            icon={DollarSign}
        />
        <StatPill 
            label="AI Score"
            value={avgAiScore.toFixed(0)}
            icon={Rocket}
        />
    </div>
  );
}
