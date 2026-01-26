import { BrainCircuit } from "lucide-react";

export default function AiHubPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <BrainCircuit className="h-16 w-16 mb-4 text-primary" />
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        AI Hub
      </h1>
      <p className="text-muted-foreground max-w-md">
        This is your central hub for all AI-powered tools. Explore features like predictive analytics, report generation, and smart suggestions to maximize your property performance.
      </p>
    </div>
  );
}
