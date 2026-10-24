"use client";

import { useEffect, useRef, useState } from "react";
import { colorRange, type Product } from "@/lib/products";
import ProductImage from "./ProductImage";
import Lightbox from "./Lightbox";

// Product photos: a big picture plus a row of thumbnails. Tapping a
// thumbnail (or swiping the big picture) fades over to that photo.
export default function PdpGallery({ product }: { product: Product }) {
  // Picking a color (in AddToCart) swaps the gallery to that color's photos.
  const [color, setColor] = useState(0);
  const [start, end] = colorRange(product, color);
  const photos = product.images.slice(start, end);
  const [active, setActive] = useState(0);
  // Only photos someone has opened are loaded, so the first one paints fast.
  const [seen, setSeen] = useState<number[]>([0]);
  const count = photos.length;
  // Fade only after the first tap, so the first photo shows instantly.
  const [fx, setFx] = useState(false);
  const touchX = useRef(0);
  // Set when a second finger lands: a pinch is never a swipe.
  const pinched = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);

  // Pinching the big photo opens the full-screen viewer (which zooms the
  // photo itself) instead of zooming the whole page, which threw the page
  // and the Add to cart bar out of place on phones.
  useEffect(() => {
    const el = mainRef.current;
    if (!el || !count) return;
    const block = (e: Event) => e.preventDefault();
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length < 2) return;
      e.preventDefault();
      if (!pinched.current) {
        pinched.current = true;
        setZoom(true);
      }
    };
    el.addEventListener("touchstart", onTouch, { passive: false });
    el.addEventListener("touchmove", onTouch, { passive: false });
    // Safari's own pinch events.
    el.addEventListener("gesturestart", block);
    el.addEventListener("gesturechange", block);
    return () => {
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("touchmove", onTouch);
      el.removeEventListener("gesturestart", block);
      el.removeEventListener("gesturechange", block);
    };
  }, [count]);

  // Once the page has settled, load the other photos quietly in the
  // background so switching is instant instead of waiting on a download.
  // Never while the page is scrolling: three big photos decoding mid-scroll
  // made the first scroll catch in slower browsers like Instagram's.
  useEffect(() => {
    if (count < 2) return;
    let id = 0;
    const load = () => {
      removeEventListener("scroll", wait);
      setSeen((v) => [...new Set([...v, ...photos.map((_, i) => start + i)])]);
    };
    const wait = () => {
      clearTimeout(id);
      id = window.setTimeout(load, 1200);
    };
    id = window.setTimeout(load, 2500);
    addEventListener("scroll", wait, { passive: true });
    return () => {
      clearTimeout(id);
      removeEventListener("scroll", wait);
    };
  }, [count, start]);

  useEffect(() => {
    const onColor = (e: Event) => {
      const d = (e as CustomEvent<{ slug: string; color: number }>).detail;
      if (d.slug !== product.slug) return;
      const [s] = colorRange(product, d.color);
      setFx(true);
      setColor(d.color);
      setActive(0);
      setSeen((v) => (v.includes(s) ? v : [...v, s]));
    };
    window.addEventListener("matin:color", onColor);
    return () => window.removeEventListener("matin:color", onColor);
  }, [product]);

  const show = (i: number) => {
    const next = (i + count) % count;
    setFx(true);
    setActive(next);
    setSeen((v) => (v.includes(start + next) ? v : [...v, start + next]));
  };

  return (
    <div className={`pdp-gallery${fx ? " fx" : ""}`}>
      <div
        ref={mainRef}
        className={`pdp-main${count ? " can-zoom" : ""}`}
        onClick={() => count && setZoom(true)}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            pinched.current = false;
            touchX.current = e.touches[0].clientX;
          }
        }}
        onTouchEnd={(e) => {
          if (pinched.current || e.touches.length) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (count > 1 && Math.abs(dx) > 50) show(active + (dx < 0 ? 1 : -1));
        }}
      >
        {product.badge && <span className="badge">{product.badge}</span>}
        {count > 0 && (
          <button
            type="button"
            className="pdp-zoom"
            aria-label="Open photo full screen"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(true);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" />
            </svg>
          </button>
        )}
        {count === 0 ? (
          <ProductImage
            product={product}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        ) : (
          photos.map((src, i) =>
            seen.includes(start + i) ? (
              <div
                key={src}
                className={`pdp-slide${i === active ? " on" : ""}`}
                aria-hidden={i !== active || undefined}
              >
                <ProductImage
                  product={product}
                  index={start + i}
                  priority={start + i === 0}
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
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === active ? "thumb active" : "thumb"}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-pressed={i === active}
              onClick={() => show(i)}
            >
              <ProductImage
                product={product}
                index={start + i}
                sizes="120px"
                alt=""
              />
            </button>
          ))}
        </div>
      )}
      {product.faceNote && <p className="pdp-face-note">{product.faceNote}</p>}
      {zoom && count > 0 && (
        <Lightbox
          images={photos}
          alts={photos.map(
            (_, i) =>
              product.imageAlts?.[start + i] ??
              `${product.name} rugged smartwatch`,
          )}
          index={active}
          onIndex={show}
          onClose={() => setZoom(false)}
        />
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
