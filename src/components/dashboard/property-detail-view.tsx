'use client';

import type { Property, Tenant, Expense, WithId } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, DollarSign, FileText, Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DocumentUploader } from '@/components/ai/document-uploader';
import { ScrollArea } from '../ui/scroll-area';
import { useCollection, useUser, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useState } from 'react';
import { Button } from '../ui/button';
import { AddEditTenantDialog } from './add-edit-tenant-dialog';
import { AddEditExpenseDialog } from './add-edit-expense-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

export function PropertyDetailView({ property }: { property: WithId<Property> | null }) {
  const { user } = useUser();
  const firestore = useFirestore();

  // State for dialogs
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
                   <Button onClick={handleAddTenant} size="sm"><Plus className="mr-2 h-4 w-4" /> Add Tenant</Button>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              {isLoadingTenants ? <Loader2 className="animate-spin" /> : (
              <Table>
              <TableHeader>
                  <TableRow className="border-white/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Move-in Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {tenants?.map(tenant => (
                  <TableRow key={tenant.id} className="border-white/10 hover:bg-primary/5">
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{formatCurrency(tenant.rent)}</TableCell>
                      <TableCell>{tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : 'N/A'}</TableCell>
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
                  </TableRow>
                  ))}
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
                  <TableHead className="text-right">Actions</TableHead>
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
        </div>
      </ScrollArea>
       {property && (
        <>
          <AddEditTenantDialog
            propertyId={property.id}
            tenant={editingTenant}
            open={isTenantDialogOpen}
            onOpenChange={setIsTenantDialogOpen}
            onTenantUpdated={() => {
              // Real-time listener in useCollection handles the update
            }}
          />
          <AddEditExpenseDialog
            propertyId={property.id}
            expense={editingExpense}
            open={isExpenseDialogOpen}
            onOpenChange={setIsExpenseDialogOpen}
            onExpenseUpdated={() => {
              // Real-time listener in useCollection handles the update
            }}
          />
        </>
      )}
    </>
  );
}
