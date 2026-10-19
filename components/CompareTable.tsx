"use client";

import Link from "next/link";
import { useState } from "react";
import ProductImage from "./ProductImage";
import type { Product } from "@/lib/products";

type Watch = { product: Product; price: string; bestFor: string };
type Group = { title: string; rows: { label: string; values: string[] }[] };

// The full side-by-side table. A computer shows all four watches; a phone
// shows two at a time, and the menus above each column swap which two.
// Every value is in the page's HTML either way, so search engines read the
// whole table.
export default function CompareTable({
  watches,
  groups,
}: {
  watches: Watch[];
  groups: Group[];
}) {
  const [picks, setPicks] = useState([0, 1]);
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

  return (
    <>
      <div className="cmp-pickers" aria-label="Choose two watches to compare">
        {picks.map((sel, slot) => (
          <label key={slot} className="cmp-picker">
            <span className="sr-only">Watch {slot + 1}</span>
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

      <div className="cmp-cards">
        {cols
          .map((i) => watches[i])
          .map((w, k) => (
            <article key={w.product.slug} className={`cmp-card${off(cols[k])}`}>
              <Link
                href={`/product/${w.product.slug}`}
                className="cmp-card-media"
                tabIndex={-1}
                aria-hidden="true"
              >
                <ProductImage
                  product={w.product}
                  sizes="(max-width: 760px) 45vw, 22vw"
                />
              </Link>
              <h2>
                <Link href={`/product/${w.product.slug}`}>
                  {w.product.name}
                </Link>
              </h2>
              <p className="cmp-price">{w.price}</p>
              <p className="cmp-best">{w.bestFor}</p>
              <Link
                href={`/product/${w.product.slug}`}
                className="btn btn-primary cmp-btn"
              >
                View
              </Link>
            </article>
          ))}
      </div>

      <table className="cmp-table">
        <caption className="sr-only">
          MATIN smartwatches compared feature by feature
        </caption>
        <thead>
          <tr>
            <th scope="col" className="cmp-corner">
              <span className="sr-only">Feature</span>
            </th>
            {cols.map((i) => (
              <th
                key={watches[i].product.slug}
                scope="col"
                className={`cmp-head${off(i)}`}
              >
                {watches[i].product.name.replace("MATIN ", "")}
                <span>{watches[i].price}</span>
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.title}>
            <tr className="cmp-group">
              <th scope="colgroup" colSpan={watches.length + 1}>
                {g.title}
              </th>
            </tr>
            {g.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {cols.map((i) => (
                  <td
                    key={i}
                    className={`${r.values[i] === "—" || r.values[i] === "No" ? "cmp-no" : ""}${off(i)}`}
                  >
                    {r.values[i]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </>
  );
}
