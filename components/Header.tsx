"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "./Cart";
import Logo from "./Logo";
import { contactEmail } from "@/lib/site";

const links = [
  { href: "/shop", label: "Shop all" },
  { href: "/collections/tactical", label: "Tactical" },
  { href: "/collections/outdoor", label: "Outdoor" },
  { href: "/collections/gps", label: "GPS" },
  { href: "/collections/long-battery", label: "Long battery" },
];

// Phone menu: collections with thin line icons (same style as the site's
// feature icons).
const shopBy = [
  {
    href: "/collections/tactical",
    label: "Tactical",
    icon: <path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.2-7.5 9.5-4.4-1.3-7.5-4.9-7.5-9.5V6z" />,
  },
  {
    href: "/collections/outdoor",
    label: "Outdoor",
    icon: <path d="M2.5 19.5l6.5-11 4 6.5 2.5-3.5 6 8z" />,
  },
  {
    href: "/collections/gps",
    label: "GPS",
    icon: (
      <>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
  },
  {
    href: "/collections/calling",
    label: "Calling",
    icon: <path d="M6.6 3.5h3l1.4 4.2-2 1.5a11 11 0 0 0 5.8 5.8l1.5-2 4.2 1.4v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />,
  },
  {
    href: "/collections/long-battery",
    label: "Long battery",
    icon: (
      <>
        <rect x="3" y="7.5" width="16" height="9" rx="2" />
        <path d="M21 10.5v3M6 10.5v3M9 10.5v3M12 10.5v3" />
      </>
    ),
  },
  {
    href: "/compare",
    label: "Compare",
    icon: (
      <>
        <rect x="3.5" y="4.5" width="7" height="15" rx="2" />
        <rect x="13.5" y="4.5" width="7" height="15" rx="2" />
        <path d="M6 9h2M16 9h2M6 12.5h2M16 12.5h2" />
      </>
    ),
  },
];

const help = [
  { href: "/faq", label: "FAQs" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/warranty", label: "Warranty" },
  { href: "/contact", label: "Contact us" },
  { href: "/about", label: "About MATIN" },
];

// One short line under each watch name in the phone menu.
const watchLine: Record<string, string> = {
  "matin-trekon": "Rugged · 30-day battery · 3ATM",
  "matin-torvan": "Round AMOLED · Sapphire",
  "matin-kaldor": "Outdoor · GPS · 5ATM",
  "matin-varkon": "AMOLED · 6-system GPS",
};

export type MenuWatch = { slug: string; name: string; price: string; image?: string };

export default function Header({ watches = [] }: { watches?: MenuWatch[] }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  // The menu is built (off screen) right after the page starts, so its
  // photos and page links are ready when it is tapped: opening it then only
  // switches a class, with no work that could make it stutter.
  const [ready, setReady] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  // Starts the menu right under the header. Set on the menu itself, not the
  // page root: a change on the root makes the browser restyle the whole
  // page, which is what made the tap feel slow on the longer pages.
  const place = useCallback(() => {
    const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    menuRef.current?.style.setProperty("--menu-top", `${Math.max(0, Math.round(bottom))}px`);
  }, []);

  // While the phone menu is open: keep it under the header and close it with
  // Escape or when the screen gets wide.
  useEffect(() => {
    if (!open) return;
    place();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 861px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      wide.removeEventListener("change", onWide);
    };
  }, [open, place]);

  useEffect(() => {
    const go = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(go, { timeout: 800 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(go, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.querySelectorAll<HTMLImageElement>(".mmenu img").forEach((img) => {
      img.decode?.().catch(() => {});
    });
  }, [ready]);

  return (
    <>
      <div className="announce">Free worldwide shipping · 1 year warranty · 30 day returns</div>
      <header className="header" ref={headerRef}>
        <div className="header-inner">
          <button
            className={`icon-btn menu-btn${open ? " is-open" : ""}`}
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              if (!open) place();
              setOpen(!open);
            }}
          >
            <span className="menu-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
          <Link href="/" className="header-logo" aria-label="MATIN Rugged Smartwatches, home" onClick={close}>
            <Logo />
          </Link>
          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" className="icon-btn cart-btn" aria-label={`Cart, ${count} items`} onClick={close}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>

        {(ready || open) && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className={`mmenu${open ? " is-open" : ""}`}
            role="dialog"
            aria-label="Menu"
            aria-hidden={!open}
            inert={!open}
          >
            <button className="mmenu-backdrop" aria-label="Close menu" tabIndex={-1} onClick={close} />
            <div className="mmenu-panel">
              <MenuBody watches={watches} onNav={close} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// The menu's contents never change while it opens or closes, so they are
// kept out of the re-render a tap causes: only the wrapper's class changes.
const MenuBody = memo(function MenuBody({ watches, onNav }: { watches: MenuWatch[]; onNav: () => void }) {
  return (
    <div className="mmenu-in">
      <div className="mmenu-head">
        <p className="mmenu-label">Watches</p>
        <Link href="/shop" className="mmenu-all" onClick={onNav}>
          Shop all
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
      <ul className="mmenu-watches">
        {watches.map((w) => (
          <li key={w.slug}>
            <Link href={`/product/${w.slug}`} onClick={onNav}>
              <span className="mmenu-photo">
                {w.image && (
                  <Image
                    src={w.image}
                    alt=""
                    fill
                    sizes="80px"
                    loading="eager"
                    fetchPriority="low"
                    style={{ objectFit: "contain" }}
                  />
                )}
              </span>
              <span className="mmenu-text">
                <span className="mmenu-name">{w.name.replace(/^MATIN\s+/, "")}</span>
                {watchLine[w.slug] && <span className="mmenu-line">{watchLine[w.slug]}</span>}
              </span>
              <span className="mmenu-price">{w.price}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mmenu-label">Shop by</p>
      <ul className="mmenu-tiles">
        {shopBy.map((s) => (
          <li key={s.href}>
            <Link href={s.href} onClick={onNav}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {s.icon}
              </svg>
              {s.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mmenu-label">Help</p>
      <ul className="mmenu-help">
        {help.map((h) => (
          <li key={h.href}>
            <Link href={h.href} onClick={onNav}>
              {h.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mmenu-foot">
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <span>Free worldwide shipping · 1 year warranty</span>
      </div>
    </div>
  );
});
