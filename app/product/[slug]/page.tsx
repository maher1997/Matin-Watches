import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProduct, products } from "@/lib/products";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.name} | MATIN` : "MATIN" };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const thumbs = product.images.length > 1 ? product.images.length : 3;

  return (
    <div className="container page-pad">
      <nav className="crumbs">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-main">
            {product.badge && <span className="badge">{product.badge}</span>}
            <ProductImage product={product} priority sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className="pdp-thumbs">
            {Array.from({ length: thumbs }).map((_, i) => (
              <div key={i} className={i === 0 ? "thumb active" : "thumb"}>
                <ProductImage product={product} index={i} sizes="120px" />
              </div>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="pdp-tag">{product.tagline}</p>
          <p className="pdp-price">
            {formatPrice(product.price)}
            {product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
          </p>
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
        <h2 className="spec-title">Specifications</h2>
        <dl className="specs">
          {product.specs.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

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
