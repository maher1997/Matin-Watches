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
  const [picks, setPicks] = useState([0, 1]);
  const [stuck, setStuck] = useState(false);
  const head = useRef<HTMLTableSectionElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const H = heading;

  const off = (i: number) => (picks.includes(i) ? "" : " cmp-off");
  // The two chosen watches come first; on a computer (where the menus are
  // hidden) the picks never change, so the order stays 1, 2, 3, 4.
  const cols = [
    ...picks,
    ...watches.map((_, i) => i).filter((i) => !picks.includes(i)),
  ];

  const pick = (slot: number, i: number) =>
    setPicks((p) => {
      const next = [...p];
      // Choosing the watch already in the other column swaps the two.
      if (next[1 - slot] === i) next[1 - slot] = next[slot];
      next[slot] = i;
      return next;
    });

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
      <div className="cmp-pickers">
        {picks.map((sel, slot) => (
          <label key={slot} className="cmp-picker">
            <span className="sr-only">Watch {slot + 1} to compare</span>
            <select
              value={sel}
              onChange={(e) => pick(slot, Number(e.target.value))}
            >
              {watches.map((w, i) => (
                <option key={w.product.slug} value={i}>
                  {w.product.name}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10l5 5 5-5" />
            </svg>
          </label>
        ))}
      </div>

      <div className={`cmp-bar${stuck ? " is-on" : ""}`} aria-hidden="true">
        <div className="cmp-bar-row">
          <span className="cmp-bar-corner" />
          {cols.map((i) => (
            <span key={i} className={`cmp-bar-cell${off(i)}`}>
              <strong>{watches[i].product.name.replace("MATIN ", "")}</strong>
              {watches[i].price}
            </span>
          ))}
        </div>
      </div>

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
                <th
                  key={w.product.slug}
                  scope="col"
                  className={`cmp-watch${off(i)}`}
                >
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
                  {g.title}
                </th>
              </tr>
            )}
            {g.rows.map((r) => (
              <tr key={r.label} className="cmp-row">
                <th scope="row">{r.label}</th>
                {cols.map((i) => (
                  <td key={i} className={off(i).trim() || undefined}>
                    <Value v={r.values[i]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
