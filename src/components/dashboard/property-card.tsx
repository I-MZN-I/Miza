'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Property, WithId } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { MapPin, Rocket } from 'lucide-react';
import { Progress } from '../ui/progress';

type PropertyCardProps = {
  property: WithId<Property>;
  onSelect?: () => void;
};

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const [profitability, setProfitability] = useState(0);

  useEffect(() => {
    const totalIncome = property.tenants?.reduce((sum, tenant) => sum + tenant.rent, 0) || 0;
    const totalExpenses = property.expenseDetails?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
    const profit = totalIncome - totalExpenses;
    const calculatedProfitability = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;
    setProfitability(calculatedProfitability);
  }, [property.tenants, property.expenseDetails]);

  return (
    <div onClick={onSelect} className="block group cursor-pointer">
        <Card className="glassmorphism overflow-hidden rounded-2xl p-4 flex gap-4 items-center transition-all duration-300 group-hover:bg-white/10 group-hover:shadow-primary/10">
          {property.imageURL && (
            <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={property.imageURL}
                alt={property.buildingName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex-grow space-y-3">
            <div>
                <h3 className="font-headline font-semibold">{property.buildingName}</h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </p>
            </div>
            
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Profitability: {profitability.toFixed(0)}%</span>
                </div>
                <Progress value={profitability} className="h-1 bg-muted/50 [&>div]:bg-primary" />
            </div>
          </div>
        </Card>
    </div>
  );
}
