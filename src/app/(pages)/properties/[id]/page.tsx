'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { properties } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Building, DollarSign, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DocumentUploader } from '@/components/ai/document-uploader';
import { useEffect, useState } from 'react';

export default function PropertyDetailPage() {
  const params = useParams();
  const { id } = params;
  
  const [property, setProperty] = useState<typeof properties[0] | undefined>(undefined);
  const [image, setImage] = useState<typeof PlaceHolderImages[0] | undefined>(undefined);
  
  useEffect(() => {
    const foundProperty = properties.find((p) => p.id === id);
    setProperty(foundProperty);
    if (foundProperty) {
      const foundImage = PlaceHolderImages.find((img) => img.id === foundProperty.imageId);
      setImage(foundImage);
    }
  }, [id]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  if (!property) {
    return (
      <div className="p-4 md:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-bold">Property not found</h1>
        <Link href="/properties">
          <Button variant="link">Go back to properties</Button>
        </Link>
      </div>
    );
  }
  
  const totalSqFt = property.rooms.sizes.reduce((total, size) => {
    const dims = size.replace(' sqft', '').split('x');
    if (dims.length === 2) {
      return total + (parseInt(dims[0], 10) * parseInt(dims[1], 10));
    }
    return total;
  }, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/properties">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h1 className="font-headline text-3xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground">{property.location}</p>
        </div>
      </header>

      <div className="grid gap-8">
        <Card className="glassmorphism overflow-hidden">
            {image && (
                <div className="relative h-48 w-full">
                    <Image
                        src={image.imageUrl}
                        alt={property.name}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}
        </Card>
        
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="text-primary"/> Room Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Total Rooms:</span> {property.rooms.count}</div>
                <div><span className="font-semibold">Total Area:</span> {totalSqFt} sqft</div>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {property.rooms.sizes.map((size, index) => (
                    <li key={index}>Room {index + 1}: {size}</li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Tenants</CardTitle>
            <CardDescription>Rent from each tenant and lease information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Rent</TableHead>
                  <TableHead className="text-right">Lease End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {property.tenants.map(tenant => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(tenant.rent)}</TableCell>
                    <TableCell className="text-right">{new Date(tenant.leaseEndDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="text-primary"/> Expenses</CardTitle>
            <CardDescription>Breakdown of all expenses for this property.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {property.expenseDetails.map(expense => (
                  <TableRow key={expense.id}>
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
        
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload className="text-primary"/> Documents</CardTitle>
            <CardDescription>Upload and manage lease agreements, receipts, and other documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              triggerButtonText="Upload Lease Document"
              dialogTitle="Upload Lease Agreement"
              dialogDescription="Extract tenant name, rent, and lease duration automatically."
              icon={Upload}
              feature="lease"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
