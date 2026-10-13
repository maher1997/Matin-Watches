import Image from "next/image";
import type { Product } from "@/lib/products";
import WatchArt from "./WatchArt";

type Props = { product: Product; index?: number; priority?: boolean; sizes?: string; alt?: string };

// Shows the product photo when one exists, otherwise the drawn placeholder.
export default function ProductImage({ product, index = 0, priority, sizes, alt }: Props) {
  const src = product.images[index];
  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? product.imageAlts?.[index] ?? `${product.name} rugged smartwatch`}
        fill
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        // Above-the-fold photos use slightly lighter files so the page paints sooner.
        quality={priority ? 60 : 75}
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        style={{ objectFit: "contain" }}
      />
    );
  }
  return <WatchArt {...product.art} />;
}
