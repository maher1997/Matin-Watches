// All store products live here. To add a real product:
// 1. Put its photos in /public/products/ (e.g. /public/products/titan-x-1.jpg)
// 2. Copy one of the entries below and change the text, price and `images`.
// A product with no `images` shows a drawn placeholder watch instead.

export type Category = "tactical" | "outdoor" | "dive";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  category: Category;
  badge?: string;
  images: string[];
  // Text read by Google and screen readers for each photo (same order as images).
  imageAlts?: string[];
  // 1200x630 picture shown when the page link is shared (WhatsApp, Facebook, X).
  shareImage?: string;
  colors: { name: string; hex: string }[];
  description: string;
  specs: { label: string; value: string }[];
  // Optional "What it does" list on the product page.
  features?: string[];
  // Optional search-result title and description (Google shows these).
  seoTitle?: string;
  seoDescription?: string;
  // Placeholder drawing colors, used only while `images` is empty.
  art: { case: string; strap: string; accent: string };
};

export const categories: { id: Category; name: string; blurb: string }[] = [
  { id: "tactical", name: "Tactical", blurb: "Built to military standard" },
  { id: "outdoor", name: "Outdoor", blurb: "GPS, maps and long battery" },
  { id: "dive", name: "Dive", blurb: "Water rated to 100m" },
];

