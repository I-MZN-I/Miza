'use client';

import { AnalyticsBar } from '@/components/dashboard/analytics-bar';
import { PropertyList } from '@/components/dashboard/property-list';
import { useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import type { Property } from '@/lib/types';
import { AddPropertyDialog } from '@/components/dashboard/add-property-dialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const propertiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'properties'),
      where('status', '==', 'active')
    );
  }, [firestore, user]);

  const { data: properties, isLoading } = useCollection<Property>(propertiesQuery);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Smart Overview</p>
        </div>
        <AddPropertyDialog>
            <Button size="icon" className="rounded-full h-10 w-10">
                <Plus className="h-5 w-5" />
            </Button>
        </AddPropertyDialog>
      </header>
      <AnalyticsBar properties={properties} isLoading={isLoading} />
      <PropertyList properties={properties} isLoading={isLoading} />
    </div>
  );
}
