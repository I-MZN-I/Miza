'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Property, Tenant, WithId } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type PropertyCardProps = {
  property: WithId<Property>;
  onSelect?: () => void;
};

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const [profitability, setProfitability] = useState(0);
  const { user } = useUser();
  const firestore = useFirestore();

  const tenantsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'properties', property.id, 'tenants');
  }, [firestore, user, property.id]);
  
  const { data: tenants } = useCollection<Tenant>(tenantsQuery);
  const totalRent = tenants?.reduce((sum, tenant) => sum + tenant.rent, 0) ?? 0;
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);


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
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{formatCurrency(totalRent)}<span className="text-xs text-muted-foreground">/mo</span></span>
                </div>
                <div className="w-full space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Profitability: {profitability.toFixed(0)}%</span>
                    </div>
                    <Progress value={profitability} className="h-1 bg-muted/50 [&>div]:bg-primary" />
                </div>
            </div>
          </div>
        </Card>
    </div>
  );
}
