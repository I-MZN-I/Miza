'use client';

import { DollarSign, Building, TrendingUp, TrendingDown, Rocket, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property, Tenant, Expense } from "@/lib/types";

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
  if (isLoading) {
    return (
        <div className="glassmorphism flex items-center p-3 rounded-full shrink-0">
             <div className="bg-primary/10 rounded-full p-2 mr-3">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <Skeleton className="h-6 w-16 mt-1" />
            </div>
        </div>
    )
  }

  return (
    <div className="glassmorphism flex items-center p-3 rounded-full shrink-0">
      <div className="bg-primary/10 rounded-full p-2 mr-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-headline text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}


export function AnalyticsBar({ properties, isLoading }: { properties: WithId<Property>[] | null, isLoading: boolean }) {
    const [formattedIncome, setFormattedIncome] = useState<string | null>(null);
    const [formattedExpenses, setFormattedExpenses] = useState<string | null>(null);
    const [formattedNetProfit, setFormattedNetProfit] = useState<string | null>(null);
    
    const totalProperties = properties?.length ?? 0;
    
    useEffect(() => {
        if (!properties) {
            setFormattedIncome(null);
            setFormattedExpenses(null);
            setFormattedNetProfit(null);
            return;
        };

        // These calculations are deferred to the client to prevent hydration errors
        const totalIncome = properties.reduce((sum, p) => sum + (p.tenants?.reduce((r, t) => r + t.rent, 0) ?? 0), 0);
        const totalExpenses = properties.reduce((sum, p) => sum + (p.expenseDetails?.reduce((e, ex) => e + ex.amount, 0) ?? 0), 0);
        const netProfit = totalIncome - totalExpenses;
        
        const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(value);

        setFormattedIncome(formatCurrency(totalIncome));
        setFormattedExpenses(formatCurrency(totalExpenses));
        setFormattedNetProfit(formatCurrency(netProfit));
    }, [properties]);
    
    if (isLoading) {
        return (
             <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                <StatPill label="Properties" value="" icon={Building} isLoading />
                <StatPill label="Income" value="" icon={TrendingUp} isLoading />
                <StatPill label="Expenses" value="" icon={TrendingDown} isLoading />
                <StatPill label="Net Profit" value="" icon={DollarSign} isLoading />
            </div>
        )
    }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
        <StatPill
            label="Properties"
            value={String(totalProperties)}
            icon={Building}
        />
        <StatPill 
            label="Income"
            value={formattedIncome ?? '₹0'}
            icon={TrendingUp}
            isLoading={!formattedIncome && totalProperties > 0}
        />
        <StatPill
            label="Expenses"
            value={formattedExpenses ?? '₹0'}
            icon={TrendingDown}
            isLoading={!formattedExpenses && totalProperties > 0}
        />
        <StatPill 
            label="Net Profit"
            value={formattedNetProfit ?? '₹0'}
            icon={DollarSign}
            isLoading={!formattedNetProfit && totalProperties > 0}
        />
    </div>
  );
}
