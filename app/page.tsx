import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collections, formatPrice, getProduct, productsIn, type CollectionId, type Product } from "@/lib/products";
import SectionHead from "@/components/SectionHead";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { bestFor, keyRows, lineupSlugs } from "@/lib/lineup";
import CompareTable from "@/components/CompareTable";

export const metadata: Metadata = {
  title: { absolute: "MATIN | Rugged Military & Tactical Smartwatches for Men" },
  description:
    "Rugged military-style and tactical smartwatches for men: GPS, Bluetooth calling, AMOLED screens, heart rate and up to 30 days battery. Free shipping.",
  alternates: { canonical: "/" },
};

const reasons = [
  {
    title: "Tough metal cases",
    text: "Zinc alloy and stainless steel cases with armored edges, made for work sites, trails and the gym.",
    icon: <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />,
  },
  {
    title: "Weeks on one charge",
    text: "MATIN watches last up to 30 days on one charge, so you charge them a few times a month, not every night.",
    icon: <path d="M4 8h14v8H4zM18 11h2v2h-2zM7 11h5" />,
  },
  {
    title: "Bright AMOLED screens",
    text: "Sharp, bright displays that stay easy to read in direct sun.",
    icon: <path d="M7.5 4h9A1.5 1.5 0 0 1 18 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5v-13A1.5 1.5 0 0 1 7.5 4zM12 9v3l2 1.5" />,
  },
  {
    title: "iPhone and Android",
    text: "Pair with the free phone app to sync steps, sleep and heart rate and to change watch faces.",
    icon: <path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2" />,
  },
];

const collIcons: Record<CollectionId, React.ReactNode> = {
  tactical: <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z M9 12l2 2 4-4" />,
  outdoor: <path d="M3 19l6-10 4 6 3-4 5 8z M15 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />,
  gps: <path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  calling: <path d="M6.5 4h3l1.5 4-2 1.2a10 10 0 0 0 5.8 5.8L16 13l4 1.5v3A2.5 2.5 0 0 1 17.5 20 14.5 14.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4z" />,
  "long-battery": <path d="M4 8h14v8H4zM18 11h2v2h-2zM7 11h2v2H7zM10.5 11h2v2h-2z" />,
};

const faq = [
  {
    q: "Which MATIN smartwatch has GPS?",
    a: "The MATIN Trekon, Kaldor and Varkon have built-in GPS to track your route, distance and pace. The MATIN Torvan does not have GPS.",
  },
  {
    q: "Which MATIN watches can take calls?",
    a: "The MATIN Torvan, Kaldor and Varkon let you answer and make calls from your wrist over Bluetooth. The MATIN Trekon shows call alerts from your phone.",
  },
  {
    q: "How long does the battery last?",
    a: "It depends on the watch: about 7 to 20 days with typical use, and up to 30 days with light use or power saving. Using GPS, calls or the flashlight a lot shortens it. All of them charge with a magnetic cable.",
  },
  {
    q: "Do MATIN watches work with iPhone and Android?",
    a: "Yes. Pair the watch with the free phone app on iPhone or Android to sync your activity, get notifications and change watch faces.",
  },
  {
    q: "Are MATIN watches waterproof?",
    a: "They are water resistant: the Trekon and Kaldor are rated 3ATM, the Torvan and Varkon 5ATM and IP69K. Rain, sweat, splashes and washing your hands are fine. They are not made for diving.",
  },
  {
    q: "How much is shipping, and can I return my watch?",
    a: "Shipping is free worldwide. Every watch comes with a 1 year warranty and 30 day returns. Delivery takes about 8 to 10 business days to the USA, 7 to 9 to Canada, 5 to 8 to the UK, 7 to 9 to Europe, Australia and the Middle East, and 2 to 4 within Asia.",
  },
];

