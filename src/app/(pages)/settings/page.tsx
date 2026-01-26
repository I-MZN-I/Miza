import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </header>

      <Card className="glassmorphism">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/50">
            <AvatarImage src="https://picsum.photos/seed/avatar/100/100" />
            <AvatarFallback>PO</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Property Owner</CardTitle>
            <CardDescription>owner@estate.ai</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button>
            <User className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardContent>
      </Card>

       <Card className="glassmorphism">
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
    </div>
  );
}
