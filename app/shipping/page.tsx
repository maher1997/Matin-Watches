import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, delivery } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Worldwide Shipping and Delivery Times",
  description:
    "Free shipping on every MATIN smartwatch, to every country. Delivery times for the USA, Canada, the UK, Europe, Australia, Asia and the Middle East.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Shipping</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Shipping</p>
        <h1>
          Free shipping, <span>worldwide</span>
        </h1>
        <p>Every MATIN order ships free, to every country.</p>
      </header>

      <section className="help-card">
        <h2>Delivery times</h2>
        <p>Business days from when your order ships.</p>
        <ul className="help-times">
          {delivery.map((d) => (
            <li key={d.region}>
              {d.region}
              <strong>
                {d.days[0]} to {d.days[1]} days
              </strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="help-card">
        <h2>Tracking your order</h2>
        <p>
          When your watch ships, we email you a tracking number so you can
          follow it all the way to your door.
        </p>
      </section>

      <section className="help-card">
        <h2>Questions about a delivery?</h2>
        <p>
          Email us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>{" "}
          with your order number and we will look into it.
        </p>
        <p>
          Changed your mind after it arrives? See our{" "}
          <Link href="/returns">30 day returns</Link>.
        </p>
      </section>
    </div>
  );
}
