import Image from "next/image";
import type { Product } from "@/lib/products";

// Simple line icons for the spec groups, matched by group name.
const groupIcons: Record<string, string> = {
  display: "M9 2h6l1 3H8z M8 19h8l-1 3H9z M7.5 5h9A1.5 1.5 0 0 1 18 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 17.5v-11A1.5 1.5 0 0 1 7.5 5z M12 9v3l2 1.5",
  battery: "M8 4h8v17H8z M10 2h4 M10.5 8h3 M10.5 11.5h3 M10.5 15h3",
  gps: "M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  health:
    "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z M6 12.5h3l1.5-2.5 2 4 1.5-1.5h4",
  build: "M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z M9 12l2 2 4-4",
  smart: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M10.5 18h3 M9 7.5h6 M9 11h6",
  box: "M3 7.5l9-4.5 9 4.5v9L12 21l-9-4.5v-9z M3 7.5l9 4.5 9-4.5 M12 12v9",
};

function iconFor(group: string) {
  const g = group.toLowerCase();
  if (g.includes("display") || g.includes("screen")) return groupIcons.display;
  if (g.includes("battery")) return groupIcons.battery;
  if (g.includes("gps") || g.includes("sport")) return groupIcons.gps;
  if (g.includes("health")) return groupIcons.health;
  if (g.includes("build") || g.includes("design")) return groupIcons.build;
  if (g.includes("box")) return groupIcons.box;
  return groupIcons.smart;
}

// Specification section: the watch on one side, the specs as icon cards on
// the other. Plain HTML, so Google reads every row.
export default function SpecSheet({ product, groups }: { product: Product; groups: [string, Product["specs"]][] }) {
  // The straight-on front photo reads best next to the specs.
  const photo = product.images.find((src) => src.includes("front-view")) ?? product.images[1] ?? product.images[0];
  return (
    <section className="section spec-sheet" aria-labelledby="specs-title">
      <div className="spec-aside">
        <p className="spec-eyebrow">Tech specs</p>
        <h2 id="specs-title" className="spec-title">
          {product.name}{" "}
          <span>specifications</span>
        </h2>
        {photo && (
          <div className="spec-photo">
            <span className="photo-glow" aria-hidden="true" />
            <Image
              className="product-photo"
              src={photo}
              alt=""
              fill
              sizes="(max-width: 860px) 60vw, 340px"
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
        {product.highlights && (
          <ul className="spec-chips">
            {product.highlights.map((h) => (
              <li key={h.label}>
                <strong>{h.value}</strong>
                <span>{h.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="spec-cards">
        {groups.map(([group, rows]) => (
          <div key={group || "specs"} className={`spec-card${group.toLowerCase().includes("box") ? " wide" : ""}`}>
            <div className="spec-card-head">
              <span className="spec-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={iconFor(group)} />
                </svg>
              </span>
              <h3>{group || "Details"}</h3>
            </div>
            <dl>
              {rows.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
