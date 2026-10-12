"use client";

import Link from "next/link";
import { useCart } from "@/components/Cart";
import ProductImage from "@/components/ProductImage";
import { formatPrice, getProduct } from "@/lib/products";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const items = lines
    .map((l) => ({ ...l, product: getProduct(l.slug) }))
    .filter((l) => l.product);
  const subtotal = items.reduce((n, l) => n + l.product!.price * l.qty, 0);

  return (
    <div className="container page-pad">
      <h1 className="page-title">Your cart</h1>

      {items.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary">Shop watches</Link>
        </div>
      ) : (
        <div className="cart">
          <ul className="cart-lines">
            {items.map(({ product: p, color, qty }) => (
              <li key={p!.slug + color} className="cart-line">
                <Link href={`/product/${p!.slug}`} className="cart-img">
                  <ProductImage product={p!} sizes="100px" />
                </Link>
                <div className="cart-info">
                  <Link href={`/product/${p!.slug}`}><h3>{p!.name}</h3></Link>
                  <p>{color}</p>
                  <div className="qty small">
                    <button aria-label="Less" onClick={() => setQty(p!.slug, color, qty - 1)}>−</button>
                    <span>{qty}</span>
                    <button aria-label="More" onClick={() => setQty(p!.slug, color, qty + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-right">
                  <p className="price">{formatPrice(p!.price * qty)}</p>
                  <button className="remove" onClick={() => remove(p!.slug, color)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="summary">
            <h2>Order summary</h2>
            <div className="sum-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="sum-row"><span>Shipping</span><span>Free</span></div>
            <div className="sum-row total"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            <button className="btn btn-primary btn-wide" disabled title="Checkout coming soon">
              Checkout
            </button>
            <p className="note">Checkout and payments will be connected later.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
