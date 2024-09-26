import '@/app/globals.css';

import { FRONTEND_URL, PROJECT_NAME, UMAMI_ID } from '@/lib/constant';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/app/providers';
import Script from 'next/script';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: PROJECT_NAME,
  description: 'Clean Clothes with LaundryXpert Experience the Difference',
  keywords: ['LaundryXpert', 'Laundry Service', 'Laundry Experience', 'Laundry Cleaning', 'Laundry Pickup'],
  metadataBase: new URL(FRONTEND_URL),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    title: PROJECT_NAME,
    description: 'Clean Clothes with LaundryXpert Experience the Difference',
    url: FRONTEND_URL,
    siteName: PROJECT_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: PROJECT_NAME,
    description: 'Clean Clothes with LaundryXpert Experience the Difference',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Provider>
          {children}
          {UMAMI_ID && <Script defer src='https://cloud.umami.is/script.js' data-website-id={UMAMI_ID} />}
        </Provider>
      </body>
    </html>
  );
}
