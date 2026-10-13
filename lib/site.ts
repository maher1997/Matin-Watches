// One place for the site's public address. When the real domain is ready,
// set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://matinwatches.com) and
// every canonical link, the sitemap and the Google product data switch over.
const fallback = "https://matin-watches.vercel.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/+$/, "");

export const site = {
  name: "MATIN",
  title: "MATIN | Rugged Smartwatches",
  description:
    "MATIN makes rugged smartwatches built for hard places: tough cases, bright AMOLED screens and weeks of battery. Free worldwide shipping.",
  currency: "USD",
};

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
