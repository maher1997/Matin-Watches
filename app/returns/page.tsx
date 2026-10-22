import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "30 Day Returns",
  description:
    "Not the right MATIN watch for you? Return it within 30 days of delivery. See how returns and refunds work.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Returns</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Returns</p>
        <h1>
          30 day <span>returns</span>
        </h1>
        <p>
          Not the right watch for you? You have 30 days from delivery to send
          it back.
        </p>
      </header>

      <section className="help-card">
        <h2>What you can return</h2>
        <ul className="help-list">
          <li>Watches bought from matin-watches.com</li>
          <li>Returned within 30 days of delivery</li>
          <li>Not damaged, with the charger and everything that came in the box</li>
        </ul>
      </section>

      <section className="help-card">
        <h2>How to return a watch</h2>
        <ol className="help-list help-steps">
          <li>
            Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with
            your order number and the reason for the return.
          </li>
          <li>We reply with the return address and instructions.</li>
          <li>Pack the watch with everything that came with it and send it back.</li>
        </ol>
      </section>

      <section className="help-card">
        <h2>Your refund</h2>
        <p>
          Once your watch arrives and we check it, we refund you to your
          original payment method and email you when it is done.
        </p>
      </section>

      <section className="help-card">
        <h2>Is your watch faulty?</h2>
        <p>
          If something is wrong with your watch, you do not need to return it
          for a refund. It is covered by our{" "}
          <Link href="/warranty">1 year warranty</Link>, and we will repair or
          replace it.
        </p>
      </section>
    </div>
  );
}