export default function Home() {
  const real = lineupSlugs
    .map((slug) => ({ bestFor: bestFor[slug], product: getProduct(slug) }))
    .filter((l): l is typeof l & { product: Product } => !!l.product);
  const lineup = real.map((l) => ({ ...l, price: formatPrice(l.product.price) }));
  const [trekon, torvan, kaldor] = real.map((l) => l.product);

  return (
    <div className="lp">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <section className="lp-hero">
        <div className="lp-hero-copy">
          <p className="lp-kicker">Rugged smartwatches for men</p>
          <h1>
            Built for hard places. <span>Lasts for weeks.</span>
          </h1>
          <p className="lead">
            Military-style smartwatches with tough metal cases, bright AMOLED screens, GPS or Bluetooth calling,
            and up to 30 days of battery on one charge.
          </p>
          <div className="hero-cta">
            <Link href="/shop" className="btn btn-primary">Shop watches</Link>
            <Link href="/compare" className="btn btn-ghost">Compare models</Link>
          </div>
          <ul className="lp-perks">
            <li>Free worldwide shipping</li>
            <li>1 year warranty</li>
            <li>30 day returns</li>
          </ul>
        </div>

        {trekon && torvan && kaldor && (
          <div className="lp-trio" aria-label="The MATIN lineup">
            <Link href={`/product/${torvan.slug}`} className="lp-trio-item lp-trio-left" aria-label={torvan.name}>
              <Image src={torvan.images[0]} alt={torvan.imageAlts?.[0] ?? torvan.name} fill sizes="(max-width: 900px) 45vw, 22vw" quality={60} />
            </Link>
            <Link href={`/product/${kaldor.slug}`} className="lp-trio-item lp-trio-right" aria-label={kaldor.name}>
              <Image src={kaldor.images[0]} alt={kaldor.imageAlts?.[0] ?? kaldor.name} fill sizes="(max-width: 900px) 45vw, 22vw" quality={60} />
            </Link>
            <Link href={`/product/${trekon.slug}`} className="lp-trio-item lp-trio-main" aria-label={trekon.name}>
              <span className="photo-glow" aria-hidden="true" />
              <Image
                src={trekon.images[0]}
                alt={trekon.imageAlts?.[0] ?? trekon.name}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 900px) 60vw, 30vw"
                quality={60}
              />
            </Link>
          </div>
        )}
      </section>

      <section className="section" id="compare" aria-labelledby="compare-title">
        <SectionHead
          id="compare-title"
          eyebrow="The lineup"
          title={
            <>
              Four watches. <span className="grad">Find yours.</span>
            </>
          }
          intro="Every MATIN watch is rugged and goes for days between charges. Here is how they differ."
        />
        <CompareTable watches={lineup} groups={[{ rows: keyRows }]} heading="h3" />
        <p className="lp-compare-more">
          <Link href="/compare" className="btn btn-ghost">
            See the full comparison
          </Link>
        </p>
      </section>

      <section className="section" aria-labelledby="why-title">
        <SectionHead
          id="why-title"
          eyebrow="Why MATIN"
          title={
            <>
              Tough outside. <span className="grad">Smart inside.</span>
            </>
          }
        />
        <ul className="lp-reasons">
          {reasons.map((r) => (
            <li key={r.title}>
              <span className="lp-reason-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                  {r.icon}
                </svg>
              </span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="coll-title">
        <SectionHead
          id="coll-title"
          eyebrow="Collections"
          title={
            <>
              Shop by <span className="grad">what you need.</span>
            </>
          }
        />
        <ul className="lp-colls">
          {collections.map((c) => {
            const watches = productsIn(c.id).filter((p) => p.images.length);
            return (
              <li key={c.id}>
                <Link href={`/collections/${c.id}`}>
                  <span className="lp-coll-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                      {collIcons[c.id]}
                    </svg>
                  </span>
                  <span className="lp-coll-name">{c.name}</span>
                  <span className="lp-coll-blurb">{c.blurb}</span>
                  <span className="lp-coll-thumbs" aria-hidden="true">
                    {watches.map((w) => (
                      <span key={w.slug} className="lp-coll-thumb">
                        <Image src={w.images[0]} alt="" fill sizes="56px" quality={60} />
                      </span>
                    ))}
                  </span>
                  <span className="lp-coll-link">
                    {watches.length} {watches.length === 1 ? "watch" : "watches"} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section" id="faq" aria-labelledby="home-faq-title">
        <SectionHead
          id="home-faq-title"
          eyebrow="FAQ"
          title={
            <>
              Questions? <span className="grad">Answers.</span>
            </>
          }
        />
        <div className="lp-faq">
          <FaqList items={faq} />
        </div>
      </section>

      <section className="section trust">
        {[
          ["Free shipping", "Worldwide, on every order"],
          ["1 year warranty", "We stand behind every watch"],
          ["30 day returns", "Not right? Send it back"],
          ["Secure checkout", "Card, Apple Pay, PayPal"],
        ].map(([t, s]) => (
          <div key={t}>
            <h3>{t}</h3>
            <p>{s}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
