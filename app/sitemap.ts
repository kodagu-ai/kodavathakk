import type { MetadataRoute } from "next";
import { site } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }> = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/contribute", priority: 0.9, changeFrequency: "monthly" },
    { path: "/manifesto", priority: 0.8, changeFrequency: "monthly" },
    { path: "/roadmap", priority: 0.8, changeFrequency: "monthly" },
    { path: "/technology", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tracker", priority: 0.7, changeFrequency: "daily" },
    { path: "/community", priority: 0.7, changeFrequency: "monthly" },
  ];
  return pages.map((p) => ({
    url: `${site.url}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
