import { properties } from '@/lib/data';
import { PropertyCard } from './property-card';

export function PropertyList() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-headline text-2xl font-semibold">Your Properties</h2>
      <div className="grid grid-cols-1 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
