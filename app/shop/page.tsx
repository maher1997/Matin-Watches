import { Suspense } from "react";
import type { Metadata } from "next";
import ShopGrid from "@/components/ShopGrid";

export const metadata: Metadata = { title: "Shop | MATIN" };

export default function ShopPage() {
  return (
    <div className="container page-pad">
      <p className="eyebrow">The collection</p>
      <h1 className="page-title">All watches</h1>
      <Suspense>
        <ShopGrid />
      </Suspense>
    </div>
  );
}
