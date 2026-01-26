import { AnalyticsBar } from '@/components/dashboard/analytics-bar';
import { PropertyList } from '@/components/dashboard/property-list';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <header>
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Smart Overview</p>
      </header>
      <AnalyticsBar />
      <PropertyList />
    </div>
  );
}
