"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import type { Product } from "@/lib/products";

type Watch = { product: Product; price: string; bestFor: string };
type Group = { title?: string; rows: { label: string; values: string[] }[] };

// One value in the table: "Yes" becomes a check mark, "No" and "—" a soft
// dash, and "Yes, 6 systems" a check mark with its detail.
function Value({ v }: { v: string }) {
  if (v === "No" || v === "—") {
    return (
      <span className="cmp-dash">
        <span aria-hidden="true">—</span>
        <span className="sr-only">{v === "No" ? "No" : "Not listed"}</span>
      </span>
    );
  }
  const yes = /^Yes\b/.exec(v);
  if (!yes) return <>{v}</>;
  const rest = v.slice(3).replace(/^,\s*/, "");
  return (
    <span className="cmp-yes">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
      <span className={rest ? undefined : "sr-only"}>
        {rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : "Yes"}
      </span>
    </span>
  );
}

// The side-by-side table. A computer shows all four watches; a phone shows
// two, and the menus above swap which two. Once the watch photos scroll away,
// a slim bar with the names stays under the header. Every value is in the
// page's HTML either way, so search engines read the whole table.
export default function CompareTable({
  watches,
  groups,
  heading = "h2",
}: {
  watches: Watch[];
  groups: Group[];
  heading?: "h2" | "h3";
}) {
  const [stuck, setStuck] = useState(false);
  const head = useRef<HTMLTableSectionElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const barInner = useRef<HTMLDivElement>(null);
  const barCorner = useRef<HTMLSpanElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const H = heading;
  const cols = watches.map((_, i) => i);

  // Phones: keep the name bar and the bottom scroll bar in step with the
  // table as it slides sideways.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const sync = () => {
      const x = sc.scrollLeft;
      const max = sc.scrollWidth - sc.clientWidth;
      if (barInner.current)
        barInner.current.style.transform = x ? `translateX(${-x}px)` : "";
      if (barCorner.current)
        barCorner.current.style.transform = x ? `translateX(${x}px)` : "";
      const t = thumb.current;
      const tr = track.current;
      if (t && tr) {
        // The groove is inset 14px on each side of the pill.
        const w = tr.clientWidth - 28;
        const tw =
          max > 0 ? Math.max(28, (w * sc.clientWidth) / sc.scrollWidth) : w;
        t.style.width = `${tw}px`;
        t.style.left = `${14 + (max > 0 ? ((w - tw) * x) / max : 0)}px`;
      }
    };
    sync();
    sc.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    return () => {
      sc.removeEventListener("scroll", sync);
      removeEventListener("resize", sync);
    };
  }, []);

  // Dragging (or tapping) the bottom bar slides the table.
  const drag = (e: React.PointerEvent<HTMLDivElement>) => {
    const sc = scroller.current;
    const tr = track.current;
    if (!sc || !tr) return;
    const move = (clientX: number) => {
      const r = tr.getBoundingClientRect();
      const p = Math.min(
        1,
        Math.max(0, (clientX - r.left - 14) / (r.width - 28)),
      );
      sc.scrollLeft = p * (sc.scrollWidth - sc.clientWidth);
    };
    move(e.clientX);
    tr.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => move(ev.clientX);
    const onUp = () => {
      tr.removeEventListener("pointermove", onMove);
      tr.removeEventListener("pointerup", onUp);
      tr.removeEventListener("pointercancel", onUp);
    };
    tr.addEventListener("pointermove", onMove);
    tr.addEventListener("pointerup", onUp);
    tr.addEventListener("pointercancel", onUp);
  };

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const top =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        ) || 70;
      const h = head.current?.getBoundingClientRect();
      const t = table.current?.getBoundingClientRect();
      setStuck(!!h && !!t && h.bottom < top && t.bottom > top + 120);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    check();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="cmp-panel">
      <p className="cmp-hint">
        Swipe the table to see all {watches.length} watches
      </p>

      <div className={`cmp-bar${stuck ? " is-on" : ""}`} aria-hidden="true">
        <div className="cmp-bar-row">
          <div ref={barInner} className="cmp-bar-inner">
            <span ref={barCorner} className="cmp-bar-corner" />
            {cols.map((i) => (
              <span key={i} className="cmp-bar-cell">
                <strong>{watches[i].product.name.replace("MATIN ", "")}</strong>
                {watches[i].price}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div ref={scroller} className="cmp-scroll">
        <table ref={table} className="cmp-table">
          <caption className="sr-only">
            MATIN smartwatches compared feature by feature
          </caption>
          <thead ref={head}>
            <tr>
              <td className="cmp-corner" />
              {cols.map((i) => {
                const w = watches[i];
                return (
                  <th key={w.product.slug} scope="col" className="cmp-watch">
                    <Link
                      href={`/product/${w.product.slug}`}
                      className="cmp-watch-media"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <ProductImage
                        product={w.product}
                        sizes="(max-width: 760px) 42vw, 18vw"
                      />
                    </Link>
                    <H className="cmp-watch-name">
                      <Link href={`/product/${w.product.slug}`}>
                        {w.product.name}
                      </Link>
                    </H>
                    <span className="cmp-watch-price">{w.price}</span>
                    <span className="cmp-watch-best">{w.bestFor}</span>
                    <Link
                      href={`/product/${w.product.slug}`}
                      className="btn btn-ghost cmp-watch-btn"
                    >
                      View
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          {groups.map((g, gi) => (
            <tbody key={g.title ?? gi}>
              {g.title && (
                <tr className="cmp-group">
                  <th scope="colgroup" colSpan={watches.length + 1}>
                    <span>{g.title}</span>
                  </th>
                </tr>
              )}
              {g.rows.map((r) => (
                <tr key={r.label} className="cmp-row">
                  <th scope="row">{r.label}</th>
                  {cols.map((i) => (
                    <td key={i}>
                      <Value v={r.values[i]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <div
        ref={track}
        className="cmp-track"
        onPointerDown={drag}
        aria-hidden="true"
      >
        <span ref={thumb} className="cmp-thumb" />
      </div>
    </div>
  );
}
