'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Tenant, WithId } from '@/lib/types';

const tenantSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  rent: z.preprocess((val) => Number(val), z.number().positive({ message: 'Rent must be a positive number' })),
  moveInDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

type AddEditTenantDialogProps = {
  propertyId: string;
  tenant?: WithId<Tenant> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantUpdated: () => void;
};

export function AddEditTenantDialog({ propertyId, tenant, open, onOpenChange, onTenantUpdated }: AddEditTenantDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!tenant;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
  });

  useEffect(() => {
    if (open) {
      if (tenant) {
        reset({
          ...tenant,
          moveInDate: tenant.moveInDate ? new Date(tenant.moveInDate).toISOString().split('T')[0] : '',
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          rent: 0,
          moveInDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [tenant, open, reset]);
  

  const onSubmit = async (data: TenantFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    setIsLoading(true);
    try {
      const tenantData = {
        ...data,
        propertyId: propertyId,
        rent: Number(data.rent)
      };

      const tenantsCollection = collection(firestore, 'users', user.uid, 'properties', propertyId, 'tenants');

      if (isEditing && tenant) {
        const tenantDoc = doc(tenantsCollection, tenant.id);
        setDocumentNonBlocking(tenantDoc, tenantData, { merge: true });
        toast({ title: 'Tenant Updated!', description: `${data.name} has been updated.` });
      } else {
        addDocumentNonBlocking(tenantsCollection, tenantData);
        toast({ title: 'Tenant Added!', description: `${data.name} has been added.` });
      }
      
      onTenantUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not save tenant.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphism">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tenant Name</Label>
            <Input id="name" {...register('name')} placeholder="John Doe" className="bg-white/5" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} placeholder="john.doe@email.com" className="bg-white/5" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} placeholder="+91 98765 43210" className="bg-white/5" />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="rent">Rent Amount (₹)</Label>
                <Input id="rent" type="number" {...register('rent')} className="bg-white/5" />
                {errors.rent && <p className="text-sm text-destructive">{errors.rent.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="moveInDate">Move-in Date</Label>
                <Input id="moveInDate" type="date" {...register('moveInDate')} className="bg-white/5" />
                {errors.moveInDate && <p className="text-sm text-destructive">{errors.moveInDate.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Tenant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
