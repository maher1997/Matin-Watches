import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: "MATIN | Rugged Smartwatches",
  description: "Military-grade rugged smartwatches built for hard places.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${brand.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
