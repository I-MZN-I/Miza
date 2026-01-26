import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';
import { ChatAssistant } from '@/components/ai/chat-assistant';

export const metadata: Metadata = {
  title: 'Estate AI',
  description: 'AI-based Asset Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="relative flex min-h-dvh w-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <AppHeader />
              <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
          <Toaster />
          <ChatAssistant />
        </SidebarProvider>
      </body>
    </html>
  );
}
