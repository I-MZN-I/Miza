'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth, useUser, useCollection, useFirestore } from "@/firebase";
import { LogOut, Edit, Building, Users } from "lucide-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { EditProfileDialog } from "@/components/settings/edit-profile-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RecentlyDeleted } from '@/components/settings/recently-deleted';
import { collection, query } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import type { Property } from "@/lib/types";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="font-bold text-xl">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const propertiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'properties'));
  }, [firestore, user]);

  const { data: properties } = useCollection<Property>(propertiesQuery);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const totalProperties = properties?.filter(p => p.status === 'active').length ?? 0;
  const totalTenants = properties?.reduce((acc, p) => acc + (p.tenants?.length ?? 0), 0) ?? 0;

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-8">
        <header className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
             <h1 className="font-bold text-2xl">{user?.displayName || user?.email}</h1>
             <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 text-center p-4 glassmorphism rounded-xl">
           <Stat label="Properties" value={totalProperties} />
           <Stat label="Tenants" value={totalTenants} />
        </div>
        
        <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="deleted">Recently Deleted</TabsTrigger>
          </TabsList>
          <TabsContent value="preferences">
             <Card className="glassmorphism mt-4">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your app experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-switcher">Dark Mode</Label>
                    <Switch id="theme-switcher" defaultChecked disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications-switch">Push Notifications</Label>
                    <Switch id="notifications-switch" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-personalization-switch">AI Personalization</Label>
                    <Switch id="ai-personalization-switch" defaultChecked />
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="deleted">
            <RecentlyDeleted />
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  );
}
