import nextra from "nextra";
import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
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
