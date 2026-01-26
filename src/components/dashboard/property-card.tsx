'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, MapPin, Wallet } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

type PropertyCardProps = {
  property: Property;
  onSelect?: () => void;
};

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const [formattedIncome, setFormattedIncome] = useState<string | null>(null);
  const [formattedExpenses, setFormattedExpenses] = useState<string | null>(null);
  const [formattedProfit, setFormattedProfit] = useState<string | null>(null);

  const image = PlaceHolderImages.find((img) => img.id === property.imageId);
  
  useEffect(() => {
    // Defer currency formatting to client-side to avoid hydration errors
    const profit = property.totalIncome - property.expenses;
    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(value);
    
    setFormattedIncome(formatCurrency(property.totalIncome));
    setFormattedExpenses(formatCurrency(property.expenses));
    setFormattedProfit(formatCurrency(profit));
  }, [property.totalIncome, property.expenses]);
  
  const profit = property.totalIncome - property.expenses;
  const profitability = property.totalIncome > 0 ? (profit / property.totalIncome) * 100 : 0;

  return (
    <div onClick={onSelect} className="block group cursor-pointer">
        <Card className="glassmorphism overflow-hidden relative rounded-3xl p-4 flex flex-col justify-between h-96 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/20">
        {image && (
            <Image
            src={image.imageUrl}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 -z-10"
            data-ai-hint={image.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent -z-10" />
        
        <div className="text-white">
            <h3 className="font-headline text-xl font-semibold">{property.name}</h3>
            <p className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            {property.location}
            </p>
        </div>
        
        <div className="space-y-4 text-white">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5" title="Total Income">
                    <ArrowUp className="h-4 w-4 text-profit" />
                    {formattedIncome ? (
                        <span className="font-semibold">{formattedIncome}</span>
                    ) : (
                        <Skeleton className="h-5 w-12 bg-white/20" />
                    )}
                </div>
                <div className="flex items-center gap-1.5" title="Expenses">
                    <ArrowDown className="h-4 w-4 text-destructive" />
                    {formattedExpenses ? (
                        <span className="font-semibold">{formattedExpenses}</span>
                    ) : (
                        <Skeleton className="h-5 w-12 bg-white/20" />
                    )}
                </div>
                <div className="flex items-center gap-1.5 font-bold" title="Profit">
                    <Wallet className="h-4 w-4 text-primary" />
                    {formattedProfit ? (
                        <span className="font-headline text-base">{formattedProfit}</span>
                    ) : (
                        <Skeleton className="h-5 w-12 bg-white/20" />
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80">
                    <span>Profitability</span>
                    <span>{profitability.toFixed(0)}%</span>
                </div>
                <Progress value={profitability} className="h-1.5 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-primary/80 [&>div]:to-accent" />
            </div>
        </div>
        </Card>
    </div>
  );
}
