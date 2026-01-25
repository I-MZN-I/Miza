import { properties } from '@/lib/data';
import { PropertyCard } from './property-card';
import {
  Accordion,
} from "@/components/ui/accordion"

export function PropertyList() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-headline text-2xl font-semibold">Your Properties</h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </Accordion>
    </div>
  );
}
