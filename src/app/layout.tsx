import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';
import { Fab } from '@/components/layout/fab';

export const metadata: Metadata = {
  title: 'Estate AI - The Future of Property Management',
  description: 'Harness the power of AI to optimize your real estate investments. Smart analytics, predictions, and automation for the modern property owner.',
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
      <body className="font-sans antialiased">
        <SidebarProvider>
          <div className="relative flex min-h-dvh w-full">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <AppHeader />
              <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
          <Toaster />
          <Fab />
        </SidebarProvider>
      </body>
    </html>
  );
}
