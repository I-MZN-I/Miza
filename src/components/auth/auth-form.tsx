'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateAnonymousSignIn } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: 'Login successful!' });
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: 'Account created successfully!' });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    try {
        initiateAnonymousSignIn(auth);
        toast({ title: 'Logged in as guest.' });
    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
              <Input id="email" type="email" placeholder="Email address" {...register('email')} className="bg-white/5" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
              <Input id="password" type="password" placeholder="Password" {...register('password')} className="bg-white/5" />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
      </form>
      
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="mx-4 text-xs text-muted-foreground font-semibold">OR</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>
      
      <Button variant="ghost" className="w-full text-primary" onClick={handleGuestLogin}>
          <User className="mr-2 h-4 w-4" />
          Log in as Guest
      </Button>

      <div className="mt-8 text-center text-sm border-t border-white/10 pt-6">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-muted-foreground p-0 h-auto">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <span className="font-semibold text-primary ml-1">{isLogin ? 'Sign Up' : 'Log In'}</span>
          </Button>
      </div>
    </>
  );
}
