import type { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/draft",
          "/api/draft/disable",
          "/api/revalidate",
        ],
      },
    ],
    sitemap: toAbsoluteUrl("/sitemap.xml"),
  };
}
