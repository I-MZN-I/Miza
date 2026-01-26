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
    <main className="flex min-h-dvh w-full flex-col items-center justify-center p-4 bg-background">
       <div className="w-full max-w-sm">
        <div className="border border-white/10 rounded-xl px-4 py-8 md:px-8">
            <div className="flex flex-col items-center text-center mb-8">
                <h1 className="font-headline text-4xl font-bold text-white tracking-tighter mb-4">AssetPro</h1>
            </div>
            <AuthForm />
        </div>
        <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
                <a href="#" className="font-semibold text-primary hover:underline">Forgot Password?</a>
            </p>
        </div>
       </div>
    </main>
  );
}
