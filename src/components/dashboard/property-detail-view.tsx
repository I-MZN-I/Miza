'use client';

import type { Property, Tenant, Expense, WithId } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, DollarSign, FileText, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DocumentUploader } from '@/components/ai/document-uploader';
import { ScrollArea } from '../ui/scroll-area';
import { useCollection, useUser, useFirestore, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Button } from '../ui/button';
import { AddEditTenantDialog } from './add-edit-tenant-dialog';
import { AddEditExpenseDialog } from './add-edit-expense-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { EditPropertyDialog } from './edit-property-dialog';


const getMonthsInRange = (startDate: Date, endDate: Date) => {
    const months = [];
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);

    while (currentDate <= lastDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        months.push(`${year}-${month}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
};


export function PropertyDetailView({ property, onCloseDialog, viewMode = 'full' }: { property: WithId<Property> | null, onCloseDialog: () => void, viewMode?: 'full' | 'dashboard' }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<WithId<Tenant> | null>(null);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WithId<Expense> | null>(null);

  const tenantsQuery = useMemoFirebase(() => {
    if (!user || !property) return null;
    return collection(firestore, 'users', user.uid, 'properties', property.id, 'tenants');
  }, [firestore, user, property]);
  const { data: tenants, isLoading: isLoadingTenants } = useCollection<Tenant>(tenantsQuery);

  const expensesQuery = useMemoFirebase(() => {
    if (!user || !property) return null;
    return collection(firestore, 'users', user.uid, 'properties', property.id, 'expenses');
  }, [firestore, user, property]);
  const { data: expenses, isLoading: isLoadingExpenses } = useCollection<Expense>(expensesQuery);
  
  if (!property) {
    return null;
  }
  
  const handleSoftDeleteProperty = () => {
    if (!user || !property) return;
    const propertyDoc = doc(firestore, 'users', user.uid, 'properties', property.id);
    updateDocumentNonBlocking(propertyDoc, {
        status: 'deleted',
        deletedAt: serverTimestamp(),
    });
    toast({ title: 'Property Moved to Bin', description: `${property.buildingName} will be permanently deleted in 10 days.` });
    onCloseDialog();
  }
  
  const handleRecordPayment = (tenant: WithId<Tenant>) => {
    if(!user || !property) return;

    const startDate = tenant.rentStartsFrom ? new Date(tenant.rentStartsFrom) : new Date(tenant.moveInDate);
    const allMonths = getMonthsInRange(startDate, new Date());
    const oldestUnpaidMonth = allMonths.find(month => !tenant.payments?.[month]);
    
    if (!oldestUnpaidMonth) {
        toast({ variant: 'destructive', title: 'No Pending Rent', description: 'This tenant is all caught up.'});
        return;
    }

    const tenantRef = doc(firestore, 'users', user.uid, 'properties', property.id, 'tenants', tenant.id);
    const newPayments = {
      ...tenant.payments,
      [oldestUnpaidMonth]: { date: new Date().toISOString() }
    };
    
    updateDocumentNonBlocking(tenantRef, { payments: newPayments });

    toast({ title: 'Payment Recorded', description: `Rent for ${oldestUnpaidMonth} for ${tenant.name} marked as paid.` });
  };

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsTenantDialogOpen(true);
  };

  const handleEditTenant = (tenant: WithId<Tenant>) => {
    setEditingTenant(tenant);
    setIsTenantDialogOpen(true);
  };
  
  const handleDeleteTenant = (tenantId: string) => {
    if (!user || !property) return;
    const tenantDoc = doc(firestore, 'users', user.uid, 'properties', property.id, 'tenants', tenantId);
    deleteDocumentNonBlocking(tenantDoc);
  }

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseDialogOpen(true);
  };

  const handleEditExpense = (expense: WithId<Expense>) => {
    setEditingExpense(expense);
    setIsExpenseDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!user || !property) return;
    const expenseDoc = doc(firestore, 'users', user.uid, 'properties', property.id, 'expenses', expenseId);
    deleteDocumentNonBlocking(expenseDoc);
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const getPendingMonths = (tenant: WithId<Tenant>) => {
      if (!tenant.moveInDate) return 0;
      const startDate = tenant.rentStartsFrom ? new Date(tenant.rentStartsFrom) : new Date(tenant.moveInDate);
      const allMonths = getMonthsInRange(startDate, new Date());
      const unpaidMonths = allMonths.filter(month => !tenant.payments?.[month]);
      return unpaidMonths.length;
  }

  const getRentStatus = (tenant: WithId<Tenant>) => {
    const today = new Date();
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    
    const startDate = tenant.rentStartsFrom ? new Date(tenant.rentStartsFrom) : new Date(tenant.moveInDate);
    if (startDate > lastMonthDate) {
        return <Badge variant="secondary">New Tenant</Badge>;
    }
    
    const paymentForLastMonth = tenant.payments?.[lastMonthKey];

    if (paymentForLastMonth) {
        return <Badge variant="secondary" className="bg-profit/20 text-profit">Paid</Badge>;
    }
    
    return <Button size="sm" onClick={() => handleRecordPayment(tenant)}>Record Payment</Button>;
  }

  return (
    <>
      <ScrollArea className="h-full flex-1 -mx-6">
        <div className="px-6 py-4 grid gap-6">
          <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                          <User className="h-6 w-6"/>
                      </div>
                      <div>
                          <CardTitle className="font-headline text-lg">Tenants</CardTitle>
                          <CardDescription>Manage tenants and their rent.</CardDescription>
                      </div>
                  </div>
                   {viewMode === 'full' && <Button onClick={handleAddTenant} size="sm"><Plus className="mr-2 h-4 w-4" /> Add Tenant</Button>}
              </div>
          </CardHeader>
          <CardContent className="p-0">
              {isLoadingTenants ? <Loader2 className="animate-spin" /> : (
              <Table>
              <TableHeader>
                  <TableRow className="border-white/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Rent Status</TableHead>
                   {viewMode === 'full' && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {tenants?.map(tenant => {
                      const pendingCount = getPendingMonths(tenant);
                      return (
                      <TableRow key={tenant.id} className="border-white/10 hover:bg-primary/5">
                          <TableCell className="font-medium">
                              {tenant.name}
                              {pendingCount > 0 && <Badge variant="destructive" className="ml-2">{pendingCount} month{pendingCount > 1 ? 's' : ''} pending</Badge>}
                            </TableCell>
                          <TableCell>{formatCurrency(tenant.rent)}</TableCell>
                          <TableCell>{getRentStatus(tenant)}</TableCell>
                          {viewMode === 'full' && (
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleEditTenant(tenant)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the tenant {tenant.name}. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTenant(tenant.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                          )}
                      </TableRow>
                      )
                    })}
              </TableBody>
              </Table>
              )}
          </CardContent>
          </Card>

          <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                        <DollarSign className="h-6 w-6"/>
                    </div>
                    <div>
                        <CardTitle className="font-headline text-lg">Expenses</CardTitle>
                        <CardDescription>Breakdown of all expenses for this property.</CardDescription>
                    </div>
                </div>
                 <Button onClick={handleAddExpense} size="sm"><Plus className="mr-2 h-4 w-4" /> Add Expense</Button>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              {isLoadingExpenses ? <Loader2 className="animate-spin" /> : (
              <Table>
              <TableHeader>
                  <TableRow className="border-white/10">
                  <TableHead>Expense</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  {viewMode === 'full' && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {expenses?.map(expense => (
                  <TableRow key={expense.id} className="border-white/10 hover:bg-primary/5">
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>
                          <Badge variant='secondary'>{expense.categoryId}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      {viewMode === 'full' && (
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this expense. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      )}
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
              )}
          </CardContent>
          </Card>
          
          <Card className="bg-transparent border-none shadow-none">
              <CardHeader>
                  <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-6 w-6"/>
                      </div>
                      <div>
                          <CardTitle className="font-headline text-lg">Documents</CardTitle>
                          <CardDescription>Upload and manage lease agreements, receipts, and other documents.</CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                  <DocumentUploader
                      title="Upload Lease Document"
                      description="Extract tenant name, rent, and lease duration automatically."
                      feature="lease"
                  />
                  <DocumentUploader
                      title="Upload Expense Receipt"
                      description="Categorize expenses automatically from receipts and bills."
                      feature="expense"
                  />
              </CardContent>
          </Card>

          {viewMode === 'full' && (
            <Card className="bg-transparent border-destructive/50 border shadow-none">
               <CardHeader>
                   <CardTitle className="text-destructive">Danger Zone</CardTitle>
                   <CardDescription>
                      Deleting a property will move it to the "Recently Deleted" bin in your profile, where it will be permanently removed after 10 days.
                   </CardDescription>
               </CardHeader>
               <CardContent>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete this property</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will move the property '{property.buildingName}' to the bin. You can restore it for 10 days.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSoftDeleteProperty}>Yes, delete property</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
               </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
       {property && (
        <>
          <AddEditTenantDialog
            propertyId={property.id}
            tenant={editingTenant}
            open={isTenantDialogOpen}
            onOpenChange={setIsTenantDialogOpen}
          />
          <AddEditExpenseDialog
            propertyId={property.id}
            expense={editingExpense}
            open={isExpenseDialogOpen}
            onOpenChange={setIsExpenseDialogOpen}
            onExpenseUpdated={() => {}}
          />
        </>
      )}
    </>
  );
}

    