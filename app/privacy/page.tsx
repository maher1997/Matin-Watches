import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MATIN",
  description:
    "How MATIN collects, uses and protects your information when you visit our store or buy a watch.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Privacy Policy</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Privacy</p>
        <h1>
          Privacy <span>policy</span>
        </h1>
        <p>Last updated October 19, 2026</p>
      </header>

      <section className="help-card">
        <h2>What we collect</h2>
        <p>
          When you browse the site, your shopping cart is kept only in your own
          browser. We do not use advertising or tracking cookies.
        </p>
        <p>
          When you place an order, we collect what we need to deliver it: your
          name, shipping address, email and phone number. If you join our list,
          we keep your email address.
        </p>
      </section>

      <section className="help-card">
        <h2>How we use it</h2>
        <p>
          We use your details to process and ship your order, send order and
          delivery updates, handle returns and warranty claims, and answer your
          questions. If you joined our list, we send you news about new watches.
          You can unsubscribe at any time.
        </p>
      </section>

      <section className="help-card">
        <h2>Payments</h2>
        <p>
          Payments are handled by our secure payment provider. We never see or
          store your full card number.
        </p>
      </section>

      <section className="help-card">
        <h2>Who we share it with</h2>
        <p>
          We share your details only with the companies that help us run the
          store, such as our payment provider and shipping carriers, and only
          what they need to do their job. We never sell your personal
          information.
        </p>
      </section>

      <section className="help-card">
        <h2>Your choices</h2>
        <p>
          You can ask us to show, correct or delete the personal information we
          hold about you, and we will reply within 30 days. We keep order
          records only as long as needed for warranty, returns, and tax and
          accounting rules.
        </p>
      </section>

      <section className="help-card">
        <h2>Changes</h2>
        <p>
          If we change this policy, we will update it on this page and change
          the date at the top.
        </p>
      </section>
    </div>
  );
}
