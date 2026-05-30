import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import type { Metadata } from 'next';
import { Locale } from '@myshop/shared';

import { AnnouncementBar } from '@/components/announcement-bar';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/settings';
import { getThemeHtmlClass } from '@/lib/theme-class';
import { getServerThemeMode } from '@/lib/theme-server';

import '../globals.css';

const geistSans = GeistSans;
const geistMono = GeistMono;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;

  setRequestLocale(locale);

  const [messages, settings, themeMode, t] = await Promise.all([
    getMessages(),
    getSiteSettings(locale),
    getServerThemeMode(),
    getTranslations('Catalog'),
  ]);

  const themeClass = getThemeHtmlClass(themeMode);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${themeClass} h-full antialiased`.trim()}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider defaultTheme={themeMode}>
          <NextIntlClientProvider messages={messages}>
            <AnnouncementBar announcement={settings.announcement} />
            <SiteHeader
              settings={settings}
              categoriesLabel={t('navCategories')}
            />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter footerText={settings.footerText} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
