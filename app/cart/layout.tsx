import type { Metadata } from "next";

// The cart is personal to each visitor, so keep it out of search results.
export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
