import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, productsIn } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";

// One page per collection (/collections/gps, /collections/long-battery...),
// each with its own title, heading and intro so Google can rank it.

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.id }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.id === slug);
  if (!c) return {};
  const url = `/collections/${c.id}`;
  return {
    title: { absolute: `${c.seoTitle} | MATIN` },
    description: c.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      url,
      siteName: "MATIN",
      title: c.seoTitle,
      description: c.seoDescription,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "MATIN rugged smartwatches" }],
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = collections.find((x) => x.id === slug);
  if (!c) notFound();
  // Real watches first, then the placeholders.
  const list = productsIn(c.id).sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0));
  const url = absoluteUrl(`/collections/${c.id}`);

  return (
    <div className="container page-pad coll-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: c.heading,
              description: c.seoDescription,
              url,
              mainEntity: {
                "@type": "ItemList",
                itemListElement: list.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: absoluteUrl(`/product/${p.slug}`),
                  name: p.name,
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
                { "@type": "ListItem", position: 3, name: c.name, item: url },
              ],
            },
          ],
        }}
      />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{c.name}</span>
      </nav>
      <header className="coll-head">
        <p className="coll-kicker">Collection</p>
        <h1>{c.heading}</h1>
        <p className="coll-intro">{c.intro}</p>
      </header>
      <nav className="chips coll-chips" aria-label="Collections">
        <Link href="/shop" className="chip">
          All
        </Link>
        {collections.map((x) => (
          <Link key={x.id} href={`/collections/${x.id}`} className={x.id === c.id ? "chip active" : "chip"} aria-current={x.id === c.id ? "page" : undefined}>
            {x.name}
          </Link>
        ))}
      </nav>
      <p className="result-count">{list.length} watches</p>
      <div className="grid">
        {list.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i === 0} />
        ))}
      </div>
    </div>
  );
}
