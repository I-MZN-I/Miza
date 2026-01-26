import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/10 bg-background/50 px-4 backdrop-blur-xl sm:h-16 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search properties, tenants, reports..."
          className="w-full rounded-lg bg-transparent pl-8 md:w-[280px] lg:w-[420px]"
        />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </header>
  );
}
