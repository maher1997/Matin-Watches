"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { categories, products, type Category } from "@/lib/products";
import ProductCard from "./ProductCard";

type Sort = "featured" | "low" | "high";

export default function ShopGrid() {
  const params = useSearchParams();
  return <ShopGridView active={(params.get("c") as Category | null) ?? null} />;
}

// The grid itself. The shop page also renders it with no filter as the
// first paint, so the page is full height right away and does not jump.
export function ShopGridView({ active }: { active: Category | null }) {
  const router = useRouter();
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    const filtered = active ? products.filter((p) => p.category === active) : products;
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [active, sort]);

  const pick = (c: Category | null) => router.replace(c ? `/shop?c=${c}` : "/shop", { scroll: false });

  return (
    <>
      <div className="toolbar">
        <div className="chips">
          <button className={!active ? "chip active" : "chip"} onClick={() => pick(null)}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.id} className={active === c.id ? "chip active" : "chip"} onClick={() => pick(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
        <label className="sort">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <p className="result-count">{list.length} watches</p>
      <div className="grid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}
