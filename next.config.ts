import nextra from "nextra";
import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

const nextConfig: NextConfig = {};

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: true,
  },
  contentDirBasePath: "/docs",
});

const withNextIntl = createNextIntlPlugin("./translations/config.ts");

export default withNextIntl(withNextra(nextConfig));
