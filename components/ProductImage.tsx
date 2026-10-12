import Image from "next/image";
import type { Product } from "@/lib/products";
import WatchArt from "./WatchArt";

type Props = { product: Product; index?: number; priority?: boolean; sizes?: string };

// Shows the product photo when one exists, otherwise the drawn placeholder.
export default function ProductImage({ product, index = 0, priority, sizes }: Props) {
  const src = product.images[index];
  if (src) {
    return (
      <Image
        src={src}
        alt={product.name}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        style={{ objectFit: "contain" }}
      />
    );
  }
  return <WatchArt {...product.art} />;
}
