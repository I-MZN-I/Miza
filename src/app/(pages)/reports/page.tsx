import { ReportGenerator } from "@/components/ai/report-generator";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Reports
        </h1>
        <p className="text-muted-foreground">
          Generate and view your property reports.
        </p>
      </div>
      <div className="flex items-center justify-start">
        <ReportGenerator />
      </div>
    </div>
  );
}
