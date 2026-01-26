'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, FileText, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';

const actions = [
    { label: 'Optimize Costs', icon: TrendingDown, description: 'Analyze expenses and find savings.' },
    { label: 'Predict Returns', icon: TrendingUp, description: 'Forecast future investment performance.' },
    { label: 'Suggest Investments', icon: Lightbulb, description: 'Discover new property opportunities.' },
    { label: 'Generate Report', icon: FileText, description: 'Create a comprehensive financial summary.' },
];

function ActionButton({ icon: Icon, label, description }: { icon: React.ElementType, label: string, description: string }) {
    return (
        <Button variant="outline" className="h-auto w-full justify-start p-3 text-left">
            <Icon className="mr-4 h-6 w-6 text-primary" />
            <div>
                <p className="font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </Button>
    )
}

export function AICommandCenter() {
  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">AI Command Center</CardTitle>
        <Bot className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
            Let AI assist you with one-tap actions.
        </p>
        {actions.map(action => (
            <ActionButton key={action.label} icon={action.icon} label={action.label} description={action.description}/>
        ))}
      </CardContent>
    </Card>
  );
}
