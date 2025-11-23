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
};

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: true,
  },
  contentDirBasePath: "/docs",
});

const withNextIntl = createNextIntlPlugin("./translations/config.ts");

export default withNextIntl(withNextra(nextConfig));
