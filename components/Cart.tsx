"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartLine = { slug: string; color: string; qty: number };

type CartState = {
  lines: CartLine[];
  count: number;
  add: (slug: string, color: string, qty?: number) => void;
  setQty: (slug: string, color: string, qty: number) => void;
  remove: (slug: string, color: string) => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "matin-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const same = (l: CartLine, slug: string, color: string) => l.slug === slug && l.color === color;

  const value: CartState = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    add: (slug, color, qty = 1) =>
      setLines((prev) =>
        prev.some((l) => same(l, slug, color))
          ? prev.map((l) => (same(l, slug, color) ? { ...l, qty: l.qty + qty } : l))
          : [...prev, { slug, color, qty }],
      ),
    setQty: (slug, color, qty) =>
      setLines((prev) =>
        qty < 1
          ? prev.filter((l) => !same(l, slug, color))
          : prev.map((l) => (same(l, slug, color) ? { ...l, qty } : l)),
      ),
    remove: (slug, color) => setLines((prev) => prev.filter((l) => !same(l, slug, color))),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
