'use client';

import type { Property, Tenant, Expense, WithId } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building, DollarSign, FileText, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DocumentUploader } from '@/components/ai/document-uploader';
import { ScrollArea } from '../ui/scroll-area';
import { useCollection, useUser } from '@/firebase';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';

export function PropertyDetailView({ property }: { property: WithId<Property> | null }) {
  const { user } = useUser();
  const firestore = useFirestore();

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
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <ScrollArea className="h-full">
        <div className="p-1 pr-6">
            <header className="flex items-start gap-4 mb-8">
                {property.imageURL && (
                    <div className="relative h-28 w-28 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                        <Image
                            src={property.imageURL}
                            alt={property.buildingName}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="pt-2">
                <h1 className="font-headline text-3xl font-bold">{property.buildingName}</h1>
                <p className="text-muted-foreground">{property.location}</p>
                </div>
            </header>

            <div className="grid gap-6">
                <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                            <User className="h-6 w-6"/>
                        </div>
                        <div>
                            <CardTitle className="font-headline text-lg">Tenants</CardTitle>
                            <CardDescription>Rent from each tenant and lease information.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingTenants ? <Loader2 className="animate-spin" /> : (
                    <Table>
                    <TableHeader>
                        <TableRow className="border-white/10">
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Rent</TableHead>
                        <TableHead>Move-in Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tenants?.map(tenant => (
                        <TableRow key={tenant.id} className="border-white/10 hover:bg-primary/5">
                            <TableCell className="font-medium">{tenant.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(tenant.rent)}</TableCell>
                            <TableCell>{tenant.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : 'N/A'}</TableCell>
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
                            <DollarSign className="h-6 w-6"/>
                        </div>
                        <div>
                            <CardTitle className="font-headline text-lg">Expenses</CardTitle>
                            <CardDescription>Breakdown of all expenses for this property.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingExpenses ? <Loader2 className="animate-spin" /> : (
                    <Table>
                    <TableHeader>
                        <TableRow className="border-white/10">
                        <TableHead>Expense</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses?.map(expense => (
                        <TableRow key={expense.id} className="border-white/10 hover:bg-primary/5">
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>
                                <Badge variant='secondary'>{expense.categoryId}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                            <TableCell className="text-right">{new Date(expense.date).toLocaleDateString()}</TableCell>
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
        </div>
    </ScrollArea>
  );
}
