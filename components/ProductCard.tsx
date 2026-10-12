import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="card">
      <div className="card-media">
        {product.badge && <span className="badge">{product.badge}</span>}
        <ProductImage product={product} />
      </div>
      <div className="card-body">
        <p className="card-cat">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="card-tag">{product.tagline}</p>
        <div className="card-foot">
          <span className="price">
            {formatPrice(product.price)}
            {product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
          </span>
          <span className="swatches">
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} style={{ background: c.hex }} />
            ))}
          </span>
        </div>
      </div>
    </Link>
  );
}
