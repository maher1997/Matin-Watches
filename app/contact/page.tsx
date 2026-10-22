import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact MATIN",
  description:
    "Questions about a MATIN watch, an order, a return or the warranty? Email us at info@matin-watches.com.",
  alternates: { canonical: "/contact" },
};

const quick = [
  { href: "/faq", label: "FAQ", note: "Most asked questions" },
  { href: "/shipping", label: "Shipping", note: "Free worldwide, delivery times" },
  { href: "/returns", label: "Returns", note: "30 days from delivery" },
  { href: "/warranty", label: "Warranty", note: "1 year from delivery" },
];

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

      <div className="contact-wrap">
        <section className="contact-card">
          <h2>Send us a message</h2>
          <ContactForm />
        </section>

        <aside className="contact-side">
          <a className="contact-mail" href={`mailto:${contactEmail}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
              <path d="M4 7.5l8 5.5 8-5.5" />
            </svg>
            <span>
              <small>Or email us directly</small>
              {contactEmail}
            </span>
          </a>

          <div className="contact-quick">
            <h2>Quick answers</h2>
            <ul>
              {quick.map((q) => (
                <li key={q.href}>
                  <Link href={q.href}>
                    <span>
                      {q.label}
                      <small>{q.note}</small>
                    </span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
