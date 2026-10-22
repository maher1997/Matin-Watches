import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ScrollProbe from "@/components/ScrollProbe";
import { formatPrice, products } from "@/lib/products";
import { absoluteUrl, site, siteUrl } from "@/lib/site";
import "./globals.css";

// Self-hosted, trimmed copies of Inter, Oswald and Montserrat (Latin
// characters only, only the weights the site uses) so the first load is
// much lighter than the full Google Fonts files.
const sans = localFont({
  src: "./fonts/inter.woff2",
  weight: "400 700",
  variable: "--font-sans",
});

const display = localFont({
  src: "./fonts/oswald.woff2",
  weight: "400 700",
  variable: "--font-display",
});

// Only the letters needed for the "RUGGED SMARTWATCHES" tagline.
const brand = localFont({
  src: "./fonts/montserrat-tagline.woff2",
  weight: "600",
  variable: "--font-brand",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: "%s | MATIN" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "MATIN rugged smartwatches" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.jpg"] },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0f1018" };

// Tells Google who runs the site and lets it show the site name in results.
const orgData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: site.name,
      url: siteUrl,
      logo: absoluteUrl("/icon.png"),
      slogan: "Rugged Smartwatches",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: site.name,
      alternateName: "MATIN Rugged Smartwatches",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#org` },
    },
  ],
};

const domGuard = `(function(){if(typeof Node!=="function"||!Node.prototype)return;var r=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c.parentNode!==this){return c}return r.apply(this,arguments)};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,ref){if(ref&&ref.parentNode!==this){return n}return i.apply(this,arguments)}})();`;

// The phone's screen height, measured once when the page opens and again only
// if the phone is turned. Inside apps like Instagram the app's own bars slide
// away on the first scroll and the page's height changes; sizes tied to that
// height made the whole page lay out again mid-scroll, a visible hitch.
// Instagram's in-app browser on iPhone also gets data-ig (see globals.css
// and lib/scrolling.ts). ?t=1 to ?t=4 sets data-t for the test links
// described in globals.css.
const screenHeight = `(function(){var d=document.documentElement,w=0;if(/Instagram/.test(navigator.userAgent))d.setAttribute("data-ig","");var t=/[?&]t=([1-4])/.exec(location.search);if(t)d.setAttribute("data-t",t[1]);function s(){if(innerWidth!==w){w=innerWidth;d.style.setProperty("--sv",innerHeight+"px")}}s();addEventListener("resize",s)})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-US"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable} ${brand.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Browser extensions and auto-translate wrap or move text on the
            page; when React later updates that text it can no longer find
            it and the whole page breaks. This makes those two DOM calls
            forgiving, so the page keeps working. */}
        <script dangerouslySetInnerHTML={{ __html: domGuard }} />
        <script dangerouslySetInnerHTML={{ __html: screenHeight }} />
      </head>
      <body suppressHydrationWarning>
        <JsonLd data={orgData} />
        <CartProvider>
          <Header
            watches={products.map((p) => ({
              slug: p.slug,
              name: p.name,
              price: formatPrice(p.price).replace(/\.00$/, ""),
              image: p.images[0],
            }))}
          />
          <main>{children}</main>
          <ScrollProbe />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
