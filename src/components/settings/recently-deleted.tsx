'use client';

import { useCollection, useUser, useFirestore, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import type { Property, WithId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Undo } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function RecentlyDeleted() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const deletedPropertiesQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(
            collection(firestore, 'users', user.uid, 'properties'),
            where('status', '==', 'deleted')
        );
    }, [firestore, user]);

    const { data: deletedProperties, isLoading } = useCollection<Property>(deletedPropertiesQuery);

    const handleRestore = (property: WithId<Property>) => {
        if (!user) return;
        const propertyDoc = doc(firestore, 'users', user.uid, 'properties', property.id);
        updateDocumentNonBlocking(propertyDoc, { status: 'active', deletedAt: null });
        toast({ title: 'Property Restored', description: `${property.buildingName} has been restored.` });
    };

    const handleDeleteForever = (property: WithId<Property>) => {
        if (!user) return;
        const propertyDoc = doc(firestore, 'users', user.uid, 'properties', property.id);
        deleteDocumentNonBlocking(propertyDoc);
        toast({ variant: 'destructive', title: 'Property Deleted', description: `${property.buildingName} has been permanently deleted.` });
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!deletedProperties || deletedProperties.length === 0) {
        return (
            <div className="text-center py-12 glassmorphism rounded-xl mt-4">
                <h3 className="font-headline text-lg">No recently deleted properties.</h3>
                <p className="text-muted-foreground text-sm">Deleted properties will appear here for 10 days.</p>
            </div>
        );
    }
    
    const isPast10Days = (deletedAt: any) => {
        if (!deletedAt) return false;
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        return deletedAt.toDate() < tenDaysAgo;
    }

    return (
        <div className="mt-4 space-y-4">
            {deletedProperties.map(prop => (
                <Card key={prop.id} className="glassmorphism flex items-center justify-between p-4">
                    <div>
                        <CardTitle className="text-base">{prop.buildingName}</CardTitle>
                        <CardDescription className="text-xs">
                           Deleted on {prop.deletedAt ? new Date(prop.deletedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                           {isPast10Days(prop.deletedAt) && <span className="text-destructive"> - Will be deleted soon</span>}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleRestore(prop)}>
                            <Undo className="mr-2 h-4 w-4" /> Restore
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Forever
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete '{prop.buildingName}' and all its data. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteForever(prop)}>Yes, delete forever</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </Card>
            ))}
        </div>
    );
}
