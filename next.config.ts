import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import nextra from "nextra";

import packageJson from "./package.json" assert { type: "json" };

const { version } = packageJson;

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    viewTransition: true,
  },
  serverExternalPackages: ["sequelize", "pino", "pino-pretty"],
  publicRuntimeConfig: {
    version,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all pages except /api and /docs
        source: "/:path((?!api|docs).*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        // Root path
        source: "/",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
    ];
  },
};

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: true,
  },
  contentDirBasePath: "/docs",
});

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(withNextra(nextConfig));
