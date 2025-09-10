import '../globals.css';

import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { setStaticParamsLocale } from 'next-international/server';
import { Toaster } from 'sonner';

import { AuthGuard } from '@/components/AuthGuard';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProviderClient } from '@/locales/client';
import { getStaticParams } from '@/locales/server';

export const metadata: Metadata = {
  metadataBase: new URL('https://chat.vercel.ai'),
  title: 'Si-Me™ Engineer Agent',
  description: 'Si-Me™ Engineer Agent',
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

export function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      // 移除 fontMono.variable 和 fontSans.variable
    >
      <body suppressHydrationWarning className="antialiased">
        <SessionProvider>
          <AuthGuard locale={locale} />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Toaster position="top-center" />
            <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
