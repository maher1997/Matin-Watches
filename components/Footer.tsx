import Link from "next/link";
import Logo from "./Logo";
import { contactEmail } from "@/lib/site";

// Social accounts are not set up yet: the icons show where they will go and
// become links once each account exists.
const socials = [
  {
    name: "Instagram",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    name: "TikTok",
    icon: <path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8M14 3.5c.4 2.6 2.2 4.4 5 4.6" />,
  },
  {
    name: "YouTube",
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.3 9.3v5.4l4.6-2.7z" />
      </>
    ),
  },
  {
    name: "Facebook",
    icon: <path d="M14.5 20.5v-7.3h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.5V4.2a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.2H9v3h2.5v7.3" />,
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>Rugged smartwatches from Toronto, Canada.</p>
          <a className="footer-mail" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          <ul className="footer-social" aria-label="Social media, coming soon">
            {socials.map((s) => (
              <li key={s.name} title={`${s.name} (coming soon)`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {s.icon}
                </svg>
                <span className="sr-only">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link href="/shop">All watches</Link>
          <Link href="/collections/tactical">Tactical</Link>
          <Link href="/collections/outdoor">Outdoor</Link>
          <Link href="/collections/gps">GPS</Link>
          <Link href="/collections/calling">Bluetooth calling</Link>
          <Link href="/collections/long-battery">Long battery</Link>
          <Link href="/compare">Compare watches</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <Link href="/faq">FAQs</Link>
          <Link href="/help#shipping">Shipping</Link>
          <Link href="/help#returns">Returns</Link>
          <Link href="/warranty">Warranty</Link>
          <Link href="/help#contact">Contact us</Link>
        </div>
        <div className="footer-col">
          <h4>MATIN</h4>
          <Link href="/about">About MATIN</Link>
          <span className="footer-soon">
            Blog <small>Soon</small>
          </span>
        </div>
        <form className="footer-news" action="#">
          <h4>Join the unit</h4>
          <p>New drops and field tests, no spam.</p>
          <div className="news-row">
            <input type="email" placeholder="Your email" aria-label="Email" />
            <button type="submit" className="btn btn-primary">Join</button>
          </div>
        </form>
      </div>
      <div className="footer-bottom">
        <span className="footer-locale" title="More languages and countries coming soon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5z" />
          </svg>
          English · United States (USD)
        </span>
        <Link href="/privacy">Privacy Policy</Link>
        <p>© {new Date().getFullYear()} MATIN · Toronto, Canada</p>
      </div>
    </footer>
  );
}
