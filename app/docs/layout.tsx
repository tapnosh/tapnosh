import { Metadata } from "next";
import { Head as NextraHead } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "@/assets/styles/globals.css";
import "nextra-theme-docs/style.css";

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
    logoLink="/"
    projectLink="https://github.com/tapnosh/tapnosh"
  />
);

const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;

export default async function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get pageMap and filter out all app routes, keeping only content from /content directory
  const fullPageMap = await getPageMap();

  // Recursively filter out any items with dynamic segments like [locale]
  const filterDynamicRoutes = (
    items: typeof fullPageMap,
  ): typeof fullPageMap => {
    return items.filter((item) => {
      // Exclude items with dynamic segments (square brackets)
      if (
        "name" in item &&
        (item.name.includes("[") || item.name.includes("]"))
      ) {
        return false;
      }
      if (
        "route" in item &&
        (item.route.includes("[") || item.route.includes("]"))
      ) {
        return false;
      }
      // Exclude specific app routes
      if ("name" in item) {
        const excludedRoutes = [
          "restaurants",
          "my-restaurants",
          "about",
          "api",
        ];
        if (excludedRoutes.includes(item.name)) {
          return false;
        }
      }
      // Recursively filter children
      if ("children" in item && Array.isArray(item.children)) {
        item.children = filterDynamicRoutes(item.children);
      }
      return true;
    });
  };

  const pageMap = filterDynamicRoutes(fullPageMap);

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <NextraHead
        color={{
          hue: { dark: 28, light: 357 },
          saturation: { dark: 100, light: 18 },
          lightness: { dark: 92, light: 40 },
        }}
      >
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </NextraHead>
      <body className={`antialiased`}>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
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
