import type { MetadataRoute } from "next";
import { collections, products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/compare"), changeFrequency: "monthly", priority: 0.85 },
    ...collections.map((c) => ({
      url: absoluteUrl(`/collections/${c.id}`),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.map((src) => absoluteUrl(src)),
    })),
  ];
}
