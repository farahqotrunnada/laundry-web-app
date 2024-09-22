import '@/app/globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/app/providers';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Laundryxpert',
  description: 'Laundry solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
