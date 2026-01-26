import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNav } from '@/components/layout/bottom-nav';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-[#0B0F1A] to-[#121826]">
        <div className="relative min-h-dvh w-full">
            <main className="pb-28">{children}</main>
            <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
