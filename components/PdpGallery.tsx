"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";

// Product photos: a big picture plus a row of thumbnails. Tapping a
// thumbnail (or swiping the big picture) fades over to that photo.
export default function PdpGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  // Only photos someone has opened are loaded, so the first one paints fast.
  const [seen, setSeen] = useState<number[]>([0]);
  const count = product.images.length;
  // Fade only after the first tap, so the first photo shows instantly.
  const [fx, setFx] = useState(false);
  const touchX = useRef(0);

  // Once the page has settled, load the other photos quietly in the
  // background so switching is instant instead of waiting on a download.
  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => setSeen(product.images.map((_, i) => i)), 2500);
    return () => clearTimeout(id);
  }, [count, product.images]);

  const show = (i: number) => {
    const next = (i + count) % count;
    setFx(true);
    setActive(next);
    setSeen((v) => (v.includes(next) ? v : [...v, next]));
  };

  return (
    <div className={`pdp-gallery${fx ? " fx" : ""}`}>
      <div
        className="pdp-main"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (count > 1 && Math.abs(dx) > 50) show(active + (dx < 0 ? 1 : -1));
        }}
      >
        {product.badge && <span className="badge">{product.badge}</span>}
        {count === 0 ? (
          <ProductImage
            product={product}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        ) : (
          product.images.map((src, i) =>
            seen.includes(i) ? (
              <div
                key={src}
                className={`pdp-slide${i === active ? " on" : ""}`}
                aria-hidden={i !== active || undefined}
              >
                <ProductImage
                  product={product}
                  index={i}
                  priority={i === 0}
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
            ) : null,
          )
        )}
      </div>
      {count > 1 && (
        <div
          className="pdp-thumbs"
          style={{ gridTemplateColumns: `repeat(${Math.max(4, count)}, 1fr)` }}
        >
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === active ? "thumb active" : "thumb"}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-pressed={i === active}
              onClick={() => show(i)}
            >
              <ProductImage product={product} index={i} sizes="120px" alt="" />
            </button>
          ))}
        </div>
      )}
      {count === 0 && (
        <div className="pdp-thumbs">
          {[0, 1, 2].map((i) => (
            <div key={i} className={i === 0 ? "thumb active" : "thumb"}>
              <ProductImage product={product} sizes="120px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
