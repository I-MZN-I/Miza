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
import type { Expense, WithId } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const expenseSchema = z.object({
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  amount: z.preprocess((val) => Number(val), z.number().positive({ message: 'Amount must be a positive number' })),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  receiptURL: z.string().url().optional().or(z.literal('')),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type AddEditExpenseDialogProps = {
  propertyId: string;
  expense?: WithId<Expense> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseUpdated: () => void;
};

const expenseCategories = ['Maintenance', 'Utilities', 'Taxes', 'Insurance', 'Management', 'Other'];

export function AddEditExpenseDialog({ propertyId, expense, open, onOpenChange, onExpenseUpdated }: AddEditExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditing = !!expense;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
  });

  const categoryId = watch('categoryId');

  useEffect(() => {
    if (open) {
      if (expense) {
        reset({
          ...expense,
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        });
      } else {
        reset({
          description: '',
          categoryId: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          receiptURL: '',
        });
      }
    }
  }, [expense, open, reset]);

  const onSubmit = async (data: ExpenseFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    setIsLoading(true);
    try {
      const expenseData = { ...data, propertyId: propertyId, amount: Number(data.amount) };
      const expensesCollection = collection(firestore, 'users', user.uid, 'properties', propertyId, 'expenses');
      
      if (isEditing && expense) {
        const expenseDoc = doc(expensesCollection, expense.id);
        setDocumentNonBlocking(expenseDoc, expenseData, { merge: true });
        toast({ title: 'Expense Updated!', description: 'The expense has been updated.' });
      } else {
        addDocumentNonBlocking(expensesCollection, expenseData);
        toast({ title: 'Expense Added!', description: 'The expense has been recorded.' });
      }
      
      onExpenseUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not save expense.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphism">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} placeholder="e.g., Leaky faucet repair" className="bg-white/5" />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={(value) => setValue('categoryId', value, { shouldValidate: true })} value={categoryId}>
                    <SelectTrigger className="bg-white/5">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input id="amount" type="number" {...register('amount')} className="bg-white/5" />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="date">Date of Expense</Label>
            <Input id="date" type="date" {...register('date')} className="bg-white/5" />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