export const products: Product[] = [
  {
    slug: "matin-sentinel",
    // PLACEHOLDER name and price: change them here when they are decided.
    name: "MATIN Sentinel",
    tagline: 'Rugged smartwatch with a 1.95" AMOLED screen',
    price: 89,
    category: "tactical",
    badge: "New",
    images: ["/products/matin-sentinel-rugged-smartwatch.webp"],
    imageAlts: [
      'MATIN Sentinel rugged smartwatch in black with a 1.95" AMOLED tactical watch face and silicone strap',
    ],
    shareImage: "/products/matin-sentinel-share.jpg",
    colors: [{ name: "Stealth Black", hex: "#1c1f26" }],
    description:
      'A tough, square smartwatch made for work, training and the outdoors. The armoured zinc alloy case protects a big, bright 1.95" AMOLED touchscreen, and one charge lasts 11 to 30 days. Track steps, calories, sleep and altitude, check the compass, and get call and message alerts from your phone, all on a watch that is rated 3ATM against rain, sweat and splashes.',
    specs: [
      { label: "Display", value: '1.95" AMOLED touchscreen' },
      { label: "Battery", value: "11 to 30 days" },
      { label: "Water", value: "3ATM water resistant" },
      { label: "Case", value: "Zinc alloy, rectangular" },
      { label: "Strap", value: "Silicone" },
      { label: "Charging", value: "Magnetic charger" },
      { label: "Phone app", value: "App control for Android phones" },
      { label: "Camera", value: "None" },
    ],
    features: [
      "Altitude meter",
      "Compass",
      "Fitness and step tracker",
      "Calorie tracker",
      "Sleep tracker",
      "Call reminders",
      "Message and app notifications",
      "Sedentary reminder",
      "Alarm clock",
      "Calendar",
      "Calculator",
      "World time",
    ],
    seoTitle: 'MATIN Sentinel Rugged Smartwatch | 1.95" AMOLED, 30-Day Battery',
    seoDescription:
      'MATIN Sentinel rugged smartwatch for men: 1.95" AMOLED touchscreen, zinc alloy case, up to 30 days battery, 3ATM water resistance, compass, altitude and fitness tracking.',
    art: { case: "#2a2e38", strap: "#16181e", accent: "#e0b45a" },
  },
  {
    slug: "matin-titan-x",
    name: "MATIN Titan X",
    tagline: "Flagship military smartwatch",
    price: 349,
    compareAt: 399,
    category: "tactical",
    badge: "Best seller",
    images: [],
    colors: [
      { name: "Stealth Black", hex: "#1c1f26" },
      { name: "Ranger Green", hex: "#4b5a3a" },
    ],
    description:
      "Our toughest watch. A titanium case, sapphire glass and MIL-STD-810H testing mean it keeps going wherever you do.",
    specs: [
      { label: "Durability", value: "MIL-STD-810H tested" },
      { label: "Water", value: "100m / 10 ATM" },
      { label: "Battery", value: "Up to 30 days" },
      { label: "Display", value: '1.43" AMOLED, sapphire' },
      { label: "Case", value: "Titanium, 48mm" },
      { label: "GPS", value: "Dual-band GPS" },
    ],
    art: { case: "#2a2e38", strap: "#16181e", accent: "#5285f7" },
  },
  {
    slug: "matin-commander",
    name: "MATIN Commander",
    tagline: "Tactical mode, night vision display",
    price: 279,
    category: "tactical",
    badge: "New",
    images: [],
    colors: [
      { name: "Desert Tan", hex: "#a08a64" },
      { name: "Stealth Black", hex: "#1c1f26" },
    ],
    description:
      "Built for long missions. Night vision red display, compass, altimeter and a stealth mode that turns off all signals.",
    specs: [
      { label: "Durability", value: "MIL-STD-810H tested" },
      { label: "Water", value: "50m / 5 ATM" },
      { label: "Battery", value: "Up to 21 days" },
      { label: "Display", value: '1.39" AMOLED' },
      { label: "Case", value: "Reinforced polymer, 47mm" },
      { label: "Sensors", value: "Compass, altimeter, barometer" },
    ],
    art: { case: "#6e624c", strap: "#4d4535", accent: "#e0b45a" },
  },
  {
    slug: "matin-trail-pro",
    name: "MATIN Trail Pro",
    tagline: "Offline maps for the wild",
    price: 299,
    category: "outdoor",
    images: [],
    colors: [
      { name: "Ranger Green", hex: "#4b5a3a" },
      { name: "Storm Grey", hex: "#5a5f6b" },
    ],
    description:
      "Offline maps, route back and a 40 day battery. Made for hikers, hunters and anyone off the grid.",
    specs: [
      { label: "Durability", value: "MIL-STD-810H tested" },
      { label: "Water", value: "50m / 5 ATM" },
      { label: "Battery", value: "Up to 40 days" },
      { label: "Display", value: '1.45" AMOLED' },
      { label: "Case", value: "Stainless steel, 47mm" },
      { label: "Maps", value: "Offline topo maps" },
    ],
    art: { case: "#3d4733", strap: "#2c3324", accent: "#7fd36a" },
  },
  {
    slug: "matin-ridge",
    name: "MATIN Ridge",
    tagline: "Light, tough, everyday",
    price: 189,
    compareAt: 219,
    category: "outdoor",
    images: [],
    colors: [
      { name: "Storm Grey", hex: "#5a5f6b" },
      { name: "Blaze Orange", hex: "#d4682c" },
    ],
    description:
      "All the toughness in a lighter, smaller body. Heart rate, sleep, 100+ sport modes and two weeks of battery.",
    specs: [
      { label: "Durability", value: "IP68 + drop tested" },
      { label: "Water", value: "50m / 5 ATM" },
      { label: "Battery", value: "Up to 14 days" },
      { label: "Display", value: '1.32" AMOLED' },
      { label: "Case", value: "Fibre polymer, 44mm" },
      { label: "Sports", value: "100+ modes" },
    ],
    art: { case: "#4a4e58", strap: "#d4682c", accent: "#ff8a3d" },
  },
  {
    slug: "matin-abyss",
    name: "MATIN Abyss",
    tagline: "Dive computer on your wrist",
    price: 399,
    category: "dive",
    badge: "Limited",
    images: [],
    colors: [
      { name: "Deep Blue", hex: "#1f3a6b" },
      { name: "Stealth Black", hex: "#1c1f26" },
    ],
    description:
      "Depth, dive time and decompression on a bright display you can read underwater. Ceramic bezel, 100m rated.",
    specs: [
      { label: "Durability", value: "MIL-STD-810H tested" },
      { label: "Water", value: "100m / EN13319" },
      { label: "Battery", value: "Up to 25 days" },
      { label: "Display", value: '1.43" AMOLED, sapphire' },
      { label: "Case", value: "Titanium, ceramic bezel" },
      { label: "Dive", value: "Depth, deco, dive log" },
    ],
    art: { case: "#1f3a6b", strap: "#121c33", accent: "#5fd6d0" },
  },
  {
    slug: "matin-reef",
    name: "MATIN Reef",
    tagline: "Swim, surf and snorkel",
    price: 229,
    category: "dive",
    images: [],
    colors: [
      { name: "Reef Teal", hex: "#1f6b6b" },
      { name: "Storm Grey", hex: "#5a5f6b" },
    ],
    description:
      "Made for water sports. Swim tracking, tide times and a strong strap that stays put in the waves.",
    specs: [
      { label: "Durability", value: "IP68 + drop tested" },
      { label: "Water", value: "100m / 10 ATM" },
      { label: "Battery", value: "Up to 18 days" },
      { label: "Display", value: '1.39" AMOLED' },
      { label: "Case", value: "Stainless steel, 45mm" },
      { label: "Water sports", value: "Swim, surf, tides" },
    ],
    art: { case: "#1f5a5a", strap: "#143c3c", accent: "#5fd6d0" },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}
