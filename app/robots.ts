import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    host: siteUrl.origin,
    rules: {
      allow: "/",
      userAgent: "*"
    },
    sitemap: `${siteUrl.origin}/sitemap.xml`
  };
}
