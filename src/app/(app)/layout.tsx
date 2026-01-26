'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from '@/components/icons';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Icons.logo className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
      <main className="pb-28">
        {children}
        <BottomNav />
      </main>
  );
}
