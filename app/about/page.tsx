import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, products } from "@/lib/products";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "About MATIN | Rugged Smartwatches from Toronto, Canada",
  description:
    "MATIN is a Canadian rugged smartwatch brand from Toronto, founded in 2020. Tough watches with long battery life, GPS and Bluetooth calls.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>About MATIN</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">About</p>
        <h1>
          Built for <span>hard places</span>
        </h1>
        <p>
          MATIN is a Canadian rugged smartwatch brand, based in Toronto since
          2020.
        </p>
      </header>

      <section className="help-card">
        <h2>Why we started</h2>
        <p>
          Most smartwatches are made for the office and the gym. We wanted one
          you can take to a job site, a trail or a long trip without worrying
          about scratches, water or a dead battery. So we made our own.
        </p>
        <p>
          Every MATIN watch has a tough case, a bright screen you can read
          outside, and a battery that lasts days or weeks, not hours.
        </p>
      </section>

      <section className="help-card">
        <h2>Our watches</h2>
        <ul className="about-list">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/product/${p.slug}`}>
                <strong>{p.name}</strong>
                <span>{p.tagline}</span>
              </Link>
              <em>{formatPrice(p.price)}</em>
            </li>
          ))}
        </ul>
        <p>
          Not sure which one fits you? <Link href="/compare">Compare all four</Link>{" "}
          side by side.
        </p>
      </section>

      <section className="help-card">
        <h2>What every order gets</h2>
        <ul className="about-points">
          <li>Free shipping worldwide</li>
          <li>1 year warranty</li>
          <li>30 day returns</li>
          <li>Works with iPhone and Android</li>
        </ul>
      </section>

      <section className="help-card">
        <h2>Talk to us</h2>
        <p>
          Questions about a watch or an order? Email us at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
    </div>
  );
}
