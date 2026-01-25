'use client';
import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type RentPredictionProps = {
  currentRent: number;
};

export function RentPrediction({ currentRent }: RentPredictionProps) {
  const [predictedRent, setPredictedRent] = useState<number | null>(null);
  const [percentageIncrease, setPercentageIncrease] = useState<number | null>(null);

  useEffect(() => {
    // Simulate AI prediction fetch
    const timer = setTimeout(() => {
        const factor = 1 + (Math.random() * (0.15 - 0.05) + 0.05); // Random increase between 5% and 15%
        const newRent = Math.round((currentRent * factor) / 100) * 100;
        const increase = ((newRent - currentRent) / currentRent) * 100;
        setPredictedRent(newRent);
        setPercentageIncrease(increase);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentRent]);


  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-base font-medium">
          AI Rent Prediction
        </CardTitle>
        <Sparkles className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Rent</p>
            <p className="font-headline text-2xl font-bold">{formatCurrency(currentRent)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AI Recommended</p>
            {predictedRent === null ? (
                 <Skeleton className="h-8 w-32 mt-1" />
            ) : (
                <p className="font-headline text-2xl font-bold text-primary">{formatCurrency(predictedRent)}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          {percentageIncrease === null ? (
            <Skeleton className="h-5 w-full" />
          ) : (
             <p className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-primary" />
                AI suggests a <strong className="mx-1 text-primary">{percentageIncrease.toFixed(0)}% increase</strong> based on area demand and past performance.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
