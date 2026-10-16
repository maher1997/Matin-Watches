"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "./Cart";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  // "Added ✓" only for the colour and amount just added; any change resets it.
  const [added, setAdded] = useState(false);
  const [inCart, setInCart] = useState(false);
  // Phone bar: shown while the main Add to cart row is off screen.
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowHidden, setRowHidden] = useState(false);

  const pick = (i: number) => {
    setAdded(false);
    setQty(1);
    setColor(product.colors[i].name);
    window.dispatchEvent(new CustomEvent("matin:color", { detail: { slug: product.slug, color: i } }));
  };

  // Opened from the cart with ?color=Orange: start on that color and its photos.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("color");
    const i = product.colors.findIndex((c) => c.name === wanted);
    if (i > 0) pick(i);
  }, [product]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setRowHidden(!e.isIntersecting));
    io.observe(row);
    return () => io.disconnect();
  }, []);

  const addNow = () => {
    add(product.slug, color, qty);
    setAdded(true);
    setInCart(true);
  };

  return (
    <div className="buy">
      <p className="label">
        Color: <strong>{color}</strong>
      </p>
      <div className="color-pick">
        {product.colors.map((c, i) => (
          <button
            key={c.name}
            className={c.name === color ? "active" : ""}
            style={{ background: c.hex }}
            aria-label={c.name}
            aria-pressed={c.name === color}
            onClick={() => pick(i)}
          />
        ))}
      </div>
      <div className="buy-row" ref={rowRef}>
        <div className="qty">
          <button aria-label="Less" onClick={() => { setQty(Math.max(1, qty - 1)); setAdded(false); }}>−</button>
          <span>{qty}</span>
          <button aria-label="More" onClick={() => { setQty(qty + 1); setAdded(false); }}>+</button>
        </div>
        <button
          className="btn btn-primary btn-wide"
          onClick={addNow}
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
      {inCart && (
        <Link href="/cart" className="btn btn-ghost btn-wide">
          View cart and checkout
        </Link>
      )}
      <div className={`buy-bar${rowHidden ? " on" : ""}`} aria-hidden={!rowHidden || undefined}>
        <div className="buy-bar-text">
          <strong>{formatPrice(product.price)}</strong>
          <span>{color}</span>
        </div>
        {added ? (
          <Link href="/cart" className="btn btn-primary" tabIndex={rowHidden ? 0 : -1}>
            View cart
          </Link>
        ) : (
          <button className="btn btn-primary" onClick={addNow} tabIndex={rowHidden ? 0 : -1}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
