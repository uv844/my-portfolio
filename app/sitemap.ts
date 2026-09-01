import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

/** Single-page site, so the sitemap is one entry — but it keeps the canonical URL honest. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: profile.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
