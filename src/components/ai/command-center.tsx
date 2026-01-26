'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, FileText, Lightbulb, Send, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';

const actions = [
    { label: 'Optimize Costs', icon: TrendingDown },
    { label: 'Predict ROI', icon: TrendingUp },
    { label: 'Suggest Investment', icon: Lightbulb },
    { label: 'Generate Report', icon: FileText },
];

function ActionButton({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
    return (
        <Button variant="ghost" className="h-auto justify-start p-4 text-left bg-transparent border border-white/10 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg group">
            <Icon className="mr-4 h-6 w-6 text-primary/80 transition-colors group-hover:text-primary" />
            <p className="font-semibold text-base">{label}</p>
        </Button>
    )
}

export function AICommandCenter() {
  return (
    <div className="flex flex-col gap-8">
        <Card className="glassmorphism overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                    AI Chat
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Bot className="h-6 w-6 shrink-0 text-primary" />
                        <div className="glassmorphism rounded-xl rounded-bl-none p-3">
                            <p>Hello! How can I help you optimize your properties today?</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 justify-end">
                        <div className="glassmorphism rounded-xl rounded-br-none p-3 bg-primary/20 text-primary-foreground">
                            <p>What's my total income this month?</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <div className="relative mt-4 p-4 pt-0">
                <Input placeholder="Ask AI anything..." className="pr-12 bg-white/5 border-white/10" />
                <Button size="icon" className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </Card>

        <div className="space-y-3">
             <h3 className="font-headline text-xl font-semibold">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map(action => (
                    <ActionButton key={action.label} icon={action.icon} label={action.label}/>
                ))}
            </div>
        </div>
    </div>
  );
}
