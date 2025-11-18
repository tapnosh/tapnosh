import { MetadataRoute } from "next";

import { robotsLogger } from "@/lib/logger/app";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tapnosh.com";

export default function robots(): MetadataRoute.Robots {
  robotsLogger.info({ baseUrl }, "Generating robots.txt");

  const config = {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/my-restaurants", "/api", "/docs"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };

  robotsLogger.info(
    {
      allowedPaths: config.rules[0].allow,
      disallowedPaths: config.rules[0].disallow,
      sitemapUrl: config.sitemap,
    },
    "Generated robots.txt configuration",
  );

  return config;
}
