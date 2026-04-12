import type { MetadataRoute } from "next";

import { siteMetadata } from "@/lib/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#FDFEFF",
    categories: ["finance", "business", "productivity"],
    description: siteMetadata.defaultDescription,
    display: "standalone",
    icons: [
      {
        sizes: "64x64",
        src: "/icon",
        type: "image/png"
      },
      {
        sizes: "180x180",
        src: "/apple-icon",
        type: "image/png"
      }
    ],
    name: siteMetadata.appName,
    orientation: "portrait",
    scope: "/",
    short_name: siteMetadata.shortName,
    start_url: "/",
    theme_color: siteMetadata.themeColor
  };
}
