import { PropertyList } from "@/components/dashboard/property-list";

export default function PropertiesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
       <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Properties</h1>
        <p className="text-muted-foreground">Your complete property portfolio.</p>
      </header>
      <PropertyList />
    </div>
  );
}
