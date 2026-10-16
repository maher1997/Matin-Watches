import type { ReactNode } from "react";

// The same heading block for every section of the product page:
// a small label, the section title (h2) and an optional short intro.
export default function SectionHead({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <header className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {intro && <p className="sec-intro">{intro}</p>}
    </header>
  );
}
