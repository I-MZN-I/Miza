'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Building, Plus, ScanLine, Sparkles } from 'lucide-react';

export function Fab() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 glassmorphism" side="top" align="end">
        <div className="grid gap-1">
            <Button variant="ghost" className="justify-start">
              <Building className="mr-2 h-4 w-4" />
              Add Property
            </Button>
            <Button variant="ghost" className="justify-start">
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Bills
            </Button>
            <Button variant="ghost" className="justify-start">
              <Sparkles className="mr-2 h-4 w-4" />
              Run AI Analysis
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
