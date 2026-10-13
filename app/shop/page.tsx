import { Suspense } from "react";
import type { Metadata } from "next";
import ShopGrid, { ShopGridView } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Shop Rugged Smartwatches",
  description:
    "Shop MATIN rugged smartwatches: tough tactical, outdoor and water-resistant watches with AMOLED screens and long battery life. Free worldwide shipping.",
  alternates: { canonical: "/shop" },
  openGraph: {
    url: "/shop",
    siteName: "MATIN",
    title: "Shop Rugged Smartwatches | MATIN",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "MATIN rugged smartwatches" }],
  },
};

export default function ShopPage() {
  return (
    <div className="container page-pad">
      <p className="eyebrow">The collection</p>
      <h1 className="page-title">All watches</h1>
      <Suspense fallback={<ShopGridView active={null} />}>
        <ShopGrid />
      </Suspense>
    </div>
  );
}
