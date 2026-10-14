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
  // `group` sorts the spec table into sections (Display, Battery...).
  specs: { label: string; value: string; group?: string }[];
  // Big numbers shown under the price (e.g. "170+" / "Sport modes").
  highlights?: { value: string; label: string }[];
  // Optional "What it does" list on the product page.
  features?: string[];
  // Optional list of sports shown on the product page.
  sports?: string[];
  // "Take a closer look" scroll story: short notes that appear around the watch.
  // `at` is the spot on the main photo (0 to 1 across and down) the camera
  // zooms to for this note; `zoom` is how close it gets.
  callouts?: { title: string; text: string; at?: [number, number]; zoom?: number }[];
  // Big counting numbers band (e.g. 170 + "+" / "Sport modes").
  bigStats?: { value: number; suffix?: string; label: string }[];
  // Apple-style feature chapters: short headline, one paragraph, optional picture.
  chapters?: { eyebrow: string; title: string; text: string; image?: string; imageAlt?: string }[];
  // Marketing pictures shown lower on the product page.
  posters?: { src: string; alt: string; width: number; height: number }[];
  // Questions and answers shown on the page and given to Google.
  faq?: { q: string; a: string }[];
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
    slug: "matin-trekon",
    name: "MATIN Trekon",
    tagline: "Rugged GPS smartwatch with 170+ sport modes",
    price: 120,
    category: "tactical",
    badge: "New",
    images: ["/products/matin-trekon-rugged-smartwatch.webp"],
    imageAlts: [
      'MATIN Trekon rugged GPS smartwatch in black with a 1.95" AMOLED tactical watch face and silicone strap',
    ],
    shareImage: "/products/matin-trekon-share.jpg",
    colors: [{ name: "Stealth Black", hex: "#1c1f26" }],
    description:
      'The MATIN Trekon is a rugged GPS smartwatch built for hard workdays, long trails and serious training. Built-in GPS tracks your route, distance and pace, a heart rate monitor keeps an eye on your effort, and more than 170 sport modes cover everything from running and cycling to hiking, climbing and basketball. A big 1.95" AMOLED touchscreen stays easy to read in bright sun, the armoured zinc alloy case takes the knocks, and the 1000mAh battery lasts up to 30 days on a charge. Rated 3ATM against rain, sweat and splashes, and works with both iPhone and Android.',
    highlights: [
      { value: "GPS", label: "Route tracking" },
      { value: "170+", label: "Sport modes" },
      { value: "30d", label: "Battery life" },
      { value: '1.95"', label: "AMOLED screen" },
    ],
    specs: [
      { group: "Display", label: "Screen", value: '1.95" AMOLED touchscreen' },
      { group: "Display", label: "Shape", value: "Rectangular" },
      { group: "Display", label: "Watch faces", value: "Multiple faces, changeable in the app" },
      { group: "Battery", label: "Capacity", value: "1000mAh" },
      { group: "Battery", label: "Battery life", value: "11 to 30 days, depending on use" },
      { group: "Battery", label: "Charging", value: "Magnetic charger" },
      { group: "GPS & sports", label: "GPS", value: "Built-in GPS route tracking" },
      { group: "GPS & sports", label: "Sport modes", value: "170+ (running, cycling, hiking, climbing and more)" },
      { group: "GPS & sports", label: "Outdoor tools", value: "Altitude meter, compass" },
      { group: "Health", label: "Heart rate", value: "Heart rate monitoring" },
      { group: "Health", label: "Tracking", value: "Steps, distance, calories, sleep" },
      { group: "Health", label: "Reminders", value: "Sedentary reminder" },
      { group: "Build", label: "Case", value: "Zinc alloy middle frame" },
      { group: "Build", label: "Strap", value: "Silicone sport strap" },
      { group: "Build", label: "Water resistance", value: "3ATM (rain, sweat and splashes)" },
      { group: "Build", label: "Buttons", value: "SEL, BACK, SPORT and GPS keys" },
      { group: "Smart features", label: "Phone app", value: "Works with iPhone and Android" },
      { group: "Smart features", label: "Notifications", value: "Calls, messages and app alerts" },
      { group: "Smart features", label: "Tools", value: "Alarm, calendar, calculator, world time" },
      { group: "Smart features", label: "Camera", value: "None" },
      { group: "In the box", label: "Includes", value: "MATIN Trekon watch, magnetic charging cable" },
    ],
    features: [
      "Built-in GPS",
      "170+ sport modes",
      "Altitude meter",
      "Compass",
      "Heart rate monitor",
      "Step and distance tracker",
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
    callouts: [
      { title: '1.95" AMOLED', text: "A big, bright screen you can read in full sun.", at: [0.33, 0.45], zoom: 1.55 },
      { title: "Built-in GPS", text: "Maps your route, distance and pace. No phone needed.", at: [0.22, 0.42], zoom: 2.1 },
      { title: "1000mAh battery", text: "Up to 30 days on one charge.", at: [0.335, 0.33], zoom: 2.3 },
      { title: "Heart rate", text: "Keeps an eye on your effort, day and night.", at: [0.43, 0.57], zoom: 2.3 },
      { title: "Zinc alloy case", text: "An armoured frame with four solid keys that takes the knocks.", at: [0.56, 0.45], zoom: 2 },
      { title: "3ATM", text: "Rain, sweat and splashes are no problem.", at: [0.66, 0.58], zoom: 1.45 },
    ],
    bigStats: [
      { value: 170, suffix: "+", label: "Sport modes" },
      { value: 30, label: "Days of battery" },
      { value: 1000, label: "mAh battery" },
      { value: 3, suffix: "ATM", label: "Water resistance" },
    ],
    chapters: [
      {
        eyebrow: "GPS",
        title: "Find your way. Anywhere.",
        text: "Built-in GPS maps your route, distance and time on every run, ride and hike. Head out further and always know how far you have come.",
        image: "/products/matin-trekon-gps-rugged-smartwatch-outdoors.webp",
        imageAlt:
          "MATIN Trekon rugged GPS smartwatch on a mountain rock showing route tracking, 1000mAh battery and rugged build",
      },
      {
        eyebrow: "170+ sport modes",
        title: "Every sport. Covered.",
        text: "Running, cycling, hiking, climbing, tennis, basketball, yoga and more than 160 others. Pick your sport and the Trekon tracks heart rate, calories and time.",
        image: "/products/matin-trekon-170-sport-modes.webp",
        imageAlt:
          "MATIN Trekon GPS sports watch with 170+ sport modes for hiking, running, cycling, climbing, tennis, basketball and yoga",
      },
    ],
    sports: ["Running", "Cycling", "Hiking", "Climbing", "Tennis", "Basketball", "Yoga", "And 160+ more"],
    posters: [
      {
        src: "/products/matin-trekon-gps-rugged-smartwatch-outdoors.webp",
        alt: "MATIN Trekon rugged GPS smartwatch on a mountain rock showing route tracking, 1000mAh battery and rugged build",
        width: 1121,
        height: 1403,
      },
      {
        src: "/products/matin-trekon-170-sport-modes.webp",
        alt: "MATIN Trekon GPS sports watch with 170+ sport modes for hiking, running, cycling, climbing, tennis, basketball and yoga",
        width: 1200,
        height: 1693,
      },
    ],
    faq: [
      {
        q: "Does the MATIN Trekon have GPS?",
        a: "Yes. It has built-in GPS that tracks your route, distance and time for runs, rides and hikes.",
      },
      {
        q: "How long does the battery last?",
        a: "The 1000mAh battery lasts 11 to 30 days on one charge, depending on how much you use GPS and notifications. It charges with a magnetic cable.",
      },
      {
        q: "How many sport modes does it have?",
        a: "More than 170, including running, cycling, hiking, climbing, tennis, basketball and yoga.",
      },
      {
        q: "Does it work with iPhone and Android?",
        a: "Yes. The MATIN Trekon pairs with both iPhone and Android phones through its companion app for notifications, settings and watch faces.",
      },
      {
        q: "Is the MATIN Trekon waterproof?",
        a: "It is rated 3ATM, so rain, sweat and splashes are fine. It is not made for swimming or diving.",
      },
      {
        q: "What is the screen like?",
        a: 'A big 1.95 inch AMOLED touchscreen with bright, sharp colours that stays readable outdoors.',
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free worldwide, and you get a 2 year warranty and 30 day returns.",
      },
    ],
    seoTitle: "MATIN Trekon Rugged GPS Smartwatch | 170+ Sport Modes",
    seoDescription:
      'MATIN Trekon rugged GPS smartwatch for men: built-in GPS, 170+ sport modes, 1.95" AMOLED screen, 1000mAh battery up to 30 days, zinc alloy case, 3ATM. Free shipping.',
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
