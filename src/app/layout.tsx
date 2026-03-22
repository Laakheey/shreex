import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { Navbar } from '@/components';
import ReferralTracker from '@/components/ReferralTracker';
import '@/index.css';

export const metadata: Metadata = {
  title: 'Shreex - Investment Platform',
  description: 'Invest wisely, grow your wealth with Shreex',
  keywords: ['investment', 'trading', 'crypto', 'financial growth'],
  openGraph: {
    title: 'Shreex - Investment Platform',
    description: 'Invest wisely, grow your wealth with Shreex',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SupabaseProvider>
            <ReferralTracker />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
