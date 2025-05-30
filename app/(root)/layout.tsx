import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Head as NextraHead } from "nextra/components";
import "@/assets/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Head from "next/head";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { OrderProvider } from "@/context/OrderContext";
import { NoshBar } from "@/components/nosh-bar/nosh-bar";
import { NotificationProvider } from "@/context/NotificationBar";
import stc from "string-to-color";
import Color from "color";

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
    template: "%s | tapnosh.",
    default: "tapnosh.",
  },
  description: "Order your food with ease",
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
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "oklch(1 0 0)",
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
  const color = new Color(stc(Math.random().toString()));
  let accent = color;
  let foreground = color;

  if (color.isDark()) {
    accent = accent.lighten(0.6);
    foreground = foreground.lighten(0.95);
  } else {
    accent = accent.darken(0.6);
    foreground = foreground.darken(0.95);
  }

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr">
      <Head>
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
        <style>{`
          :root {
            --primary: ${color.hex()};
            --primary-foreground: ${foreground.hex()};
            --accent: ${accent.hex()};
          }
        `}</style>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <SWRConfig value={{ fetcher }}> */}
          <NextIntlClientProvider messages={messages}>
            <SidebarProvider>
              <NotificationProvider>
                <OrderProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2">
                      <div className="flex flex-1 items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                      </div>
                    </header>
                    {children}
                    <NoshBar />
                  </SidebarInset>
                  <Toaster />
                </OrderProvider>
              </NotificationProvider>
            </SidebarProvider>
          </NextIntlClientProvider>
          {/* </SWRConfig> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
