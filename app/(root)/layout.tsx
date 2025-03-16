import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Head as NextraHead } from "nextra/components";
import "@/assets/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Head from "next/head";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { OrderProvider } from "@/context/OrderContext";
import { MyOrderNavigation } from "@/components/navigation/nav-my-order";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <SidebarProvider>
              <OrderProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <MyOrderNavigation />
                    </div>
                  </header>
                  {children}
                </SidebarInset>
                <Toaster />
              </OrderProvider>
            </SidebarProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
