"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  images: string[];
  alts: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const MAX = 4;

// Full-screen photo viewer. Pinch or double-tap to zoom (wheel or double-click
// on a computer), drag to look around, swipe or use the arrows for the next
// photo. Closes with the X, the Escape key or a tap on the dark backdrop.
export default function Lightbox({
  images,
  alts,
  index,
  onIndex,
  onClose,
}: Props) {
  const n = images.length;
  const stage = useRef<HTMLDivElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0 });
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    s: number;
    x: number;
    y: number;
    d: number;
    cx: number;
    cy: number;
    moved: boolean;
  } | null>(null);
  const lastTap = useRef(0);
  const [zoomed, setZoomed] = useState(false);

  const apply = useCallback((smooth = false) => {
    const el = pic.current;
    if (!el) return;
    const { s, x, y } = view.current;
    el.style.transition = smooth
      ? "transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)"
      : "none";
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    setZoomed(s > 1.01);
  }, []);

  // Keep the photo from being dragged off the screen.
  const clamp = useCallback(() => {
    const box = stage.current?.getBoundingClientRect();
    const v = view.current;
    if (!box) return;
    v.s = Math.min(MAX, Math.max(1, v.s));
    const mx = ((v.s - 1) * box.width) / 2;
    const my = ((v.s - 1) * box.height) / 2;
    v.x = Math.min(mx, Math.max(-mx, v.x));
    v.y = Math.min(my, Math.max(-my, v.y));
  }, []);

  // Zoom towards a point on the screen.
  const zoomAt = useCallback(
    (s: number, px: number, py: number, smooth = true) => {
      const box = stage.current?.getBoundingClientRect();
      const v = view.current;
      if (!box) return;
      const ox = px - (box.left + box.width / 2);
      const oy = py - (box.top + box.height / 2);
      const k = s / v.s;
      v.x = ox - (ox - v.x) * k;
      v.y = oy - (oy - v.y) * k;
      v.s = s;
      clamp();
      apply(smooth);
    },
    [apply, clamp],
  );

  const reset = useCallback(() => {
    view.current = { s: 1, x: 0, y: 0 };
    apply(true);
  }, [apply]);

  const go = useCallback(
    (d: number) => {
      view.current = { s: 1, x: 0, y: 0 };
      apply();
      onIndex((index + d + n) % n);
    },
    [apply, index, n, onIndex],
  );

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  const down = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    const v = view.current;
    const cx = p.reduce((a, b) => a + b.x, 0) / p.length;
    const cy = p.reduce((a, b) => a + b.y, 0) / p.length;
    const d = p.length > 1 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0;
    gesture.current = { s: v.s, x: v.x, y: v.y, d, cx, cy, moved: false };
  };

  const move = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId) || !gesture.current) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    const g = gesture.current;
    const v = view.current;
    const cx = p.reduce((a, b) => a + b.x, 0) / p.length;
    const cy = p.reduce((a, b) => a + b.y, 0) / p.length;
    if (Math.hypot(cx - g.cx, cy - g.cy) > 6) g.moved = true;
    if (p.length > 1 && g.d) {
      // Pinch: scale around the fingers' midpoint, and follow it as it moves.
      g.moved = true;
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      v.s = g.s;
      v.x = g.x;
      v.y = g.y;
      zoomAt(Math.min(MAX, Math.max(1, (g.s * d) / g.d)), g.cx, g.cy, false);
      v.x += cx - g.cx;
      v.y += cy - g.cy;
      clamp();
      apply();
    } else if (v.s > 1.01) {
      v.x = g.x + (cx - g.cx);
      v.y = g.y + (cy - g.cy);
      clamp();
      apply();
    } else if (pic.current) {
      // Not zoomed: the photo follows a sideways swipe a little.
      pic.current.style.transition = "none";
      pic.current.style.transform = `translate3d(${(cx - g.cx) * 0.6}px, 0, 0)`;
    }
  };

  const up = (e: React.PointerEvent) => {
    const g = gesture.current;
    const start = g ? { x: g.cx, y: g.cy } : null;
    pts.current.delete(e.pointerId);
    if (pts.current.size) {
      // One finger lifted from a pinch: carry on panning from here.
      const [p] = [...pts.current.values()];
      const v = view.current;
      gesture.current = {
        s: v.s,
        x: v.x,
        y: v.y,
        d: 0,
        cx: p.x,
        cy: p.y,
        moved: true,
      };
      return;
    }
    gesture.current = null;
    if (!g || !start) return;
    const dx = e.clientX - start.x;
    if (view.current.s <= 1.01) {
      if (g.moved && Math.abs(dx) > 60 && n > 1) return go(dx < 0 ? 1 : -1);
      reset();
    }
    if (g.moved) return;
    // A tap: double tap zooms in or out; a single tap on the backdrop closes.
    const now = Date.now();
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      if (view.current.s > 1.01) reset();
      else zoomAt(2.5, e.clientX, e.clientY);
    } else {
      lastTap.current = now;
      const onBackdrop = e.target === stage.current;
      if (onBackdrop && view.current.s <= 1.01) {
        window.setTimeout(() => lastTap.current && onClose(), 300);
      }
    }
  };

  const wheel = (e: React.WheelEvent) => {
    const s = view.current.s * Math.exp(-e.deltaY * 0.0025);
    zoomAt(Math.min(MAX, Math.max(1, s)), e.clientX, e.clientY, false);
  };

  return createPortal(
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div
        ref={stage}
        className={`lb-stage${zoomed ? " zoomed" : ""}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onWheel={wheel}
      >
        <div ref={pic} className="lb-pic">
          <Image
            key={images[index]}
            src={images[index]}
            alt={alts[index] ?? ""}
            fill
            sizes="100vw"
            quality={90}
            priority
            draggable={false}
          />
        </div>
      </div>
      <div className="lb-top">
        <span className="lb-count">
          {index + 1} / {n}
        </span>
        <span className="lb-hint">
          {zoomed ? "Drag to look around" : "Pinch or double-tap to zoom"}
        </span>
        <button
          type="button"
          className="lb-btn"
          aria-label="Close photo viewer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      {n > 1 && (
        <>
          <button
            type="button"
            className="lb-btn lb-prev"
            aria-label="Previous photo"
            onClick={() => go(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="lb-btn lb-next"
            aria-label="Next photo"
            onClick={() => go(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
