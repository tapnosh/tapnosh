import "@/assets/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Head as NextraHead } from "nextra/components";

import { LoadingBar } from "@/components/ui/feedback/loading-bar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/layout/sidebar";
import { NotificationProvider } from "@/context/NotificationBar";
import { OrderProvider } from "@/context/OrderContext";
import { ThemeColorProvider } from "@/context/ThemeContext";
import { AppSidebar } from "@/features/navigation/app-sidebar";
import { NoshBar } from "@/features/nosh-bar/nosh-bar";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | tapnosh",
    default: "tapnosh - Discover Amazing Restaurants Near You",
  },
  description:
    "Join tapnosh to explore the best dining experiences in your city. Restaurant owners can showcase their venues and connect with food lovers. Browse hundreds of restaurants with detailed menus, photos, and authentic reviews.",
  keywords: [
    "restaurants",
    "dining",
    "food",
    "menu",
    "restaurant discovery",
    "local restaurants",
    "restaurant reviews",
    "food lovers",
    "restaurant listings",
    "dining experiences",
    "tapnosh",
  ],
  authors: [{ name: "tapnosh" }],
  creator: "tapnosh",
  publisher: "tapnosh",
  applicationName: "tapnosh",
  category: "Food & Dining",
  classification: "Restaurant Discovery Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://tapnosh.com",
    languages: {
      "en-US": "https://tapnosh.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tapnosh.com",
    siteName: "tapnosh",
    title: "tapnosh - Discover Amazing Restaurants Near You",
    description:
      "Join tapnosh to explore the best dining experiences in your city. Restaurant owners can showcase their venues and connect with food lovers.",
    images: [
      {
        url: "https://tapnosh.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "tapnosh - Discover Amazing Restaurants",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tapnosh",
    creator: "@tapnosh",
    title: "tapnosh - Discover Amazing Restaurants Near You",
    description:
      "Join tapnosh to explore the best dining experiences in your city. Restaurant owners can showcase their venues and connect with food lovers.",
    images: [
      {
        url: "https://tapnosh.com/images/twitter-image.jpg",
        alt: "tapnosh - Discover Amazing Restaurants",
      },
    ],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/favicon.svg",
        href: "/images/favicon.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/favicon-dark.svg",
        href: "/images/favicon-dark.svg",
      },
    ],
    apple: [
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icon-192x192.png",
      },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "tapnosh",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#ffffff",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "oklch(0.147 0.004 49.25)",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} dir="ltr">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <link rel="icon" href="/favicon.svg" sizes="any" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Head>
        <NextraHead
          color={{
            hue: { dark: 28, light: 357 },
            saturation: { dark: 100, light: 18 },
            lightness: { dark: 92, light: 40 },
          }}
        />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LoadingBar />
          <QueryProvider>
            <ThemeColorProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <NextIntlClientProvider messages={messages}>
                  <SidebarProvider>
                    <NotificationProvider>
                      <OrderProvider>
                        <AppSidebar />
                        <SidebarInset>
                          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2">
                            <div className="flex items-center gap-2 px-4">
                              <SidebarTrigger className="-ml-1" />
                            </div>
                            <div id="header-actions-container" />
                          </header>
                          {children}
                          <NoshBar />
                        </SidebarInset>
                      </OrderProvider>
                    </NotificationProvider>
                  </SidebarProvider>
                </NextIntlClientProvider>
              </ThemeProvider>
            </ThemeColorProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
