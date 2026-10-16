import type { ReactNode } from "react";

// Plain wrapper. It used to fade blocks in on scroll, but on iPhone the
// blocks could stay hidden, so content now always shows straight away.
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  return <Tag className={className || undefined}>{children}</Tag>;
}
