"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./Cart";
import Logo from "./Logo";

const links = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?c=tactical", label: "Tactical" },
  { href: "/shop?c=outdoor", label: "Outdoor" },
  { href: "/shop?c=dive", label: "Dive" },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="announce">Free shipping worldwide · 2 year warranty · 30 day returns</div>
      <header className="header">
        <div className="header-inner">
          <button
            className="icon-btn menu-btn"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
          <Link href="/" className="header-logo" aria-label="MATIN Rugged Smartwatches, home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className={`nav ${open ? "open" : ""}`}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" className="icon-btn cart-btn" aria-label={`Cart, ${count} items`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </header>
    </>
  );
}
