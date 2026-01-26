import { AICommandCenter } from '@/components/ai/command-center';
import { AnalyticsBar } from '@/components/dashboard/analytics-bar';
import { PropertyList } from '@/components/dashboard/property-list';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <AnalyticsBar />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <PropertyList />
        </div>
        <div className="lg:col-span-1">
          <AICommandCenter />
        </div>
      </div>
    </div>
  );
}
