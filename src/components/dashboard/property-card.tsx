'use client';

import Image from 'next/image';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, MapPin, Wallet } from 'lucide-react';
import { Progress } from '../ui/progress';

type PropertyCardProps = {
  property: Property;
};


export function PropertyCard({ property }: PropertyCardProps) {
  const profit = property.totalIncome - property.expenses;
  const profitability = property.totalIncome > 0 ? (profit / property.totalIncome) * 100 : 0;
  const image = PlaceHolderImages.find((img) => img.id === property.imageId);

  return (
    <Card className="glassmorphism group overflow-hidden relative h-80 rounded-2xl">
      {image && (
        <Image
          src={image.imageUrl}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={image.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative flex flex-col justify-end h-full p-6 text-white">
        <div>
            <h3 className="font-headline text-xl font-semibold">{property.name}</h3>
            <p className="flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            {property.location}
            </p>
        </div>
        
        <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2" title="Total Income">
                    <ArrowUp className="h-4 w-4 text-profit" />
                    <span className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(property.totalIncome)}</span>
                </div>
                <div className="flex items-center gap-2" title="Expenses">
                    <ArrowDown className="h-4 w-4 text-destructive" />
                    <span className="font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(property.expenses)}</span>
                </div>
                <div className="flex items-center gap-2 font-bold" title="Profit">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="font-headline">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, notation: 'compact' }).format(profit)}</span>
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
      </div>
    </Card>
  );
}
