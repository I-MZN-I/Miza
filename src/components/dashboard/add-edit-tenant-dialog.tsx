'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Tenant, WithId } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

const tenantSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  rent: z.preprocess((val) => Number(val), z.number().positive({ message: 'Rent must be a positive number' })),
  moveInDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  rentStartsFrom: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

type AddEditTenantDialogProps = {
  propertyId: string;
  tenant?: WithId<Tenant> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getMonthsInRange = (startDate: Date, endDate: Date) => {
    const months = [];
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastPayableMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);

    while (currentDate <= lastPayableMonth) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        months.push(`${year}-${month}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
};


export function AddEditTenantDialog({ propertyId, tenant, open, onOpenChange }: AddEditTenantDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!tenant;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
  });

  const tenantsCollectionRef = useMemoFirebase(() => {
      if (!user) return null;
      return collection(firestore, 'users', user.uid, 'properties', propertyId, 'tenants');
  }, [firestore, user, propertyId]);


  useEffect(() => {
    if (open) {
      if (tenant) {
        reset({
          ...tenant,
          moveInDate: tenant.moveInDate ? new Date(tenant.moveInDate).toISOString().split('T')[0] : '',
          rentStartsFrom: tenant.rentStartsFrom ? new Date(tenant.rentStartsFrom).toISOString().split('T')[0] : '',
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          rent: 0,
          moveInDate: new Date().toISOString().split('T')[0],
          rentStartsFrom: '',
        });
      }
    }
  }, [tenant, open, reset]);
  
  const updateTotalRent = async (updatedTenantData: TenantFormValues, existingTenant?: WithId<Tenant> | null) => {
    if (!user || !tenantsCollectionRef) return;
    
    const querySnapshot = await getDocs(tenantsCollectionRef);
    let totalRent = 0;

    querySnapshot.forEach(doc => {
        const tenantData = doc.data() as Tenant;
        if (doc.id === existingTenant?.id) {
             totalRent += updatedTenantData.rent;
        } else {
            totalRent += tenantData.rent;
        }
    });

    if (!existingTenant) {
        totalRent += updatedTenantData.rent;
    }

    const propertyDocRef = doc(firestore, 'users', user.uid, 'properties', propertyId);
    updateDocumentNonBlocking(propertyDocRef, { totalRent });
  };

  const onSubmit = async (data: TenantFormValues) => {
    if (!user || !tenantsCollectionRef) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && tenant) {
        const tenantData: Partial<Tenant> = {
          ...data,
          propertyId: propertyId,
          rent: Number(data.rent),
          rentStartsFrom: data.rentStartsFrom || tenant.rentStartsFrom || data.moveInDate,
        };
        const tenantDoc = doc(tenantsCollectionRef, tenant.id);
        setDocumentNonBlocking(tenantDoc, tenantData, { merge: true });
        await updateTotalRent(data, tenant);
        toast({ title: 'Tenant Updated!', description: `${data.name} has been updated.` });
      } else {
        const newPayments: { [key: string]: { date: string } } = {};
        
        if (!data.rentStartsFrom) {
            const moveIn = new Date(data.moveInDate);
            const today = new Date();
            // This logic assumes rent is paid for the month they move in.
            // It pre-populates payments for all past months.
            if (moveIn < today) {
                // Rent cycle: payment in Feb is for Jan. So, if they move in Jan, first payment is in Feb.
                // We need to mark all months *before* the current month's due period as paid.
                const firstRentDueDate = new Date(moveIn.getFullYear(), moveIn.getMonth() + 1, 1);
                const pastMonthsPaid = getMonthsInRange(firstRentDueDate, today);
                
                // Let's re-evaluate: If they move in Jan, and it's now March, they should have paid for Jan and Feb.
                // The `getMonthsInRange` includes the end month.
                // If today is March 15th, and they moved in Jan 10th, they owe for Jan & Feb.
                // If `rentStartsFrom` is blank, it means they are up to date.
                // It means they have paid for all months up to the one due in the current month.
                
                const allPastMonths = getMonthsInRange(moveIn, new Date());
                const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                
                for (const monthKey of allPastMonths) {
                    // If the user is up-to-date, we assume they've paid for all months except the one
                    // that is due THIS month (which is last month's rent).
                    if (monthKey !== currentMonthKey) {
                        newPayments[monthKey] = { date: new Date().toISOString() };
                    }
                }
            }
        }
        
        const tenantData: Partial<Tenant> = {
            ...data,
            propertyId: propertyId,
            rent: Number(data.rent),
            rentStartsFrom: data.rentStartsFrom || data.moveInDate,
            payments: newPayments,
        };

        addDocumentNonBlocking(tenantsCollectionRef, tenantData);
        await updateTotalRent(data);
        toast({ title: 'Tenant Added!', description: `${data.name} has been added.` });
      }
      
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
                <Label htmlFor="email">Email (Optional)</Label>
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
           <div className="space-y-2">
                <Label htmlFor="rentStartsFrom">Rent Calculation Start Date (Optional)</Label>
                <Input id="rentStartsFrom" type="date" {...register('rentStartsFrom')} className="bg-white/5" />
                <p className="text-xs text-muted-foreground">To track pending rent, select the first month for which payment is due. Leave blank if the tenant is up to date.</p>
                {errors.rentStartsFrom && <p className="text-sm text-destructive">{errors.rentStartsFrom.message}</p>}
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
