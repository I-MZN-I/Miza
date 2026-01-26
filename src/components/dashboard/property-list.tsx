'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PropertyCard } from './property-card';
import { PropertyDetailView } from './property-detail-view';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Property, WithId } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function PropertyList({ properties, isLoading }: { properties: WithId<Property>[] | null, isLoading: boolean }) {
  const [selectedProperty, setSelectedProperty] = useState<WithId<Property> | null>(null);

  const handleCloseDialog = () => {
    setSelectedProperty(null);
  };

  if (isLoading) {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-headline text-2xl font-semibold">Your Properties</h2>
            <div className="grid grid-cols-1 gap-4">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
            </div>
        </div>
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="font-headline text-xl">No properties yet!</h3>
        <p className="text-muted-foreground">Click "Add Property" to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-headline text-2xl font-semibold">Your Properties</h2>
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onSelect={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      </div>
      <Dialog open={!!selectedProperty} onOpenChange={(isOpen) => !isOpen && setSelectedProperty(null)}>
        <DialogContent className="glassmorphism sm:max-w-2xl h-[90vh] max-h-[1000px] flex flex-col">
           {selectedProperty && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                    {selectedProperty.imageURL && (
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 shadow-lg">
                          <Image
                              src={selectedProperty.imageURL}
                              alt={selectedProperty.buildingName}
                              fill
                              className="object-cover"
                          />
                      </div>
                    )}
                    <div className="pt-1">
                        <DialogTitle className="font-headline text-2xl font-bold">{selectedProperty.buildingName}</DialogTitle>
                        <DialogDescription className="text-base">{selectedProperty.location}</DialogDescription>
                    </div>
                </div>
              </DialogHeader>
              <PropertyDetailView property={selectedProperty} onCloseDialog={handleCloseDialog} />
            </>
           )}
        </DialogContent>
      </Dialog>
    </>
  );
}
