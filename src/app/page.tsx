import { PropertyList } from '@/components/dashboard/property-list';
import { BudgetPlanner } from '@/components/ai/budget-planner';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your property overview.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <PropertyList />
        </div>
        <div className="lg:col-span-1">
          <BudgetPlanner />
        </div>
      </div>
    </div>
  );
}
