'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { Icons } from '@/components/icons';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Icons.logo className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
            <Icons.logo className="h-12 w-12 text-primary mb-4" />
            <h1 className="font-headline text-3xl font-bold text-white">AssetPro</h1>
            <p className="text-muted-foreground">Sign in to manage your portfolio.</p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
