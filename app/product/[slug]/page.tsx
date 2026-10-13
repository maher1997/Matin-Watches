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

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  // Real photos: one thumbnail per photo (none if there is only one).
  // Placeholder drawing: three thumbnails so the layout looks complete.
  const thumbs = product.images.length ? (product.images.length > 1 ? product.images.length : 0) : 3;
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
        <div className="pdp-gallery">
          <div className="pdp-main">
            {product.badge && <span className="badge">{product.badge}</span>}
            <ProductImage product={product} priority sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          {thumbs > 0 && (
            <div className="pdp-thumbs">
              {Array.from({ length: thumbs }).map((_, i) => (
                <div key={i} className={i === 0 ? "thumb active" : "thumb"}>
                  <ProductImage product={product} index={i} sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

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

      {product.features && (
        <section className="section">
          <h2 className="spec-title">What it does</h2>
          <ul className="test-list feature-list">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {product.sports && (
        <section className="section">
          <h2 className="spec-title">170+ sport modes</h2>
          <ul className="sport-list">
            {product.sports.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      {product.posters && (
        <section className="section">
          <h2 className="spec-title">Built for the field</h2>
          <div className="posters">
            {product.posters.map((p) => (
              <Image
                key={p.src}
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            ))}
          </div>
        </section>
      )}

      {product.faq && (
        <section className="section">
          <h2 className="spec-title">Questions</h2>
          <div className="faq">
            {product.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
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
