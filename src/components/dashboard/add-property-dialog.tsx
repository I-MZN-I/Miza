'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const propertySchema = z.object({
  buildingName: z.string().min(3, { message: 'Building name must be at least 3 characters' }),
  location: z.string().min(5, { message: 'Location must be at least 5 characters' }),
  imageFile: z.custom<FileList>().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function AddPropertyDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
  });

  const onSubmit = async (data: PropertyFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to add a property.' });
      return;
    }

    setIsLoading(true);
    try {
      let imageURL = '';
      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        if (file.size > 500 * 1024) { // 500KB limit
          toast({
            variant: 'destructive',
            title: 'Image too large',
            description: 'Please upload an image smaller than 500KB.',
          });
          setIsLoading(false);
          return;
        }
        imageURL = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });
      }

      const propertiesCollection = collection(firestore, 'users', user.uid, 'properties');
      await addDocumentNonBlocking(propertiesCollection, {
        buildingName: data.buildingName,
        location: data.location,
        imageURL: imageURL,
        userId: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Property Added!',
        description: `${data.buildingName} has been added to your portfolio.`,
      });
      reset();
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not add property.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glassmorphism">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buildingName">Property Name</Label>
            <Input id="buildingName" {...register('buildingName')} placeholder="e.g., Emerald Towers" className="bg-white/5" />
            {errors.buildingName && <p className="text-sm text-destructive">{errors.buildingName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} placeholder="e.g., 123 Green Avenue, Metropolis" className="bg-white/5" />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Property Image (Optional)</Label>
            <Input 
              id="imageFile" 
              type="file" 
              {...register('imageFile')} 
              className="bg-white/5 items-center text-muted-foreground py-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              accept="image/png, image/jpeg, image/webp" 
            />
            <p className="text-xs text-muted-foreground">Max file size: 500KB. This is a temporary solution due to database limits.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
