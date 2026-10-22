"use client";

import { useId, useState } from "react";

type Item = { q: string; a: string };

// Questions that open one at a time. The panel grows with a grid-row
// transition, so opening and closing glide the same way in Safari and
// Chrome. Every answer stays in the HTML for search engines.
export default function FaqList({
  items,
  start = 1,
  heading,
}: {
  items: Item[];
  start?: number;
  heading?: "h3";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  const Q = heading ?? "span";

  return (
    <div className="faq">
      {items.map((f, i) => {
        const on = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={f.q} className={`faq-row${on ? " is-open" : ""}`}>
            <button
              type="button"
              className="faq-btn"
              aria-expanded={on}
              aria-controls={id}
              onClick={() => setOpen(on ? null : i)}
            >
              <span className="faq-num">{String(start + i).padStart(2, "0")}</span>
              <Q className="faq-q">{f.q}</Q>
              <span className="faq-icon" aria-hidden="true" />
            </button>
            <div id={id} className="faq-panel" role="region" inert={!on}>
              <div className="faq-panel-in">
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
