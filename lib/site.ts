// One place for the site's public address. When the real domain is ready,
// set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://matinwatches.com) and
// every canonical link, the sitemap and the Google product data switch over.
const fallback = "https://matin-watches.vercel.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/+$/, "");

export const site = {
  name: "MATIN",
  title: "MATIN | Rugged Military & Tactical Smartwatches",
  description:
    "MATIN makes rugged military-style and tactical smartwatches for men: tough cases, bright AMOLED screens and weeks of battery. Free worldwide shipping.",
  currency: "USD",
};

// Free shipping everywhere; delivery times in business days per region.
export const delivery = [
  { region: "United States", short: "USA", days: [8, 10], countries: ["US"] },
  { region: "Canada", short: "Canada", days: [7, 9], countries: ["CA"] },
  { region: "United Kingdom", short: "UK", days: [5, 8], countries: ["GB"] },
  {
    region: "Europe",
    short: "Europe",
    days: [7, 9],
    countries: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "IE", "PT", "SE", "DK", "FI", "PL", "CZ", "GR", "LU", "NO", "CH"],
  },
  { region: "Australia", short: "Australia", days: [7, 9], countries: ["AU"] },
  {
    region: "Asia",
    short: "Asia",
    days: [2, 4],
    countries: ["JP", "KR", "CN", "HK", "TW", "SG", "MY", "TH", "PH", "VN", "ID", "IN"],
  },
  {
    region: "Middle East",
    short: "Middle East",
    days: [7, 9],
    countries: ["AE", "SA", "QA", "KW", "BH", "OM", "JO", "LB"],
  },
] as const;

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
