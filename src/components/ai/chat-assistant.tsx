'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CornerDownLeft, MessageCircle, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const initialMessages: Message[] = [
    { id: '1', text: "Hello! How can I help you with your properties today?", sender: 'ai' },
];

const quickPrompts = [
    "Total income this month?",
    "Which property is most profitable?",
    "Show unpaid rents",
    "Generate a report for Emerald Towers",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `Based on your request for "${text}", here is a summary. Total income for this month is ₹24,500, with Emerald Towers being the most profitable property.`,
            sender: 'ai',
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
    }, 1500);
  };
  
  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-8 w-8" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md glassmorphism">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-accent"/>
              AI Assistant
            </SheetTitle>
            <SheetDescription>
              Ask questions about your properties and finances.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 -mx-6">
            <div className="space-y-4 px-6 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-2',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground"><Sparkles className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3 text-sm',
                      message.sender === 'user'
                        ? 'rounded-br-none bg-primary text-primary-foreground'
                        : 'rounded-bl-none bg-muted'
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-accent-foreground"><Sparkles className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                     <div className="max-w-[80%] rounded-lg p-3 text-sm rounded-bl-none bg-muted">
                        <Skeleton className="w-8 h-3 animate-bounce" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
           <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                    {quickPrompts.map(prompt => (
                        <Button key={prompt} variant="outline" size="sm" className="h-auto py-2 text-xs" onClick={() => handlePromptClick(prompt)}>
                            {prompt}
                        </Button>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="relative">
                    <Input
                        placeholder="e.g., 'Total income this month?'"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="pr-10"
                    />
                    <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" disabled={isLoading}>
                        <CornerDownLeft className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
           </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
