import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, formatPrice, getProduct, products, type Product } from "@/lib/products";
import { absoluteUrl, site, siteUrl } from "@/lib/site";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import JsonLd from "@/components/JsonLd";
import AngleCards from "@/components/AngleCards";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import Showcase from "@/components/Showcase";
import PdpGallery from "@/components/PdpGallery";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return { title: "Watch not found", robots: { index: false } };
  const url = `/product/${p.slug}`;
  const title = p.seoTitle ?? `${p.name} Rugged Smartwatch | MATIN`;
  const description = p.seoDescription ?? `${p.name}: ${p.tagline}. ${p.description}`.slice(0, 160);
  // Link previews (WhatsApp, Facebook, X) use the share picture when there is one.
  const images = p.shareImage
    ? [{ url: p.shareImage, width: 1200, height: 630, alt: p.imageAlts?.[0] ?? p.name }]
    : [{ url: "/og.jpg", width: 1200, height: 630, alt: p.name }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: site.name, url, title, description, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}

const svg = (d: string) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const groupIcons = {
  outdoor: svg("M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"),
  health: svg("M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8zM3 12h4l2-3 3 6 2-3h7"),
  smart: svg("M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"),
  tools: svg("M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 9v4l2.5 2.5M5 3 2 6M19 3l3 3"),
};

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const category = categories.find((c) => c.id === product.category);
  const url = absoluteUrl(`/product/${product.slug}`);
  // Specs grouped by their `group` (in first-seen order); ungrouped ones share "".
  const specGroups: [string, Product["specs"]][] = [];
  for (const spec of product.specs) {
    const group = spec.group ?? "";
    const found = specGroups.find(([g]) => g === group);
    if (found) found[1].push(spec);
    else specGroups.push([group, [spec]]);
  }

  // Product data for Google Shopping and rich results (price, stock, photo).
  const productData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        description: product.description,
        sku: product.slug,
        url,
        image: [...product.images, ...(product.posters ?? []).map((p) => p.src)].map((src) => absoluteUrl(src)),
        brand: { "@type": "Brand", name: site.name },
        category: "Smartwatches",
        color: product.colors.map((c) => c.name).join(", "),
        additionalProperty: product.specs.map((s) => ({
          "@type": "PropertyValue",
          name: s.label,
          value: s.value,
        })),
        offers: {
          "@type": "Offer",
          url,
          price: product.price.toFixed(2),
          priceCurrency: site.currency,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${siteUrl}/#org` },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: "0", currency: site.currency },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 30,
          },
        },
      },
      ...(product.faq
        ? [
            {
              "@type": "FAQPage",
              mainEntity: product.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="container page-pad">
      <JsonLd data={productData} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <PdpGallery product={product} />

        <div className="pdp-info">
          <p className="eyebrow">{category?.name ?? product.category} smartwatch</p>
          <h1>{product.name}</h1>
          <p className="pdp-tag">{product.tagline}</p>
          <p className="pdp-price">
            {formatPrice(product.price)}
            {product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
          </p>
          {product.highlights && (
            <ul className="pdp-stats">
              {product.highlights.map((h) => (
                <li key={h.label}>
                  <strong>{h.value}</strong>
                  <span>{h.label}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="pdp-desc">{product.description}</p>
          <AddToCart product={product} />
          <ul className="perks">
            <li>Free worldwide shipping</li>
            <li>2 year warranty</li>
            <li>30 day returns</li>
          </ul>
        </div>
      </div>

      <AngleCards product={product} />

      {product.bigStats && (
        <section className="section big-stats" aria-label={`${product.name} in numbers`}>
          {product.bigStats.map((b, i) => (
            <Reveal key={b.label} className="big-stat" delay={i * 90}>
              <strong>
                <CountUp to={b.value} suffix={b.suffix} />
              </strong>
              <span>{b.label}</span>
            </Reveal>
          ))}
        </section>
      )}

      {product.chapters && (
        <section className="section showcase">
          <Reveal className="showcase-head">
            <p className="eyebrow">Made for the outdoors</p>
            <h2>Go further with {product.name}</h2>
          </Reveal>
          <Showcase product={product} />
        </section>
      )}

      <section className="section">
        <h2 className="spec-title">{product.name} specifications</h2>
        {specGroups.length > 1 || specGroups[0]?.[0] ? (
          <div className="spec-groups">
            {specGroups.map(([group, rows]) => (
              <div key={group} className="spec-group">
                <h3>{group}</h3>
                <dl>
                  {rows.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        ) : (
          <dl className="specs">
            {product.specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {product.featureGroups ? (
        <section className="section">
          <Reveal>
            <h2 className="spec-title">What it does</h2>
          </Reveal>
          <ul className="fgroups">
            {product.featureGroups.map((g, i) => (
              <Reveal as="li" key={g.title} className="fgroup" delay={i * 90}>
                <span className="fgroup-icon" aria-hidden="true">
                  {groupIcons[g.icon]}
                </span>
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : (
        product.features && (
          <section className="section">
            <h2 className="spec-title">What it does</h2>
            <ul className="test-list feature-list">
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        )
      )}

      {product.sports && (
        <section className="section sports">
          <Reveal className="sports-head">
            <strong className="sports-count">
              <CountUp to={170} suffix="+" />
            </strong>
            <div>
              <h2 className="spec-title">Sport modes</h2>
              <p>From your morning run to a weekend climb, the Trekon tracks it.</p>
            </div>
          </Reveal>
          <div className="marquee" aria-label="Some of the sport modes">
            {[0, 1].map((row) => {
              const half = product.sports!.filter((_, i) => i % 2 === row);
              return (
                <div key={row} className={`marquee-row${row ? " marquee-rev" : ""}`}>
                  {/* The list is drawn twice so the loop has no gap; the copy is hidden from screen readers. */}
                  {[0, 1].map((copy) => (
                    <ul key={copy} aria-hidden={copy === 1 || undefined}>
                      {half.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {product.faq && (
        <section className="section">
          <Reveal>
            <h2 className="spec-title">FAQ</h2>
          </Reveal>
          <div className="faq">
            {product.faq.map((f, i) => (
              <details key={f.q} name="faq">
                <summary>
                  <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-q">{f.q}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>You may also like</h2>
        </div>
        <div className="grid">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
