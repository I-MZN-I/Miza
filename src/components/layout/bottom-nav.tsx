'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Building2, Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/ai-assistant', label: 'AI', icon: Sparkles },
  { href: '/settings', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 h-16 w-[calc(100%-2rem)] max-w-sm">
      <nav className="relative flex h-full items-center justify-around rounded-full glassmorphism p-2">
        <AnimatePresence>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "relative flex h-full flex-1 flex-col items-center justify-center rounded-full text-xs transition-colors z-10",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
                <motion.div 
                    className="relative"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                    <item.icon className="h-5 w-5" />
                    {isActive && 
                        <motion.div 
                            className="absolute -inset-2 bg-primary/30 rounded-full blur-md"
                            layoutId="nav-glow"
                            initial={false}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{type: 'spring', stiffness: 300, damping: 30}}
                        />
                    }
                </motion.div>
                <span className={cn("relative", isActive && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
        </AnimatePresence>
      </nav>
    </div>
  );
}
