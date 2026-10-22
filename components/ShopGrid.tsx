"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { collections, collectionsOf, products } from "@/lib/products";
import ProductCard from "./ProductCard";

type Sort = "featured" | "low" | "high";

export default function ShopGrid() {
  const params = useSearchParams();
  return <ShopGridView active={params.get("c")} />;
}

// The grid itself. The shop page also renders it with no filter as the
// first paint, so the page is full height right away and does not jump.
export function ShopGridView({ active }: { active: string | null }) {
  const router = useRouter();
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    const filtered = active ? products.filter((p) => collectionsOf(p).includes(active)) : products;
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [active, sort]);

  const showAll = () => router.replace("/shop", { scroll: false });

  return (
    <>
      <div className="toolbar">
        <div className="chips">
          <button className={!active ? "chip active" : "chip"} onClick={showAll}>
            All
          </button>
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.id}`} className={active === c.id ? "chip active" : "chip"}>
              {c.name}
            </Link>
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
        {list.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i === 0} />
        ))}
      </div>
    </>
  );
}
