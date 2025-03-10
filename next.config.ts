import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin("./translations/config.ts");

export default withNextIntl(nextConfig);
