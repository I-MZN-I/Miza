'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type BudgetPlan = {
  savingsGoal: number;
  investmentTips: string;
};

function InfoLine({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-accent" />
      <div className="text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}


export function BudgetPlanner() {
  const [plan, setPlan] = useState<BudgetPlan | null>(null);

  useEffect(() => {
    // Simulate fetching AI budget plan
    const timer = setTimeout(() => {
      setPlan({
        savingsGoal: 45000,
        investmentTips:
          'Consider diversifying with low-risk mutual funds to complement your real estate assets.',
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">AI Budget Planner</CardTitle>
        <Sparkles className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        {plan ? (
            <div className="space-y-4">
                <p className="text-center text-lg text-muted-foreground">
                    Based on your trends, you can save up to
                    <span className="block font-headline text-4xl font-bold text-primary">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                    }).format(plan.savingsGoal)}
                    </span>
                    monthly.
                </p>
                <Separator />
                <div className="space-y-4">
                    <InfoLine icon={Target} label="Monthly Savings Goal" value={
                        <span className="font-semibold text-foreground">{new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(plan.savingsGoal)}</span>
                    }/>
                    <InfoLine icon={CreditCard} label="Expense Limits" value="AI suggests optimizing maintenance costs by 8%."/>
                    <InfoLine icon={TrendingUp} label="Investment Planning" value={plan.investmentTips}/>
                </div>
            </div>
        ) : (
            <div className="space-y-4 pt-2">
                <Skeleton className="mx-auto h-8 w-3/4" />
                <Skeleton className="mx-auto h-12 w-1/2" />
                <Skeleton className="mx-auto h-4 w-1/2" />
                <Separator />
                <div className="space-y-4">
                    <div className="flex gap-3"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-8 w-full" /></div>
                    <div className="flex gap-3"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-8 w-full" /></div>
                    <div className="flex gap-3"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-8 w-full" /></div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
