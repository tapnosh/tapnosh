import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head as NextraHead } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "@/assets/styles/globals.css";
import "nextra-theme-docs/style.css";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | tapnosh.",
  description: "Documentation for tapnosh. project",
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

const navbar = (
  <Navbar
    logo={
      <span className="font-display-median text-2xl font-black">tapnosh</span>
    }
    projectLink="https://github.com/tapnosh/tapnosh"
  />
);
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
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
      <body className={`antialiased`}>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/tapnosh/tapnosh/tree/main"
          footer={footer}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          search={<></>}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
