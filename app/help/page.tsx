import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, delivery } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping, Returns and Warranty | MATIN",
  description:
    "Free worldwide shipping on every MATIN watch, delivery times by region, 30 day returns and a 1 year warranty.",
  alternates: { canonical: "/help" },
};

// Shipping, returns and warranty in one page; the footer links to each part.
export default function HelpPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Help</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Help</p>
        <h1>
          Shipping, returns <span>and warranty</span>
        </h1>
      </header>

      <section id="shipping" className="help-card">
        <h2>Shipping</h2>
        <p>
          Shipping is free on every order, to every country. Delivery times are
          in business days from when your order ships.
        </p>
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

      <section id="returns" className="help-card">
        <h2>Returns</h2>
        <p>
          Not right for you? You can return your watch within 30 days of
          delivery.
        </p>
      </section>

      <section id="warranty" className="help-card">
        <h2>Warranty</h2>
        <p>
          Every MATIN watch comes with a 1 year warranty from the day it is
          delivered.
        </p>
      </section>

      <section id="contact" className="help-card">
        <h2>Contact us</h2>
        <p>
          Questions about a watch, an order, a return or the warranty? Email us
          at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
    </div>
  );
}
