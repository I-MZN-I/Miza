import { AICommandCenter } from '@/components/ai/command-center';

export default function AiHubPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-3xl font-bold">AI Center</h1>
        <p className="text-muted-foreground">Your intelligent property assistant</p>
      </header>
      <AICommandCenter />
    </div>
  );
}
