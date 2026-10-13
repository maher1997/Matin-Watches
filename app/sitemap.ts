import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.map((src) => absoluteUrl(src)),
    })),
  ];
}
