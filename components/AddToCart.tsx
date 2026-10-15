"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./Cart";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const pick = (i: number) => {
    setColor(product.colors[i].name);
    window.dispatchEvent(new CustomEvent("matin:color", { detail: { slug: product.slug, color: i } }));
  };

  // Opened from the cart with ?color=Orange: start on that color and its photos.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("color");
    const i = product.colors.findIndex((c) => c.name === wanted);
    if (i > 0) pick(i);
  }, [product]);

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
      <div className="buy-row">
        <div className="qty">
          <button aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span>{qty}</span>
          <button aria-label="More" onClick={() => setQty(qty + 1)}>+</button>
        </div>
        <button
          className="btn btn-primary btn-wide"
          onClick={() => {
            add(product.slug, color, qty);
            setAdded(true);
          }}
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
      {added && (
        <Link href="/cart" className="btn btn-ghost btn-wide">
          View cart and checkout
        </Link>
      )}
    </div>
  );
}
