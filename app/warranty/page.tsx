import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "1 Year Warranty on Every Watch",
  description:
    "Every MATIN rugged smartwatch comes with a 1 year warranty against defects. See what is covered, what is not and how to make a claim.",
  alternates: { canonical: "/warranty" },
};

export default function WarrantyPage() {
  return (
    <div className="container page-pad help">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Warranty</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">Warranty</p>
        <h1>
          1 year warranty <span>on every watch</span>
        </h1>
        <p>
          If your MATIN watch stops working the way it should because of a
          defect, we will make it right.
        </p>
      </header>

      <section className="help-card">
        <h2>How long it lasts</h2>
        <p>
          Every MATIN watch bought from matin-watches.com is covered for 1 year
          from the day it is delivered to you. No registration is needed: your
          order number is your proof of purchase.
        </p>
      </section>

      <section className="help-card">
        <h2>What is covered</h2>
        <p>
          Defects in materials or workmanship under normal use, for example:
        </p>
        <ul className="help-list">
          <li>The watch does not turn on or will not charge</li>
          <li>The battery fails much faster than it should</li>
          <li>The screen, touch or buttons stop working</li>
          <li>Heart rate, GPS, calls or Bluetooth stop working</li>
          <li>The charging cable that came with the watch fails</li>
        </ul>
      </section>

      <section className="help-card">
        <h2>What is not covered</h2>
        <ul className="help-list">
          <li>Normal wear, such as scratches, scuffs and a worn strap</li>
          <li>
            Damage from drops, crushing, accidents, fire, or water beyond the
            watch&apos;s rating (for example diving, hot showers or the sauna)
          </li>
          <li>Damage from opening, repairing or changing the watch yourself</li>
          <li>Watches bought used or from another seller</li>
          <li>Lost or stolen watches</li>
        </ul>
      </section>

      <section className="help-card">
        <h2>What we do</h2>
        <p>
          If your claim is covered, we will repair your watch, replace it with
          the same or a similar model, or refund what you paid. A repaired or
          replacement watch is covered for the rest of your original warranty.
        </p>
      </section>

      <section className="help-card">
        <h2>How to make a claim</h2>
        <ol className="help-list help-steps">
          <li>
            Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with
            your order number.
          </li>
          <li>Tell us what is wrong and add a photo or short video if you can.</li>
          <li>
            We reply with the next steps, including how to send the watch if
            we need it back.
          </li>
        </ol>
      </section>

      <section className="help-card">
        <h2>Changed your mind instead?</h2>
        <p>
          If nothing is wrong with your watch but it is not right for you, see
          our <Link href="/help#returns">30 day returns</Link>.
        </p>
        <p>
          This warranty does not limit any rights you have under the consumer
          laws of your country.
        </p>
      </section>
    </div>
  );
}
