'use client';

import { properties } from "@/lib/data";
import { DollarSign, Building, TrendingUp, TrendingDown, Rocket } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function StatPill({
  label,
  value,
  icon,
  isLoading
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  const Icon = icon;
  return (
    <div className="glassmorphism flex items-center p-3 rounded-full shrink-0">
      <div className="bg-primary/10 rounded-full p-2 mr-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {isLoading ? (
            <Skeleton className="h-6 w-16 mt-1" />
        ) : (
            <p className="font-headline text-lg font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
}


export function AnalyticsBar() {
    const [formattedIncome, setFormattedIncome] = useState<string | null>(null);
    const [formattedExpenses, setFormattedExpenses] = useState<string | null>(null);
    const [formattedNetProfit, setFormattedNetProfit] = useState<string | null>(null);
    
    // These are safe to calculate directly
    const totalProperties = properties.length;
    const avgAiScore = properties.reduce((sum, p) => sum + p.aiScore, 0) / properties.length;


    useEffect(() => {
        // These calculations are deferred to the client
        const totalIncome = properties.reduce((sum, p) => sum + p.totalIncome, 0);
        const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
        const netProfit = totalIncome - totalExpenses;
        
        const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(value);

        setFormattedIncome(formatCurrency(totalIncome));
        setFormattedExpenses(formatCurrency(totalExpenses));
        setFormattedNetProfit(formatCurrency(netProfit));
    }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        <StatPill
            label="Properties"
            value={String(totalProperties)}
            icon={Building}
        />
        <StatPill 
            label="Income"
            value={formattedIncome ?? ''}
            icon={TrendingUp}
            isLoading={!formattedIncome}
        />
        <StatPill
            label="Expenses"
            value={formattedExpenses ?? ''}
            icon={TrendingDown}
            isLoading={!formattedExpenses}
        />
        <StatPill 
            label="Net Profit"
            value={formattedNetProfit ?? ''}
            icon={DollarSign}
            isLoading={!formattedNetProfit}
        />
        <StatPill 
            label="AI Score"
            value={avgAiScore.toFixed(0)}
            icon={Rocket}
        />
    </div>
  );
}
