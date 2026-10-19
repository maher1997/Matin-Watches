import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact MATIN",
  description:
    "Questions about a MATIN watch, an order, a return or the warranty? Email us at info@matin-watches.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Contact</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Contact</p>
        <h1>
          Talk to <span>us</span>
        </h1>
        <p>
          Questions about a watch, an order, a return or the warranty? We are
          happy to help.
        </p>
      </header>

      <section className="help-card">
        <h2>Email</h2>
        <p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
        <p>Add your order number if your question is about an order.</p>
      </section>

      <section className="help-card">
        <h2>Quick answers</h2>
        <ul className="help-list">
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/shipping">Shipping and delivery times</Link>
          </li>
          <li>
            <Link href="/returns">Returns</Link>
          </li>
          <li>
            <Link href="/warranty">Warranty</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
