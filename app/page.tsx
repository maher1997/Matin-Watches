import type { Metadata } from "next";
import Link from "next/link";
import { categories, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";

export const metadata: Metadata = {
  title: { absolute: "MATIN | Rugged Smartwatches Built for Hard Places" },
  alternates: { canonical: "/" },
};

const features = [
  { title: "Tough metal case", text: "An armoured zinc alloy case built to take knocks." },
  { title: "3ATM water rated", text: "Rain, sweat and splashes are no problem." },
  { title: "30 day battery", text: "Weeks in the field on a single charge." },
  { title: "Bright AMOLED", text: "A big 1.95 inch screen you can read in the sun." },
];

const icons = [
  <path key="s" d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />,
  <path key="w" d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z" />,
  <path key="b" d="M4 8h14v8H4zM18 11h2v2h-2zM7 11h5" />,
  <path key="d" d="M6 4h12l3 6-9 10L3 10l3-6zM3 10h18" />,
];

export default function Home() {
  const hero = products[0];
  const featured = products.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">New · {hero.name}</p>
          <h1>
            Built for <span className="accent">hard</span> places.
          </h1>
          <p className="lead">
            Rugged smartwatches with tough metal cases, big AMOLED screens and weeks of battery. Made to
            keep up with whatever you put them through.
          </p>
          <div className="hero-cta">
            <Link href="/shop" className="btn btn-primary">Shop watches</Link>
            <Link href={`/product/${hero.slug}`} className="btn btn-ghost">Explore {hero.name.replace("MATIN ", "")}</Link>
          </div>
          <ul className="hero-stats">
            <li><strong>1.95&quot;</strong><span>AMOLED screen</span></li>
            <li><strong>3ATM</strong><span>Water resistant</span></li>
            <li><strong>30d</strong><span>Battery</span></li>
          </ul>
        </div>
        <div className="hero-media">
          <ProductImage product={hero} priority sizes="(max-width: 900px) 85vw, 45vw" />
        </div>
      </section>

      <section className="features">
        {features.map((f, i) => (
          <div key={f.title} className="feature">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              {icons[i]}
            </svg>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2>Field proven</h2>
          </div>
          <Link href="/shop" className="link-arrow">View all →</Link>
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Collections</p>
            <h2>Choose your mission</h2>
          </div>
        </div>
        <div className="collections">
          {categories.map((c) => {
            const p = products.find((x) => x.category === c.id)!;
            return (
              <Link key={c.id} href={`/shop?c=${c.id}`} className="collection">
                <div className="collection-media">
                  <ProductImage product={p} />
                </div>
                <div className="collection-text">
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <span className="link-arrow">Shop {c.name} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="banner">
        <div>
          <p className="eyebrow">Tested beyond the standard</p>
          <h2>Dropped. Frozen. Submerged. Still running.</h2>
          <p className="lead">
            Every MATIN watch goes through 16 military durability tests before it reaches your wrist.
          </p>
        </div>
        <ul className="test-list">
          {["1.5m drop onto steel", "-30°C to +70°C", "100m pressure", "Sand and dust", "Shock and vibration", "Salt fog"].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="section trust">
        {[
          ["Free shipping", "On every order, worldwide"],
          ["2 year warranty", "We stand behind every watch"],
          ["30 day returns", "Not right? Send it back"],
          ["Secure checkout", "Card, Apple Pay, PayPal"],
        ].map(([t, s]) => (
          <div key={t}>
            <h3>{t}</h3>
            <p>{s}</p>
          </div>
        ))}
      </section>
    </>
  );
}
