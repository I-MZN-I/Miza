'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building, DollarSign, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DocumentUploader } from '@/components/ai/document-uploader';
import { ScrollArea } from '../ui/scroll-area';

export function PropertyDetailView({ property }: { property: Property | null }) {
  if (!property) {
    return null;
  }
  
  const image = PlaceHolderImages.find((img) => img.id === property.imageId);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const totalSqFt = property.rooms.sizes.reduce((total, size) => {
    const dims = size.replace(' sqft', '').split('x');
    if (dims.length === 2) {
      return total + (parseInt(dims[0], 10) * parseInt(dims[1], 10));
    }
    return total;
  }, 0);

  return (
    <ScrollArea className="h-full">
        <div className="p-1 pr-6">
            <header className="flex items-start gap-4 mb-8">
                {image && (
                    <div className="relative h-28 w-28 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                        <Image
                            src={image.imageUrl}
                            alt={property.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    </div>
                )}
                <div className="pt-2">
                <h1 className="font-headline text-3xl font-bold">{property.name}</h1>
                <p className="text-muted-foreground">{property.location}</p>
                </div>
            </header>

            <div className="grid gap-6">
                <Card className="bg-white/5 border border-white/10 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Building className="text-primary"/> Room Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold text-muted-foreground">Total Rooms:</span> {property.rooms.count}</div>
                        <div><span className="font-semibold text-muted-foreground">Total Area:</span> {totalSqFt} sqft</div>
                    </div>
                    <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        {property.rooms.sizes.map((size, index) => (
                            <li key={index}>Room {index + 1}: <span className="text-foreground">{size}</span></li>
                        ))}
                    </ul>
                </CardContent>
                </Card>
                
                <Card className="bg-white/5 border border-white/10 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><User className="text-primary"/> Tenants</CardTitle>
                    <CardDescription>Rent from each tenant and lease information.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                    <TableHeader>
                        <TableRow className="border-white/10">
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Rent</TableHead>
                        <TableHead className="text-right">Lease End</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {property.tenants.map(tenant => (
                        <TableRow key={tenant.id} className="border-white/10 hover:bg-primary/10">
                            <TableCell className="font-medium">{tenant.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(tenant.rent)}</TableCell>
                            <TableCell className="text-right">{new Date(tenant.leaseEndDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>

                <Card className="bg-white/5 border border-white/10 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><DollarSign className="text-primary"/> Expenses</CardTitle>
                    <CardDescription>Breakdown of all expenses for this property.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
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
                        {property.expenseDetails.map(expense => (
                        <TableRow key={expense.id} className="border-white/10 hover:bg-primary/10">
                            <TableCell className="font-medium">{expense.name}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    expense.category === 'Utility' ? 'default' : 
                                    expense.category === 'Maintenance' ? 'secondary' : 'outline'
                                } className={
                                    expense.category === 'Utility' ? 'bg-accent text-accent-foreground' : ''
                                }>{expense.category}</Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                            <TableCell className="text-right">{new Date(expense.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
                
                <Card className="bg-white/5 border border-white/10 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><FileText className="text-primary"/> Documents</CardTitle>
                        <CardDescription>Upload and manage lease agreements, receipts, and other documents.</CardDescription>
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
