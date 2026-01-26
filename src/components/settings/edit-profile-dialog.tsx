'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  imageFile: z.custom<FileList>().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const imageFile = watch('imageFile');
  const [preview, setPreview] = useState<string | undefined>(user?.photoURL ?? undefined);

  useEffect(() => {
    if (user) {
      reset({ displayName: user.displayName || '' });
      setPreview(user.photoURL || undefined);
    }
  }, [user, open, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }

    setIsLoading(true);
    try {
      let photoURL = user.photoURL;

      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        if (file.size > 500 * 1024) { // 500KB limit
          toast({ variant: 'destructive', title: 'Image too large', description: 'Please upload an image smaller than 500KB.' });
          setIsLoading(false);
          return;
        }
        photoURL = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: photoURL,
      });
      
      // Update user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDocumentNonBlocking(userDocRef, {
          displayName: data.displayName,
          photoURL: photoURL,
      }, { merge: true });

      toast({ title: 'Profile Updated!' });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update profile.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphism">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={preview} />
              <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <Button type="button" size="sm" variant="ghost" onClick={() => document.getElementById('imageFile')?.click()}>
              Change Photo
            </Button>
            <Input 
              id="imageFile" 
              type="file" 
              {...register('imageFile')}
              className="hidden" 
              accept="image/png, image/jpeg, image/webp" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" {...register('displayName')} className="bg-white/5" />
            {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
