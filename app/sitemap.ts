import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      changeFrequency: "weekly",
      lastModified,
      priority: 1,
      url: siteUrl.origin
    },
    {
      changeFrequency: "weekly",
      lastModified,
      priority: 0.8,
      url: `${siteUrl.origin}/wallet`
    }
  ];
}
