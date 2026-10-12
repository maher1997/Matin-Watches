import type { Metadata } from "next";
import { Inter, Montserrat, Oswald } from "next/font/google";
import { CartProvider } from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const brand = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
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
