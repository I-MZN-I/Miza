'use client';

import { DollarSign, Building, TrendingUp, TrendingDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import type { Property, WithId } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FinancialChart } from "./financial-chart";
import { cn } from "@/lib/utils";


function StatPill({
  label,
  value,
  icon,
  isLoading,
  onClick,
  href,
  className
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  isLoading?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const Icon = icon;
  
  const content = (
    <div className="glassmorphism flex items-center p-3 rounded-full shrink-0 h-full w-full">
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

  if (href) {
    return <Link href={href} className={className}>{content}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className={cn("text-left", className)}>{content}</button>;
  }

  return <div className={className}>{content}</div>;
}


export function AnalyticsBar({ properties, isLoading }: { properties: WithId<Property>[] | null, isLoading: boolean }) {
    const [activeChart, setActiveChart] = useState<'income' | 'expenses' | 'netProfit' | null>(null);
    
    const totalProperties = properties?.length ?? 0;
    
    const { totalIncome, totalExpenses, netProfit } = React.useMemo(() => {
        if (!properties) return { totalIncome: 0, totalExpenses: 0, netProfit: 0 };
        const income = properties.reduce((sum, p) => sum + (p.totalRent ?? 0), 0);
        const expenses = properties.reduce((sum, p) => sum + (p.totalExpenses ?? 0), 0);
        return {
            totalIncome: income,
            totalExpenses: expenses,
            netProfit: income - expenses,
        };
    }, [properties]);
    
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(value);

    const getChartData = () => {
        if (!activeChart || !properties) return { title: '', dataKey: '', data: [] };

        switch (activeChart) {
            case 'income':
                return {
                    title: 'Income Breakdown by Property',
                    dataKey: 'income',
                    data: properties.map(p => ({ name: p.buildingName, income: p.totalRent ?? 0 }))
                };
            case 'expenses':
                return {
                    title: 'Expenses Breakdown by Property',
                    dataKey: 'expenses',
                    data: properties.map(p => ({ name: p.buildingName, expenses: p.totalExpenses ?? 0 }))
                };
            case 'netProfit':
                return {
                    title: 'Net Profit Breakdown by Property',
                    dataKey: 'profit',
                    data: properties.map(p => ({ name: p.buildingName, profit: (p.totalRent ?? 0) - (p.totalExpenses ?? 0) }))
                };
            default:
                return { title: '', dataKey: '', data: [] };
        }
    }

    const chartConfig = {
      income: { label: 'Income', color: 'hsl(var(--chart-1))' },
      expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
      profit: { label: 'Net Profit', color: 'hsl(var(--profit))' },
    };

    if (isLoading) {
        return (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatPill label="Properties" value="" icon={Building} isLoading />
                <StatPill label="Income" value="" icon={TrendingUp} isLoading />
                <StatPill label="Expenses" value="" icon={TrendingDown} isLoading />
                <StatPill label="Net Profit" value="" icon={DollarSign} isLoading />
            </div>
        )
    }

  return (
    <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatPill
            label="Properties"
            value={String(totalProperties)}
            icon={Building}
            href="/properties"
            isLoading={isLoading}
        />
        <StatPill 
            label="Income"
            value={formatCurrency(totalIncome)}
            icon={TrendingUp}
            isLoading={isLoading}
            onClick={() => setActiveChart('income')}
        />
        <StatPill
            label="Expenses"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
            isLoading={isLoading}
            onClick={() => setActiveChart('expenses')}
        />
        <StatPill 
            label="Net Profit"
            value={formatCurrency(netProfit)}
            icon={DollarSign}
            isLoading={isLoading}
            onClick={() => setActiveChart('netProfit')}
        />
    </div>
     <Dialog open={!!activeChart} onOpenChange={(isOpen) => !isOpen && setActiveChart(null)}>
        <DialogContent className="glassmorphism sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>{getChartData().title}</DialogTitle>
                <DialogDescription>
                    A visual summary of your portfolio's financial performance.
                </DialogDescription>
            </DialogHeader>
            <div className="h-96 w-full pt-4">
                <FinancialChart
                    chartData={getChartData().data}
                    chartConfig={chartConfig}
                    dataKey={getChartData().dataKey}
                 />
            </div>
        </DialogContent>
     </Dialog>
    </>
  );
}
