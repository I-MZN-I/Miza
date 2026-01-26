'use client';

import { useState } from 'react';
import { properties } from '@/lib/data';
import { PropertyCard } from './property-card';
import { PropertyDetailView } from './property-detail-view';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Property } from '@/lib/types';

export function PropertyList() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-headline text-2xl font-semibold">Your Properties</h2>
        <div className="grid grid-cols-1 gap-6">
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
           <PropertyDetailView property={selectedProperty} />
        </DialogContent>
      </Dialog>
    </>
  );
}
