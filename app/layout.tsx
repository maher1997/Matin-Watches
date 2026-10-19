import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Motion from "@/components/Motion";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" data-scroll-behavior="smooth" className={`${sans.variable} ${display.variable} ${brand.variable}`}>
      <body>
        <JsonLd data={orgData} />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Motion />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
