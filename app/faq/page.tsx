import type { Metadata } from "next";
import Link from "next/link";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rugged Smartwatch FAQ: Battery, GPS & Shipping",
  description:
    "Answers about MATIN rugged smartwatches: battery life, GPS, Bluetooth calls, waterproof ratings, iPhone and Android, free worldwide shipping, returns and warranty.",
  alternates: { canonical: "/faq" },
  openGraph: {
    url: "/faq",
    siteName: "MATIN",
    title: "MATIN Rugged Smartwatch FAQ",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "MATIN rugged smartwatches" }],
  },
};

type Group = {
  id: string;
  title: string;
  more?: { href: string; label: string };
  items: { q: string; a: string }[];
};

// Every answer is plain text so the same words go to the page and to Google.
const groups: Group[] = [
  {
    id: "choosing",
    title: "Choosing a watch",
    more: { href: "/compare", label: "Compare all four watches" },
    items: [
      {
        q: "Which rugged smartwatch has the longest battery life?",
        a: "The MATIN Trekon lasts the longest: about 11 days with typical use, 20 days with light use and up to 30 days in power-saving mode. The MATIN Varkon also reaches up to 30 days in power-saving mode, and about 12 days with typical use.",
      },
      {
        q: "Which MATIN smartwatch has GPS?",
        a: "The MATIN Trekon, Kaldor and Varkon have built-in GPS to track your route, distance and pace. The Varkon uses 6 satellite systems, and the Kaldor uses dual-frequency GPS with 5 systems, for a more reliable position. The MATIN Torvan does not have GPS.",
      },
      {
        q: "Which MATIN watches can take calls?",
        a: "The MATIN Torvan, Kaldor and Varkon let you answer and make calls from your wrist over Bluetooth. The MATIN Trekon shows call alerts from your phone.",
      },
      {
        q: "Which MATIN watch has a flashlight?",
        a: "The MATIN Kaldor, Torvan and Varkon have a built-in LED flashlight. The MATIN Trekon does not.",
      },
      {
        q: "What is the best rugged smartwatch for work, like construction or outdoor jobs?",
        a: "For tough job sites, the MATIN Torvan has a 316L stainless steel case, sapphire glass and an IP69K rating against dust, mud and high-pressure water. The MATIN Varkon is also IP69K rated and adds GPS. The MATIN Kaldor adds a flashlight, compass and barometric altimeter for early starts and dark spaces.",
      },
      {
        q: "Which MATIN watch is best under $150?",
        a: "Three of our four watches are $150 or less: the MATIN Trekon at $120 for the longest battery and 170+ sport modes, the MATIN Torvan at $140 for a stainless steel case, sapphire glass and calls, and the MATIN Kaldor at $150 for dual-frequency GPS, calls, a flashlight and 5ATM swim-proofing.",
      },
    ],
  },
  {
    id: "battery",
    title: "Battery and charging",
    items: [
      {
        q: "How long does the battery last?",
        a: "With typical use: MATIN Trekon about 11 days, Torvan about 14 days, Varkon about 12 days and Kaldor about 10 days. In power-saving mode the Trekon, Torvan and Varkon last up to 30 days, and the Kaldor up to 15 days with light use.",
      },
      {
        q: "How do I charge a MATIN watch?",
        a: "Every MATIN watch charges with the magnetic cable in the box. The Torvan and Varkon charge fully in about 1.5 hours.",
      },
      {
        q: "What drains the battery fastest?",
        a: "GPS workouts, long Bluetooth calls, the flashlight, the always-on screen and high brightness use the most power. Turning these off when you do not need them makes the battery last much longer.",
      },
    ],
  },
  {
    id: "water",
    title: "Water and toughness",
    items: [
      {
        q: "Are MATIN watches waterproof?",
        a: "They are water resistant: the Trekon is rated 3ATM, the Kaldor 5ATM, and the Torvan and Varkon 5ATM and IP69K. Rain, sweat, splashes and washing your hands are fine. They are not made for diving, hot showers or the sauna.",
      },
      {
        q: "Can I swim with a MATIN watch?",
        a: "Yes, with the MATIN Varkon, Kaldor and Torvan (all 5ATM). The Varkon tracks your swims in the pool and open water and reads your heart rate underwater, the Kaldor tracks pool swims, and the Torvan has no swim-tracking mode. The Trekon (3ATM) is splash-proof, not made for swimming.",
      },
      {
        q: "How tough are MATIN watches?",
        a: "The MATIN Torvan has a 316L stainless steel case and sapphire glass. The Varkon has Corning Gorilla Glass and an IP69K rating. The Trekon and Kaldor have zinc alloy cases. All four have a military-style rugged design made for outdoor work and sport.",
      },
    ],
  },
  {
    id: "features",
    title: "Features and phones",
    items: [
      {
        q: "Do MATIN watches work with iPhone and Android?",
        a: "Yes. Pair the watch with the free phone app on iPhone or Android to sync your activity, get notifications and change watch faces.",
      },
      {
        q: "Do they show notifications from my phone?",
        a: "Yes. All four show calls, messages and app notifications from your phone.",
      },
      {
        q: "Do MATIN watches track heart rate, blood oxygen and sleep?",
        a: "All four track heart rate and sleep. The MATIN Torvan, Kaldor and Varkon also measure blood oxygen (SpO2). MATIN watches are wellness smartwatches, not medical devices.",
      },
      {
        q: "How many sport modes do they have?",
        a: "The MATIN Trekon and Varkon have 170+ sport modes, the Kaldor 100+ and the Torvan 9, including running, walking, hiking and cycling.",
      },
      {
        q: "Are MATIN watches certified for the USA?",
        a: "Yes. They have passed FCC, CE and RoHS certification, and their Bluetooth is BQB qualified, so they meet US and EU requirements for electronics.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping and orders",
    more: { href: "/shipping", label: "See delivery times" },
    items: [
      {
        q: "How much is shipping?",
        a: "Shipping is free on every order, to every country.",
      },
      {
        q: "How long does delivery take?",
        a: "About 8 to 10 business days to the USA, 7 to 9 to Canada, 5 to 8 to the UK, 7 to 9 to Europe, Australia and the Middle East, and 2 to 4 within Asia.",
      },
      {
        q: "Do you ship to my country?",
        a: "We ship worldwide, including the USA, Canada, the UK, Europe, Australia, Asia and the Middle East.",
      },
      {
        q: "Where is MATIN based?",
        a: "MATIN is a Canadian rugged smartwatch brand based in Toronto, founded in 2020.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns and warranty",
    more: { href: "/returns", label: "Read the returns policy" },
    items: [
      {
        q: "Can I return my watch?",
        a: "Yes. You can return your watch within 30 days of delivery.",
      },
      {
        q: "What warranty do MATIN watches have?",
        a: "Every MATIN watch comes with a 1 year warranty from the day it is delivered. It covers defects in materials or workmanship under normal use, like a watch that will not charge or a screen or button that stops working. It does not cover drops, accidents or normal wear.",
      },
      {
        q: "How do I contact MATIN?",
        a: `Email us at ${contactEmail} with any question about a watch, an order, a return or the warranty.`,
      },
    ],
  },
];

export default function FaqPage() {
  // Numbers run on from one group to the next.
  let n = 1;
  const numbered = groups.map((g) => {
    const start = n;
    n += g.items.length;
    return { ...g, start };
  });
  return (
    <div className="container page-pad faq-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: absoluteUrl("/faq"),
          mainEntity: groups.flatMap((g) =>
            g.items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          ),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "FAQ", item: absoluteUrl("/faq") },
          ],
        }}
      />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>FAQ</span>
      </nav>
      <header className="cmp-intro">
        <p className="eyebrow">FAQ</p>
        <h1>
          Rugged smartwatch <span>questions, answered</span>
        </h1>
        <p>
          Battery life, GPS, calls, water resistance, shipping and warranty for
          every MATIN watch.
        </p>
      </header>

      <nav className="faq-topics" aria-label="FAQ topics">
        {groups.map((g) => (
          <a key={g.id} href={`#${g.id}`}>
            {g.title}
          </a>
        ))}
      </nav>

      {numbered.map((g) => (
        <section key={g.id} id={g.id} className="faq-group" aria-labelledby={`${g.id}-title`}>
          <h2 id={`${g.id}-title`}>{g.title}</h2>
          <FaqList items={g.items} start={g.start} heading="h3" />
          {g.more && (
            <Link href={g.more.href} className="faq-more">
              {g.more.label} →
            </Link>
          )}
        </section>
      ))}

      <p className="faq-ask">
        Still have a question? Email us at{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>
    </div>
  );
}
