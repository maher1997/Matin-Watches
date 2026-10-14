"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";

// Product photos: a big picture plus a row of thumbnails. Tapping a
// thumbnail fades the big picture over to that photo.
export default function PdpGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  // Only photos someone has opened are loaded, so the first one paints fast.
  const [seen, setSeen] = useState<number[]>([0]);
  const count = product.images.length;

  return (
    <div className={`pdp-gallery${seen.length > 1 ? " fx" : ""}`}>
      <div className="pdp-main">
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
              onClick={() => {
                setActive(i);
                setSeen((v) => (v.includes(i) ? v : [...v, i]));
              }}
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
