import type { Metadata } from "next";
import Link from "next/link";
import CompareTable from "@/components/CompareTable";
import JsonLd from "@/components/JsonLd";
import { bestFor, compareGroups, lineupSlugs } from "@/lib/lineup";
import { formatPrice, getProduct, type Product } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare MATIN Rugged Smartwatches: Trekon, Torvan, Kaldor, Varkon",
  description:
    "Compare all four MATIN rugged smartwatches side by side: battery life, GPS, Bluetooth calls, flashlight, SpO2, water rating, sport modes and build.",
  alternates: { canonical: "/compare" },
  openGraph: {
    url: "/compare",
    siteName: "MATIN",
    title: "Compare MATIN Rugged Smartwatches",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "MATIN rugged smartwatches",
      },
    ],
  },
};

export default function ComparePage() {
  const watches = lineupSlugs
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => !!p)
    .map((p) => ({
      product: p,
      price: formatPrice(p.price),
      bestFor: bestFor[p.slug as keyof typeof bestFor],
    }));

  return (
    <div className="container page-pad cmp">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "MATIN rugged smartwatches",
          itemListElement: watches.map((w, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/product/${w.product.slug}`),
            name: w.product.name,
          })),
        }}
      />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
        <span>Compare</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Compare</p>
        <h1>
          Which MATIN is <span>right for you?</span>
        </h1>
        <p>
          All four are rugged, work with iPhone and Android, and go for days
          between charges. Here is every difference, side by side.
        </p>
      </header>
      <CompareTable watches={watches} groups={compareGroups} />
      <p className="cmp-note">
        Battery days are estimates and change with screen brightness, GPS, calls
        and notifications. A dash means the watch does not have that feature, or
        it is not listed yet.
      </p>
    </div>
  );
}
