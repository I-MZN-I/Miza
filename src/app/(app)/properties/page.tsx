'use client';

import { PropertyList } from "@/components/dashboard/property-list";
import { useCollection, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import type { Property } from '@/lib/types';
import { AddPropertyDialog } from "@/components/dashboard/add-property-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


export default function PropertiesPage() {
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
    <div className="p-4 md:p-6 lg:p-8">
       <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Your complete property portfolio.</p>
        </div>
        <AddPropertyDialog>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
        </AddPropertyDialog>
      </header>
      <PropertyList properties={properties} isLoading={isLoading} viewMode="full" />
    </div>
  );
}

    