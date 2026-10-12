import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/matin-logo.svg" alt="MATIN Rugged Smartwatches" width={1971} height={587} />
          <p>Smartwatches built for hard places.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link href="/shop">All watches</Link>
          <Link href="/shop?c=tactical">Tactical</Link>
          <Link href="/shop?c=outdoor">Outdoor</Link>
          <Link href="/shop?c=dive">Dive</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">Warranty</a>
          <a href="#">Contact us</a>
        </div>
        <form className="footer-news" action="#">
          <h4>Join the unit</h4>
          <p>New drops and field tests, no spam.</p>
          <div className="news-row">
            <input type="email" placeholder="Your email" aria-label="Email" />
            <button type="submit" className="btn btn-primary">Join</button>
          </div>
        </form>
      </div>
      <div className="footer-bottom">
        <a href="#">Terms of Service</a>
        <span className="dot">•</span>
        <a href="#">Privacy Policy</a>
        <p>© {new Date().getFullYear()} MATIN</p>
      </div>
    </footer>
  );
}
