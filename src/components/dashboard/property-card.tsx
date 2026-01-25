'use client';

import Image from 'next/image';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
} from '@/components/ui/card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  BedDouble,
  Building,
  CalendarDays,
  ChevronRight,
  MapPin,
  Receipt,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FinancialChart } from './financial-chart';
import { RentPrediction } from './rent-prediction';
import { DocumentUploader } from '../ai/document-uploader';

type PropertyCardProps = {
  property: Property;
};

function StatCard({
  label,
  value,
  icon,
  change,
  changeType,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
}) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-lg bg-muted p-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-headline text-xl font-semibold">{value}</p>
      </div>
      {change && (
        <div
          className={cn(
            'ml-auto flex items-center gap-1 text-xs',
            changeType === 'increase' ? 'text-green-500' : 'text-red-500'
          )}
        >
          {changeType === 'increase' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {change}
        </div>
      )}
    </div>
  );
}

export function PropertyCard({ property }: PropertyCardProps) {
  const profit = property.totalIncome - property.expenses;
  const image = PlaceHolderImages.find((img) => img.id === property.imageId);

  return (
    <AccordionItem value={property.id} className="border-none">
       <Card className="overflow-hidden bg-card/50">
        <AccordionTrigger className="p-4 hover:no-underline [&[data-state=open]>div>svg]:rotate-90">
            <div className="flex w-full items-center gap-4 text-left">
                {image && (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg md:h-32 md:w-40">
                    <Image
                    src={image.imageUrl}
                    alt={property.name}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    />
                </div>
                )}
                <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-lg font-semibold">{property.name}</h3>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {property.location}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm">
                        <div className="flex items-center gap-2" title="Total Income">
                            <ArrowUp className="h-4 w-4 text-primary" />
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(property.totalIncome)}</span>
                        </div>
                        <div className="flex items-center gap-2" title="Expenses">
                            <ArrowDown className="h-4 w-4 text-destructive" />
                             <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(property.expenses)}</span>
                        </div>
                         <div className="flex items-center gap-2 font-semibold" title="Profit">
                            <Wallet className="h-4 w-4 text-accent" />
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(profit)}</span>
                        </div>
                    </div>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 shrink-0 transition-transform duration-200" />
            </div>
        </AccordionTrigger>
        <AccordionContent className="border-t border-border/50 bg-background/50 p-4 md:p-6">
           <Tabs defaultValue="overview">
            <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tenants">Tenants</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard label="Total Rooms" value={`${property.rooms.count}`} icon={BedDouble} />
                    <StatCard label="Monthly Income" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(property.totalIncome)} icon={Banknote} />
                    <StatCard label="Total Tenants" value={`${property.tenants.length}`} icon={Users} />
                </div>
                <RentPrediction currentRent={property.currentRent} />
            </TabsContent>
            <TabsContent value="tenants">
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Tenant Name</TableHead>
                        <TableHead>Rent</TableHead>
                        <TableHead>Lease End Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {property.tenants.map(tenant => (
                            <TableRow key={tenant.id}>
                                <TableCell className="font-medium">{tenant.name}</TableCell>
                                <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(tenant.rent)}</TableCell>
                                <TableCell>{new Date(tenant.leaseEndDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TabsContent>
            <TabsContent value="expenses" className="space-y-6">
                <FinancialChart />
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Expense</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {property.expenseDetails.map(expense => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.name}</TableCell>
                                <TableCell><Badge variant="secondary">{expense.category}</Badge></TableCell>
                                <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(expense.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TabsContent>
             <TabsContent value="documents" className="space-y-4">
                <h4 className="font-semibold">Document Intelligence</h4>
                <p className="text-sm text-muted-foreground">Upload lease documents or receipts for AI-powered analysis.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DocumentUploader
                        triggerButtonText="Upload Lease"
                        dialogTitle="Lease Document Intelligence"
                        dialogDescription="Upload a lease document to automatically extract key details."
                        icon={Building}
                        feature="lease"
                    />
                    <DocumentUploader
                        triggerButtonText="Upload Receipt"
                        dialogTitle="Smart Expense Categorization"
                        dialogDescription="Upload a bill or receipt to automatically categorize the expense."
                        icon={Receipt}
                        feature="expense"
                    />
                </div>
            </TabsContent>
           </Tabs>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
