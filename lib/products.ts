// All store products live here. To add a real product:
// 1. Put its photos in /public/products/ (e.g. /public/products/matin-<name>-front-view.webp)
// 2. Copy one of the entries below and change the text, price and `images`.
// A product with no `images` shows a drawn placeholder watch instead.

export type Category = "tactical" | "outdoor";

export type StoryIcon =
  | "shield"
  | "drop"
  | "dust"
  | "mountain"
  | "thermo"
  | "heart"
  | "chart"
  | "run"
  | "pin"
  | "route"
  | "battery"
  | "bolt"
  | "magnet";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  category: Category;
  // Collections this watch shows up in (see `collections` below).
  collections?: CollectionId[];
  badge?: string;
  images: string[];
  // Text read by Google and screen readers for each photo (same order as images).
  imageAlts?: string[];
  // 1200x630 picture shown when the page link is shared (WhatsApp, Facebook, X).
  shareImage?: string;
  // `from`: index in `images` where this color's photos start (they run to
  // the next color's `from`). Picking the color shows only its photos.
  colors: { name: string; hex: string; from?: number }[];
  description: string;
  // `group` sorts the spec table into sections (Display, Battery...).
  specs: { label: string; value: string; group?: string }[];
  // Big numbers shown under the price (e.g. "170+" / "Sport modes").
  highlights?: { value: string; label: string }[];
  // Optional "What it does" list on the product page.
  features?: string[];
  // Optional list of sports shown on the product page.
  sports?: string[];
  // Animated sport modes section: the headline count and the ids (from
  // components/sports/library.tsx) of the sports this watch really tracks.
  sportModes?: { count: string; ids: string[] };
  // Animated health section drawn on the watch's own screen (the battery
  // section's photo and screen). List only what the watch really measures;
  // "continuous" claims 24/7 per-minute heart rate (Torvan only).
  health?: { metrics: ("hr" | "rest" | "spo2" | "sleep" | "activity")[]; continuous?: boolean };
  // Animated GPS section drawn on the watch's own screen, only for watches
  // with built-in GPS. screens: route map, satellite systems, compass,
  // altitude. systems lists the satellite systems the listing names.
  gps?: { screens: ("route" | "sats" | "compass" | "alt")[]; systems?: string[]; barometric?: boolean };
  // Animated sport section that is not drawn on the watch: "multi" (each
  // sport in its own animated place, Kaldor) or "tri" (triathlon swim, bike, run, Varkon).
  // count is the number of sport modes the listing gives.
  fitness?: { look: "multi" | "tri"; count: string };
  // Liquid battery drawn on the watch's own screen: a round screen (circle in
  // % of the photo) or a shaped one (box in % plus a CSS polygon for its
  // outline). look "cells" is stacked green battery cells, "radar" a green radar ring, "rings" green rings. Longest mode last.
  batteryLiquid?: {
    mah: number;
    image: string;
    imageAlt: string;
    screen:
      | { cx: number; cy: number; r: number }
      | { x: number; y: number; w: number; h: number; clip: string };
    look?: "wave" | "cells" | "radar" | "rings";
    intro?: string;
    modes: { label: string; days: number; text: string }[];
    facts: { value: string; label: string }[];
  };
  // "What it does", sorted into a few groups (icon: outdoor | health | smart | tools).
  featureGroups?: { title: string; icon: "outdoor" | "health" | "smart" | "tools"; items: string[] }[];
  // "Turn it around" scroll section: each step shows one photo (index into
  // `images`) with a short headline. Order them like a turn: front, angle, side, back.
  // Big lifestyle panels: a photo with the headline and icon points written
  // as real text over it (so Google can read it and it stays sharp).
  stories?: {
    image: string;
    alt: string;
    // Where the original sits in a photo extended on one side only
    // (CSS object-position), so the square desktop crop shows all of it.
    focus?: string;
    // Short name on the slider button
    tab: string;
    title: [string, string];
    accent?: "blue" | "gold";
    text: string;
    tags?: string[];
    points: { icon: StoryIcon; title: string; text: string }[];
  }[];
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

// A watch's main label (shown above its name).
export const categories: { id: Category; name: string; blurb: string }[] = [
  { id: "tactical", name: "Tactical", blurb: "Military-style and built tough" },
  { id: "outdoor", name: "Outdoor", blurb: "For trails, camping and long days outside" },
];

// Collections a shopper can browse. One watch can be in several, so each
// collection gets its own page (/collections/<id>) that Google can rank.
export type CollectionId = "tactical" | "outdoor" | "gps" | "calling" | "long-battery";

export const collections: {
  id: CollectionId;
  name: string;
  blurb: string;
  title: string;
  heading: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
}[] = [
  {
    id: "tactical",
    name: "Tactical",
    blurb: "Military-style and built tough",
    title: "Tactical",
    heading: "Tactical smartwatches",
    intro:
      "Military-style smartwatches with armored metal cases, bright AMOLED screens and weeks of battery. Made for work sites, training and hard days outside.",
    seoTitle: "Tactical Smartwatches for Men | Rugged & Military-Style",
    seoDescription:
      "Rugged tactical smartwatches for men: military-style metal cases, AMOLED screens, GPS or Bluetooth calling and up to 30 days battery. Free worldwide shipping.",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    blurb: "For trails, camping and long days outside",
    title: "Outdoor",
    heading: "Outdoor smartwatches",
    intro:
      "Tough smartwatches for hiking, camping and long days outside, with screens you can read in the sun and batteries that last for weeks.",
    seoTitle: "Rugged Outdoor Smartwatches for Hiking & Camping",
    seoDescription:
      "Rugged outdoor smartwatches for men: GPS, compass, flashlight, bright AMOLED screens and up to 30 days battery for hiking and camping. Free worldwide shipping.",
  },
  {
    id: "gps",
    name: "GPS",
    blurb: "Track your route, distance and pace",
    title: "GPS",
    heading: "GPS smartwatches",
    intro:
      "Rugged smartwatches with built-in GPS, so you can track your route, distance and pace without carrying your phone.",
    seoTitle: "Rugged GPS Smartwatches for Men | Built-In GPS",
    seoDescription:
      "Rugged GPS smartwatches for men with built-in GPS route tracking, sport modes, AMOLED screens and up to 30 days battery. Free worldwide shipping.",
  },
  {
    id: "calling",
    name: "Bluetooth calling",
    blurb: "Answer and make calls from your wrist",
    title: "Calling",
    heading: "Bluetooth calling smartwatches",
    intro:
      "Rugged smartwatches with a built-in speaker and microphone, so you can answer and make calls from your wrist while your phone stays in your pocket.",
    seoTitle: "Rugged Bluetooth Calling Smartwatches for Men",
    seoDescription:
      "Rugged smartwatches with Bluetooth calling: answer and make calls from your wrist, AMOLED screens, heart rate and up to 30 days battery. Free worldwide shipping.",
  },
  {
    id: "long-battery",
    name: "Long battery",
    blurb: "Up to 30 days on one charge",
    title: "Long battery",
    heading: "Rugged smartwatches with long battery life",
    intro:
      "Every watch here lasts up to 30 days on one charge with light use or power saving, so you charge it a few times a month instead of every night.",
    seoTitle: "Rugged Smartwatches with Long Battery Life (30 Days)",
    seoDescription:
      "Rugged smartwatches with long battery life: up to 30 days on one charge, tough metal cases, AMOLED screens and GPS or calling. Free worldwide shipping.",
  },
];

// Which collections a watch is in. Real watches list theirs; the
// placeholders just use their main label.
export function collectionsOf(p: Product): string[] {
  return p.collections ?? [p.category];
}

export function productsIn(id: string) {
  return products.filter((p) => collectionsOf(p).includes(id));
}

export const products: Product[] = [
  {
    slug: "matin-trekon",
    name: "MATIN Trekon",
    tagline: "Rugged GPS smartwatch with 170+ sport modes",
    price: 120,
    category: "tactical",
    collections: ["tactical", "outdoor", "gps", "long-battery"],
    badge: "New",
    images: [
      "/products/matin-trekon-black-rugged-smartwatch.webp",
      "/products/matin-trekon-black-front-view.webp",
      "/products/matin-trekon-black-angle-view.webp",
      "/products/matin-trekon-black-side-buttons.webp",
      "/products/matin-trekon-black-heart-rate-sensor-back.webp",
      "/products/matin-trekon-orange-rugged-smartwatch.webp",
      "/products/matin-trekon-orange-angle.webp",
      "/products/matin-trekon-orange-front-view.webp",
      "/products/matin-trekon-orange-side-view.webp",
      "/products/matin-trekon-orange-heart-rate-sensor-back.webp",
      "/products/matin-trekon-green-rugged-smartwatch.webp",
      "/products/matin-trekon-green-angle.webp",
      "/products/matin-trekon-green-front-view.webp",
      "/products/matin-trekon-green-side-buttons.webp",
      "/products/matin-trekon-green-heart-rate-sensor-back.webp",
    ],
    imageAlts: [
      'MATIN Trekon rugged GPS smartwatch in black with a 1.95" AMOLED tactical watch face and silicone strap',
      "MATIN Trekon rugged smartwatch front view with octagonal armored case and black silicone strap",
      "MATIN Trekon black rugged smartwatch angled view with the AMOLED watch face, side buttons and black strap",
      "MATIN Trekon side view showing the SEL and BACK buttons and textured grip keys",
      "Back of the MATIN Trekon with heart rate sensor and magnetic charging pins",
      "MATIN Trekon rugged GPS smartwatch in orange with a bright orange silicone strap and AMOLED tactical watch face",
      "MATIN Trekon orange tactical smartwatch angled view with armored case and orange sport strap",
      "MATIN Trekon orange rugged smartwatch front view showing the 1.95 inch AMOLED screen",
      "MATIN Trekon orange smartwatch side view with textured buttons and orange strap",
      "Back of the orange MATIN Trekon with heart rate sensor, magnetic charging pins and metal buckle",
      "MATIN Trekon rugged GPS smartwatch in army green with a green silicone strap and AMOLED tactical watch face",
      "MATIN Trekon army green tactical smartwatch angled view with armored case and green sport strap",
      "MATIN Trekon army green rugged smartwatch front view showing the 1.95 inch AMOLED screen",
      "MATIN Trekon army green smartwatch side view with textured buttons and green strap",
      "Back of the army green MATIN Trekon with heart rate sensor, magnetic charging pins and metal buckle",
    ],
    shareImage: "/products/matin-trekon-share.jpg",
    colors: [
      { name: "Stealth Black", hex: "#1c1f26" },
      { name: "Orange", hex: "#f2731d", from: 5 },
      { name: "Army Green", hex: "#6b8a3e", from: 10 },
    ],
    description:
      'The MATIN Trekon is a rugged tactical GPS smartwatch for men, built for hard workdays, long trails and serious training. Built-in GPS tracks your route, distance and pace, a heart rate monitor keeps an eye on your effort, and more than 170 sport modes cover everything from running and cycling to hiking, climbing and basketball. A big 1.95" AMOLED touchscreen stays easy to read in bright sun, the armored zinc alloy case takes the knocks, and the 1000mAh battery lasts up to 30 days on a charge. Rated 3ATM against rain, sweat and splashes, and works with both iPhone and Android.',
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
      { group: "In the box", label: "Package", value: "4.3 x 4.3 x 2.8 in (11 x 11 x 7 cm), 0.44 lb (0.2 kg) shipping weight" },
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
    featureGroups: [
      { title: "Outdoor & GPS", icon: "outdoor", items: ["Built-in GPS", "170+ sport modes", "Altitude meter", "Compass"] },
      { title: "Health", icon: "health", items: ["Heart rate monitor", "Step and distance tracker", "Calorie tracker", "Sleep tracker"] },
      { title: "Stay connected", icon: "smart", items: ["Call reminders", "Message and app notifications", "Sedentary reminder"] },
      { title: "Everyday tools", icon: "tools", items: ["Alarm clock", "Calendar", "Calculator", "World time"] },
    ],
    stories: [
      {
        image: "/products/life/matin-trekon-tough-mission.webp",
        focus: "100% 50%",
        tab: "Tough",
        alt: "MATIN Trekon rugged smartwatch on a gloved soldier's wrist in the mountains, with climbing, trekking and river scenes",
        title: ["Built for", "the tough"],
        text: "For work. For mission. For more.",
        tags: ["For work", "For mission", "For more"],
        points: [
          { icon: "shield", title: "Shock resistant", text: "Handles rough use in tough conditions" },
          { icon: "drop", title: "Water resistant", text: "Ready for rain, dust and more" },
          { icon: "mountain", title: "Built for extremes", text: "Reliable performance in any environment" },
          { icon: "thermo", title: "Wide temp range", text: "-4°F to 140°F" },
        ],
      },
      {
        image: "/products/life/matin-trekon-construction-work.webp",
        tab: "Construction",
        alt: "Construction worker in gloves and a hi-vis vest wearing the MATIN Trekon rugged smartwatch on a snowy building site",
        title: ["Built for", "the job site"],
        text: "Snow, dust and hard knocks. The Trekon is a rugged smartwatch made for construction work, and it keeps going shift after shift.",
        points: [
          { icon: "shield", title: "Shock resistant", text: "Takes knocks from tools, rebar and concrete" },
          { icon: "dust", title: "Dust and dirt", text: "Keeps working on dusty, muddy sites" },
          { icon: "thermo", title: "Cold and heat", text: "Works from -4°F to 140°F" },
          { icon: "battery", title: "Lasts the work week", text: "Up to 20 days with typical use" },
        ],
      },
      {
        image: "/products/life/matin-trekon-outdoors-route.webp",
        tab: "Outdoors",
        alt: "Hiker at sunrise checking his route, altitude and heart rate on the MATIN Trekon smartwatch above a mountain lake",
        title: ["Built", "tough"],
        text: "Designed for real adventures, ready for any environment.",
        points: [
          { icon: "shield", title: "Shock resistant", text: "Built to handle rough conditions" },
          { icon: "drop", title: "Water resistant", text: "Withstands rain, splash and more" },
          { icon: "dust", title: "Dust resistant", text: "Keeps performing in tough environments" },
          { icon: "thermo", title: "Wide temperature range", text: "Works from -4°F to 140°F" },
        ],
      },
      {
        image: "/products/life/matin-trekon-heart-rate-graph.webp",
        tab: "Heart rate",
        alt: "Hiker checking his heart rate graph on the MATIN Trekon smartwatch above a mountain lake",
        title: ["Heart rate", "monitoring"],
        text: "Track your heart rate in real time and stay in control of your health every day.",
        points: [
          { icon: "heart", title: "Real-time heart rate", text: "24/7 continuous monitoring" },
          { icon: "chart", title: "Heart rate trends", text: "View your daily, weekly and monthly data" },
          { icon: "run", title: "Stay active and healthy", text: "Get insights to improve your fitness" },
        ],
      },
      {
        image: "/products/life/matin-trekon-heart-rate-running.webp",
        tab: "Workout",
        alt: "Trail runner in the mountains with the MATIN Trekon smartwatch showing workout time, heart rate, distance and calories",
        title: ["Every workout", "tracked"],
        text: "Start a run and see your time, heart rate, distance and calories live on your wrist.",
        points: [
          { icon: "run", title: "170+ sport modes", text: "Running, hiking, cycling and more" },
          { icon: "heart", title: "Live heart rate", text: "See your effort as you move" },
          { icon: "route", title: "Distance and calories", text: "Every kilometre and calorie counted" },
        ],
      },
      {
        image: "/products/life/matin-trekon-built-in-gps.webp",
        tab: "GPS",
        alt: "MATIN Trekon smartwatch showing a GPS route map, distance and pace on a mountain rock",
        title: ["Built-in", "GPS"],
        text: "Track your route, distance and pace with high-precision GPS.",
        points: [
          { icon: "pin", title: "Accurate GPS tracking", text: "Find your way anywhere" },
          { icon: "route", title: "Real-time route map", text: "Track distance, time and pace" },
          { icon: "mountain", title: "Made for the outdoors", text: "Hiking, running, cycling and more" },
        ],
      },
      {
        image: "/products/life/matin-trekon-1000mah-battery.webp",
        tab: "Battery",
        alt: "MATIN Trekon smartwatch with its 1000mAh large battery at 100%",
        title: ["1000mAh", "large battery"],
        text: "Go further with long-lasting power for all your adventures.",
        points: [
          { icon: "battery", title: "20 days in use", text: "Up to 20 days with typical use" },
          { icon: "bolt", title: "50 days standby", text: "Up to 50 days on standby" },
          { icon: "magnet", title: "Magnetic charging", text: "The charger snaps on in a second" },
        ],
      },
    ],
    gps: { screens: ["route", "compass", "alt"] },
    health: { metrics: ["hr", "sleep", "activity"] },
    batteryLiquid: {
      mah: 1000,
      image: "/products/matin-trekon-black-front-view.webp",
      imageAlt:
        "MATIN Trekon front view with its AMOLED screen showing the battery level",
      screen: {
        x: 27.65,
        y: 23.7,
        w: 44.2,
        h: 50.8,
        clip: "polygon(12.1% 0, 86.8% 0, 100% 17.5%, 100% 80.5%, 86.5% 100%, 12.1% 100%, 0 80.7%, 0 17.7%)",
      },
      look: "cells",
      intro:
        "The MATIN Trekon packs a 1000mAh battery: up to 20 days of everyday wear, and up to 30 days with light use.",
      modes: [
        {
          label: "Heavy use",
          days: 11,
          text: "GPS workouts, lots of notifications and the screen always bright.",
        },
        {
          label: "Typical use",
          days: 20,
          text: "Everyday wear with heart rate tracking and notifications.",
        },
        {
          label: "Light use",
          days: 30,
          text: "Time, steps and a few notifications a day.",
        },
      ],
      facts: [
        { value: "1000 mAh", label: "Battery" },
        { value: "50 days", label: "Standby" },
        { value: "Magnetic", label: "Charger" },
      ],
    },
    bigStats: [
      { value: 170, suffix: "+", label: "Sport modes" },
      { value: 30, label: "Days of battery" },
      { value: 1000, label: "mAh battery" },
      { value: 3, suffix: "ATM", label: "Water resistance" },
    ],
    chapters: [
      {
        eyebrow: "Sport & fitness",
        title: "Every sport. Covered.",
        text: "Running, cycling, hiking, gym, basketball and more: over 170 sport modes in all. Pick your workout and the Trekon tracks heart rate, calories, distance and time.",
        image: "/products/matin-trekon-workout-menu-hiking.webp",
        imageAlt:
          "MATIN Trekon rugged smartwatch on a hiker's wrist showing its workout menu with outdoor run, cycling, hiking and indoor run, above a mountain lake",
      },
      {
        eyebrow: "Waterproof",
        title: "Rain or river. Keep going.",
        text: "Rain, splashes, sweat and stream crossings don't slow it down. Wear it on every trail and never stop to take it off.",
        image: "/products/matin-trekon-waterproof-river-splash.webp",
        imageAlt:
          "Waterproof MATIN Trekon rugged smartwatch covered in water drops on a hiker's wrist in a splashing mountain river",
      },
    ],
    sports: [
      "Running",
      "Cycling",
      "Hiking",
      "Climbing",
      "Tennis",
      "Basketball",
      "Yoga",
      "Walking",
      "Football",
      "Badminton",
      "Rowing",
      "Jump rope",
      "Strength training",
      "Dance",
      "Table tennis",
      "Volleyball",
    ],
    posters: [
      {
        src: "/products/matin-trekon-workout-menu-hiking.webp",
        alt: "MATIN Trekon rugged smartwatch on a hiker's wrist showing its workout menu with outdoor run, cycling, hiking and indoor run, above a mountain lake",
        width: 1408,
        height: 1117,
      },
      {
        src: "/products/matin-trekon-waterproof-river-splash.webp",
        alt: "Waterproof MATIN Trekon rugged smartwatch covered in water drops on a hiker's wrist in a splashing mountain river",
        width: 2000,
        height: 2000,
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
        q: "Is the MATIN Trekon good for construction work?",
        a: "Yes. The armored zinc alloy case takes the knocks of a workday, the big 1.95\" screen is easy to read with dirty hands or in bright sun, and the battery lasts up to 30 days, so it gets through long shifts. It is rated 3ATM, so rain, sweat and splashes are fine, but it is not sealed against high-pressure water, and it has no flashlight. For very dusty or wet sites, the MATIN Torvan is the tougher pick.",
      },
      {
        q: "Is the MATIN Trekon waterproof?",
        a: "It is rated 3ATM, so rain, sweat and splashes are fine. It is splash-proof, not made for swimming or diving.",
      },
      {
        q: "What is the screen like?",
        a: 'A big 1.95 inch AMOLED touchscreen with bright, sharp colors that stays readable outdoors.',
      },
      {
        q: "Is the MATIN Trekon certified for the USA?",
        a: "Yes. It has passed FCC, CE and RoHS certification, and its Bluetooth is BQB qualified, so it meets US and EU requirements for electronics.",
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free worldwide, and you get a 1 year warranty and 30 day returns. Delivery takes about 8 to 10 business days to the USA, 7 to 9 to Canada, 5 to 8 to the UK, 7 to 9 to Europe, Australia and the Middle East, and 2 to 4 within Asia.",
      },
    ],
    seoTitle: "MATIN Trekon Tactical GPS Smartwatch for Men | Rugged",
    seoDescription:
      'MATIN Trekon rugged tactical GPS smartwatch for men: 170+ sport modes, 1.95" AMOLED, heart rate, 30 day battery, zinc alloy case. iPhone and Android.',
    art: { case: "#2a2e38", strap: "#16181e", accent: "#e0b45a" },
  },
  {
    slug: "matin-torvan",
    name: "MATIN Torvan",
    tagline: "Round rugged smartwatch with sapphire glass and Bluetooth calls",
    price: 140,
    shareImage: "/products/matin-torvan-share.jpg",
    category: "tactical",
    collections: ["tactical", "outdoor", "calling", "long-battery"],
    badge: "New",
    images: [
      "/products/matin-torvan-rugged-smartwatch-angle.webp",
      "/products/matin-torvan-rugged-smartwatch.webp",
      "/products/matin-torvan-front-view.webp",
      "/products/matin-torvan-side-buttons.webp",
      "/products/matin-torvan-heart-rate-sensor-back.webp",
    ],
    imageAlts: [
      "MATIN Torvan round rugged smartwatch with blue side button, textured grip keys and black silicone strap",
      'MATIN Torvan round rugged smartwatch in black with a blue side plate, 1.43" AMOLED display and silicone strap',
      "MATIN Torvan front view with round AMOLED display showing steps, heart rate, battery, weather and date",
      "MATIN Torvan side view with two buttons and a blue stainless steel side plate",
      "Back of the MATIN Torvan with heart rate sensor and magnetic charging pins",
    ],
    colors: [{ name: "Stealth Black", hex: "#1c1f26" }],
    description:
      'The MATIN Torvan is a round, military-style rugged smartwatch with a 316L stainless steel case, sapphire glass and a bold blue side plate. The 1.43" AMOLED display (466x466) reaches 1000 nits, so it stays sharp and easy to read in the sun, and you can take calls right from your wrist over Bluetooth. A built-in LED flashlight lights the way at night. It tracks heart rate around the clock, blood oxygen, sleep and calories, and the 550mAh battery lasts about 14 days with typical use and up to 30 days in power-saving mode. Rated 5ATM and IP69K and tested to MIL-STD-810H for heat, cold, salt spray, humidity and shock, it is a tough outdoor smartwatch that works with both iPhone and Android.',
    highlights: [
      { value: '1.43"', label: "AMOLED screen" },
      { value: "14d", label: "Typical battery" },
      { value: "IP69K", label: "& 5ATM" },
      { value: "Calls", label: "From your wrist" },
    ],
    specs: [
      { group: "Display", label: "Screen", value: '1.43" AMOLED, ultra HD' },
      { group: "Display", label: "Resolution", value: "466 x 466 pixels, 391 PPI" },
      { group: "Display", label: "Brightness", value: "Up to 1000 nits" },
      { group: "Display", label: "Screen-to-body", value: "76%" },
      { group: "Display", label: "Always-on", value: "Always-on display mode" },
      { group: "Display", label: "Watch faces", value: "300+ watch faces to download, or use your own photo" },
      { group: "Display", label: "Glass", value: "Sapphire glass" },
      { group: "Display", label: "Shape", value: "Round" },
      { group: "Battery", label: "Capacity", value: "550mAh" },
      { group: "Battery", label: "Battery life", value: "About 14 days typical, 6 days heavy use, up to 30 days power saving" },
      { group: "Battery", label: "Talk time", value: "Up to 573 minutes" },
      { group: "Battery", label: "Charging", value: "Magnetic charger, about 1.5 hours" },
      { group: "Health", label: "Heart rate", value: "Continuous, every minute, plus daily resting heart rate" },
      { group: "Health", label: "Blood oxygen", value: "SpO2 measurement" },
      { group: "Health", label: "More", value: "Blood pressure, breathing training, women's health" },
      { group: "Health", label: "Sleep", value: "Sleep score and analysis" },
      { group: "Sports", label: "Sport modes", value: "Walking, running, hiking, cycling, basketball, soccer, badminton, yoga, jump rope" },
      { group: "Sports", label: "Activity", value: "Steps, standing time, calories, real-time pace and distance, automatic goals" },
      { group: "Sports", label: "Sensors", value: "3-axis accelerometer and 3-axis gyroscope" },
      { group: "Build", label: "Flashlight", value: "Built-in LED flashlight" },
      { group: "Build", label: "Case", value: "316L stainless steel unibody" },
      { group: "Build", label: "Water and dust", value: "5ATM and IP69K" },
      { group: "Build", label: "Toughness", value: "Tested to MIL-STD-810H: heat to 70°C (158°F), cold to -40°C (-40°F), 96 h salt spray, ice and freezing rain, 240 h humidity, shock" },
      { group: "Build", label: "Size", value: "49.2 x 49.2 x 13.6 mm (1.94 x 1.94 x 0.54 in)" },
      { group: "Build", label: "Strap", value: "22 mm liquid silicone sport strap with folding buckle and two keepers, fits 130 to 235 mm (5.1 to 9.25 in) wrists" },
      { group: "Smart features", label: "Calls", value: "Bluetooth calls, dial pad, contacts, recent calls, voice assistant" },
      { group: "Smart features", label: "Notifications", value: "Calls, messages, email and app alerts" },
      { group: "Smart features", label: "Tools", value: "Weather, music and camera control, find my phone, calendar, calculator, alarm, stopwatch, timer" },
      { group: "Smart features", label: "Bluetooth", value: "BLE 5.3" },
      { group: "Smart features", label: "Phone app", value: "Works with iPhone (iOS 10+) and Android (5.0+)" },
      { group: "Smart features", label: "Languages", value: "19, including English, Arabic, French, German and Spanish" },
      { group: "In the box", label: "Includes", value: "MATIN Torvan watch with strap, magnetic charging cable, instruction manual" },
    ],
    featureGroups: [
      { title: "Calls & connect", icon: "smart", items: ["Bluetooth calls", "Voice assistant", "Message and app notifications", "Find my phone"] },
      { title: "Health", icon: "health", items: ["24/7 heart rate", "Blood oxygen (SpO2)", "Sleep score", "Breathing training"] },
      { title: "Sport & activity", icon: "outdoor", items: ["9 sport modes", "Steps and distance", "Calorie tracker", "Real-time pace"] },
      { title: "Everyday tools", icon: "tools", items: ["LED flashlight", "Weather", "Music control", "Stopwatch and timer"] },
    ],
    batteryLiquid: {
      mah: 550,
      image: "/products/matin-torvan-front-view.webp",
      imageAlt: "MATIN Torvan front view with its round AMOLED screen showing the battery level",
      screen: { cx: 49.6, cy: 48.8, r: 24.8 },
      modes: [
        { label: "Heavy use", days: 6, text: "Lots of calls, workouts and notifications." },
        { label: "Typical use", days: 14, text: "Everyday wear with health tracking and notifications." },
        { label: "Power saving", days: 30, text: "Stretch the battery when you are away from a charger." },
      ],
      facts: [
        { value: "550 mAh", label: "Battery" },
        { value: "573 min", label: "Talk time" },
        { value: "1.5 h", label: "Magnetic charge" },
      ],
    },
    health: { metrics: ["hr", "rest", "spo2"], continuous: true },
    sportModes: {
      count: "9",
      ids: ["running", "walking", "hiking", "cycling", "basketball", "soccer", "badminton", "yoga", "jump-rope"],
    },
    faq: [
      {
        q: "Can I take calls on the MATIN Torvan?",
        a: "Yes. Pair it with your phone over Bluetooth and you can answer, reject and make calls from your wrist, with a dial pad, contacts and recent calls.",
      },
      {
        q: "Does the MATIN Torvan track heart rate and blood oxygen?",
        a: "Yes. It reads your heart rate from your wrist around the clock, once a minute, shows your daily resting heart rate and measures blood oxygen (SpO2). It is a wellness smartwatch, not a medical device.",
      },
      {
        q: "Which sport modes does it have?",
        a: "9 sport modes: running, walking, hiking, cycling, basketball, soccer, badminton, yoga and jump rope. It also counts steps, distance, calories and standing time.",
      },
      {
        q: "How long does the battery last?",
        a: "About 14 days with typical use, about 6 days with heavy use and up to 30 days in power-saving mode. It charges in about 1.5 hours with a magnetic charger.",
      },
      {
        q: "Does the MATIN Torvan have a flashlight?",
        a: "Yes. It has a built-in LED flashlight, handy at night, when camping or when you drop something in the dark.",
      },
      {
        q: "Is the MATIN Torvan good for construction work?",
        a: "Yes, it is our best pick for job sites. Sapphire glass resists scratches from tools and concrete, the 316L stainless steel case takes knocks, and it is sealed to IP69K against dust, mud and high-pressure water. The built-in LED flashlight helps in dark corners, you can take calls without pulling out your phone, and the battery lasts about 14 days with typical use.",
      },
      {
        q: "Is the MATIN Torvan waterproof?",
        a: "It is rated 5ATM and IP69K, so rain, sweat, splashes, dust, mud, high-pressure water and swimming in a pool are fine. It has no swim-tracking mode, so it will not count laps. Do not use it for diving, in hot showers or in the sauna.",
      },
      {
        q: "How tough is the MATIN Torvan?",
        a: "It has a 316L stainless steel case and sapphire glass, and it is tested to MIL-STD-810H for heat up to 70°C (158°F), cold down to -40°C (-40°F), 96 hours of salt spray, ice and freezing rain, 240 hours of humidity and shock.",
      },
      {
        q: "Does it work with iPhone and Android?",
        a: "Yes. It works with iPhone (iOS 10 or newer) and Android (5.0 or newer).",
      },
      {
        q: "What is the screen like?",
        a: "A round 1.43 inch AMOLED display at 466 x 466 pixels (391 PPI), up to 1000 nits bright and protected by sapphire glass. It has an always-on mode and 300+ watch faces, and you can use your own photo as a face.",
      },
      {
        q: "Is the MATIN Torvan certified for the USA?",
        a: "Yes. It has passed FCC, CE and RoHS certification, and its Bluetooth is BQB qualified, so it meets US and EU requirements for electronics.",
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free worldwide, and you get a 1 year warranty and 30 day returns. Delivery takes about 8 to 10 business days to the USA, 7 to 9 to Canada, 5 to 8 to the UK, 7 to 9 to Europe, Australia and the Middle East, and 2 to 4 within Asia.",
      },
    ],
    seoTitle: "MATIN Torvan Military Smartwatch | Bluetooth Calling, AMOLED",
    seoDescription:
      'MATIN Torvan rugged military-style smartwatch for men: Bluetooth calling, 1.43" AMOLED, sapphire glass, SpO2, 30 day battery, 5ATM, IP69K, MIL-STD-810H.',
    art: { case: "#1c1f26", strap: "#121418", accent: "#2f62e0" },
  },
  {
    slug: "matin-kaldor",
    name: "MATIN Kaldor",
    tagline: "Outdoor GPS smartwatch with dual-frequency GPS, flashlight and Bluetooth calls",
    price: 150,
    shareImage: "/products/matin-kaldor-share.jpg",
    category: "outdoor",
    collections: ["outdoor", "tactical", "gps", "calling"],
    badge: "New",
    images: [
      "/products/matin-kaldor-titanium-rugged-smartwatch.webp",
      "/products/matin-kaldor-titanium-front-view.webp",
      "/products/matin-kaldor-titanium-side-buttons.webp",
      "/products/matin-kaldor-titanium-side-flashlight.webp",
      "/products/matin-kaldor-titanium-heart-rate-sensor-back.webp",
    ],
    imageAlts: [
      'MATIN Kaldor outdoor GPS smartwatch in titanium grey with a red-ringed crown, 1.43" AMOLED display and black silicone strap',
      "MATIN Kaldor front view with round AMOLED watch face showing time, heart rate, steps, altitude and battery",
      "MATIN Kaldor angled view with the crown, two side buttons and a metal buckle",
      "MATIN Kaldor angled from the left with the textured LED flashlight panel on the side of the case",
      "Back of the MATIN Kaldor with heart rate and blood oxygen sensor and magnetic charging",
    ],
    colors: [{ name: "Titanium Grey", hex: "#6b6e73" }],
    description:
      'The MATIN Kaldor is an outdoor GPS smartwatch for men, made for trails, water and long days outside. Dual-frequency GPS with 5 satellite systems keeps your route accurate between trees and tall buildings, and a compass and barometric altimeter show your heading, altitude and air pressure. A built-in LED flashlight lights the way at night. The 1.43" AMOLED display (466x466) is sharp and easy to read, with a rotating crown and two buttons. Take calls from your wrist over Bluetooth, follow your heart rate, HRV, blood oxygen, stress and sleep, and train with 100+ sport modes. The 670mAh battery lasts about 10 days with typical use, up to 15 days with light use and up to 24 hours of continuous GPS. Rated 5ATM, it is fine for swimming in a pool, snorkeling and surfing.',
    highlights: [
      { value: "GPS", label: "Dual-frequency" },
      { value: "5ATM", label: "Swim-proof" },
      { value: "Calls", label: "From your wrist" },
      { value: "15d", label: "Battery life" },
    ],
    specs: [
      { group: "Display", label: "Screen", value: '1.43" AMOLED touchscreen' },
      { group: "Display", label: "Resolution", value: "466 x 466 pixels" },
      { group: "Display", label: "Shape", value: "Round, with a rotating crown and two buttons" },
      { group: "Display", label: "Wake", value: "Raise your wrist to wake the screen" },
      { group: "Battery", label: "Capacity", value: "670mAh" },
      { group: "Battery", label: "Battery life", value: "About 10 days typical, 5 days heavy use, up to 15 days light use" },
      { group: "Battery", label: "GPS", value: "Up to 24 hours of continuous GPS" },
      { group: "Battery", label: "Charging", value: "Magnetic charger" },
      { group: "GPS & outdoor", label: "GPS", value: "Built-in, dual-frequency, 5 satellite systems" },
      { group: "GPS & outdoor", label: "Routes", value: "Real-time route tracking and workout records" },
      { group: "GPS & outdoor", label: "Compass", value: "High-precision geomagnetic compass" },
      { group: "GPS & outdoor", label: "Altitude", value: "Barometric altimeter with 24-hour air pressure and altitude curves" },
      { group: "GPS & outdoor", label: "Flashlight", value: "Built-in LED flashlight" },
      { group: "GPS & outdoor", label: "Weather", value: "Weather forecast from your phone" },
      { group: "Health", label: "Heart rate", value: "Heart rate monitoring from the wrist, plus HRV" },
      { group: "Health", label: "Blood oxygen", value: "SpO2 measurement" },
      { group: "Health", label: "Sleep", value: "24/7 sleep monitoring" },
      { group: "Health", label: "More", value: "Stress, breathing training, sedentary reminder, menstrual cycle tracking" },
      { group: "Sports", label: "Sport modes", value: "100+ modes, including running, walking, cycling, climbing, fitness and pool swimming" },
      { group: "Sports", label: "Activity", value: "Steps, calories, distance, goal reminders and real-time workout tracking" },
      { group: "Build", label: "Case", value: "Zinc alloy middle frame" },
      { group: "Build", label: "Water resistance", value: "5ATM: pool swimming, snorkeling and surfing" },
      { group: "Build", label: "Strap", value: "Silicone sport strap with pin buckle" },
      { group: "Smart features", label: "Calls", value: "Bluetooth calls with dial pad and contacts" },
      { group: "Smart features", label: "Notifications", value: "Calls, messages and social media app alerts" },
      { group: "Smart features", label: "Tools", value: "Music control, camera control, find my phone, alarm, stopwatch, timer, countdown, calendar, calculator" },
      { group: "Smart features", label: "Modes", value: "Do not disturb, speaker water drain" },
      { group: "Smart features", label: "Bluetooth", value: "BLE 5.3" },
      { group: "Smart features", label: "Phone app", value: "Free app for iPhone and Android" },
      { group: "Smart features", label: "Languages", value: "English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese, Indonesian" },
    ],
    featureGroups: [
      { title: "GPS & outdoor", icon: "outdoor", items: ["Dual-frequency GPS", "Compass", "Barometric altimeter", "LED flashlight"] },
      { title: "Calls & connect", icon: "smart", items: ["Bluetooth calls", "Dial pad and contacts", "App notifications", "Find my phone"] },
      { title: "Health & sport", icon: "health", items: ["Heart rate and HRV", "Blood oxygen (SpO2)", "Sleep and stress", "100+ sport modes"] },
      { title: "Everyday tools", icon: "tools", items: ["Weather", "Music and camera control", "Alarm and timer", "Calculator"] },
    ],
    gps: {
      screens: ["route", "sats", "compass", "alt"],
      systems: ["GPS", "GLONASS", "Galileo", "BeiDou", "QZSS"],
      barometric: true,
    },
    fitness: { look: "multi", count: "100+" },
    health: { metrics: ["hr", "spo2", "sleep", "activity"] },
    batteryLiquid: {
      mah: 670,
      image: "/products/matin-kaldor-titanium-front-view.webp",
      imageAlt: "MATIN Kaldor front view with its round AMOLED screen showing the battery level",
      screen: { cx: 48.71, cy: 48.29, r: 24.64 },
      look: "radar",
      intro:
        "The MATIN Kaldor runs on a big 670mAh battery: about 10 days of everyday wear, up to 15 days with light use, and up to 24 hours of continuous GPS for a long day on the trail.",
      modes: [
        { label: "Heavy use", days: 5, text: "Daily GPS workouts, calls, the flashlight and lots of notifications." },
        { label: "Typical use", days: 10, text: "Everyday wear with health tracking, notifications and a few workouts." },
        { label: "Light use", days: 15, text: "Time, steps, heart rate and a few notifications a day." },
      ],
      facts: [
        { value: "670 mAh", label: "Battery" },
        { value: "24 h", label: "Continuous GPS" },
        { value: "Magnetic", label: "Charger" },
      ],
    },
    faq: [
      {
        q: "Does the MATIN Kaldor have GPS?",
        a: "Yes. Built-in dual-frequency GPS with 5 satellite systems tracks your route, distance and pace, and stays accurate under trees and between tall buildings. It also has a compass and a barometric altimeter that shows altitude and air pressure.",
      },
      {
        q: "Can I swim with the MATIN Kaldor?",
        a: "Yes. It is rated 5ATM, so swimming in a pool, snorkeling and surfing are fine, and it has a pool swim mode. Do not use it for diving, in hot showers or in the sauna.",
      },
      {
        q: "Does the MATIN Kaldor have a flashlight?",
        a: "Yes. It has a built-in LED flashlight on the side of the case, handy on night hikes, when camping or when you drop something in the dark.",
      },
      {
        q: "Can I take calls on the MATIN Kaldor?",
        a: "Yes. Pair it with your phone over Bluetooth and you can answer and make calls from your wrist, with a dial pad and contacts.",
      },
      {
        q: "How long does the battery last?",
        a: "About 10 days with typical use, about 5 days with heavy use and up to 15 days with light use. With GPS on all the time it lasts up to 24 hours. It charges with a magnetic cable.",
      },
      {
        q: "What does it track for health?",
        a: "Heart rate, heart rate variability (HRV), blood oxygen (SpO2), stress, sleep around the clock, breathing training and menstrual cycle, plus steps, calories and distance. It is a wellness smartwatch, not a medical device.",
      },
      {
        q: "Is the MATIN Kaldor good for construction work?",
        a: "Yes, especially if your work takes you outdoors. The LED flashlight helps in dark corners, you can take calls from your wrist, it is rated 5ATM against rain and water, and the battery lasts about 10 days with typical use. For the toughest job sites with lots of dust, mud and pressure washing, the MATIN Torvan with sapphire glass and IP69K is the better pick.",
      },
      {
        q: "What is the screen like?",
        a: "A round 1.43 inch AMOLED touchscreen at 466 x 466 pixels, sharp and easy to read outdoors. You can scroll with the rotating crown and wake the screen by raising your wrist.",
      },
      {
        q: "Does it work with iPhone and Android?",
        a: "Yes. It works with iPhone and Android over Bluetooth 5.3, with a free phone app to sync your workouts and health data.",
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free worldwide, and you get a 1 year warranty and 30 day returns. Delivery takes about 8 to 10 business days to the USA, 7 to 9 to Canada, 5 to 8 to the UK, 7 to 9 to Europe, Australia and the Middle East, and 2 to 4 within Asia.",
      },
    ],
    seoTitle: "MATIN Kaldor Outdoor GPS Smartwatch | Dual-Frequency, 5ATM",
    seoDescription:
      'MATIN Kaldor outdoor GPS smartwatch for men: dual-frequency GPS, compass, altimeter, LED flashlight, Bluetooth calls, 1.43" AMOLED, SpO2, 15 day battery, 5ATM.',
    art: { case: "#5c5f64", strap: "#121418", accent: "#c6e83a" },
  },
  {
    slug: "matin-varkon",
    name: "MATIN Varkon",
    tagline: "Rugged GPS smartwatch with Bluetooth calls and up to 30 days battery",
    price: 180,
    shareImage: "/products/matin-varkon-share.jpg",
    category: "tactical",
    collections: ["tactical", "outdoor", "gps", "calling", "long-battery"],
    badge: "New",
    images: [
      "/products/matin-varkon-angle-view.webp",
      "/products/matin-varkon-rugged-smartwatch.webp",
      "/products/matin-varkon-front-view.webp",
      "/products/matin-varkon-heart-rate-sensor-back.webp",
      "/products/matin-varkon-side-buttons.webp",
      "/products/matin-varkon-orange-angle-view.webp",
      "/products/matin-varkon-orange-rugged-smartwatch.webp",
      "/products/matin-varkon-orange-front-view.webp",
      "/products/matin-varkon-orange-heart-rate-sensor-back.webp",
      "/products/matin-varkon-orange-side-buttons.webp",
    ],
    imageAlts: [
      "MATIN Varkon rugged smartwatch angled from the left with a red stainless steel side plate and armored screws",
      'MATIN Varkon rugged GPS smartwatch in black with a red crown, red side plate and 1.43" AMOLED display',
      "MATIN Varkon front view with round AMOLED watch face showing time, heart rate, steps, air pressure and date",
      "Back of the MATIN Varkon with heart rate and blood oxygen sensor and magnetic charging pins",
      "MATIN Varkon side view with a red side plate between three metal buttons and black silicone strap",
      "MATIN Varkon in orange and silver angled from the left, with an orange side plate and orange silicone strap",
      'MATIN Varkon rugged GPS smartwatch in orange with a silver steel bezel, orange crown and 1.43" AMOLED display',
      "MATIN Varkon orange front view with compass, steps and date on the round AMOLED watch face",
      "Back of the orange MATIN Varkon with heart rate and blood oxygen sensor and magnetic charging pins",
      "MATIN Varkon orange side view with an orange side plate between metal buttons",
    ],
    colors: [
      { name: "Black / Red", hex: "#1c1f26" },
      { name: "Orange / Silver", hex: "#f08a1c", from: 5 },
    ],
    description:
      'The MATIN Varkon is a rugged GPS smartwatch for men with a 316L stainless steel case, a carbon-coated metal bezel and bold red or orange details. The 1.43" AMOLED display (466x466) reaches 1000 nits, so it stays easy to read in direct sun, behind Corning Gorilla Glass. Built-in GPS works with 6 satellite systems, and a compass, barometric altimeter and gyroscope keep you on track outdoors. A built-in LED flashlight lights the way at night. Take calls from your wrist over Bluetooth, track heart rate, blood oxygen and sleep, and pick from 170+ sport modes, from triathlon to open water swimming. The 500mAh battery lasts about 12 days with typical use and up to 30 days in power-saving mode. Rated 5ATM and IP69K, it handles rain, dust, mud and high-pressure water.',
    highlights: [
      { value: "30d", label: "Power saving" },
      { value: "GPS", label: "6 satellite systems" },
      { value: "Calls", label: "From your wrist" },
      { value: "IP69K", label: "& 5ATM" },
    ],
    specs: [
      { group: "Display", label: "Screen", value: '1.43" AMOLED, 466 x 466 pixels, 391 PPI' },
      { group: "Display", label: "Brightness", value: "Up to 1000 nits" },
      { group: "Display", label: "Screen-to-body", value: "76%" },
      { group: "Display", label: "Glass", value: "Corning Gorilla Glass" },
      { group: "Display", label: "Always-on", value: "Always-on display mode and raise to wake" },
      { group: "Battery", label: "Capacity", value: "500mAh Li-polymer" },
      { group: "Battery", label: "Battery life", value: "About 12 days typical, 5 days heavy use, up to 30 days power saving" },
      { group: "Battery", label: "Charging", value: "Magnetic charger, about 1.5 hours" },
      { group: "GPS & outdoor", label: "GPS", value: "Built-in, 6 satellite systems (GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC)" },
      { group: "GPS & outdoor", label: "Routes", value: "Real-time track and track back to your start point" },
      { group: "GPS & outdoor", label: "Sensors", value: "Compass, barometric altimeter, air pressure, gyroscope, geomagnetic sensor, accelerometer" },
      { group: "GPS & outdoor", label: "Flashlight", value: "Built-in LED flashlight" },
      { group: "GPS & outdoor", label: "Time", value: "GPS time sync, automatic daylight saving time, world clock" },
      { group: "Health", label: "Heart rate", value: "Heart rate monitoring from the wrist" },
      { group: "Health", label: "Blood oxygen", value: "SpO2 measurement" },
      { group: "Health", label: "Sleep", value: "Sleep quality and daytime naps" },
      { group: "Health", label: "Alerts", value: "Low blood oxygen and abnormally high or low heart rate alerts" },
      { group: "Health", label: "More", value: "Stress levels, daytime naps, breathing exercises, women's health tracking, activity tracking" },
      { group: "Sports", label: "Sport modes", value: "170+ sport modes, including triathlon, mountaineering and open water swimming" },
      { group: "Sports", label: "Smart recognition", value: "Recognises when you start a workout" },
      { group: "Sports", label: "Swim tracking", value: "Pool and open water: underwater heart rate, stroke type, stroke count and rate, SWOLF, distance" },
      { group: "Build", label: "Case", value: "316L stainless steel with a carbon-coated metal bezel" },
      { group: "Build", label: "Water and dust", value: "5ATM and IP69K" },
      { group: "Build", label: "Toughness", value: "Passed 15 rugged durability tests" },
      { group: "Build", label: "Size", value: "49 x 49 x 14 mm" },
      { group: "Build", label: "Weight", value: "63 g with strap" },
      { group: "Build", label: "Strap", value: "Silicone, 22 mm wide, fits 130 to 235 mm wrists" },
      { group: "Smart features", label: "Calls", value: "Bluetooth calls from your wrist, offline voice assistant" },
      { group: "Smart features", label: "Notifications", value: "Calls, SMS and app notifications" },
      { group: "Smart features", label: "Tools", value: "Music and camera control, find my phone, weather, world clock, stopwatch, timer, alarm, calculator" },
      { group: "Smart features", label: "Modes", value: "Power saving, do not disturb, silent, screen lock, password lock" },
      { group: "Smart features", label: "Bluetooth", value: "BLE 5.3" },
      { group: "Smart features", label: "Phone app", value: "Free app for iPhone (iOS 11+) and Android (5.0+), with hundreds of watch faces" },
      { group: "Smart features", label: "Languages", value: "30, including English, Spanish, French, German, Portuguese and Arabic" },
    ],
    featureGroups: [
      { title: "GPS & outdoor", icon: "outdoor", items: ["6-system GPS", "Compass", "Barometric altimeter", "GPS time sync"] },
      { title: "Calls & connect", icon: "smart", items: ["Bluetooth calls", "Voice assistant", "SMS and app notifications", "Find my phone"] },
      { title: "Health & sport", icon: "health", items: ["Heart rate", "Blood oxygen (SpO2)", "Sleep quality", "170+ sport modes"] },
      { title: "Everyday tools", icon: "tools", items: ["LED flashlight", "Weather", "Music and camera control", "Stopwatch and timer"] },
    ],
    gps: { screens: ["route", "sats", "alt"], systems: ["GPS", "GLONASS", "Galileo", "BeiDou", "QZSS", "NavIC"], barometric: true },
    fitness: { look: "tri", count: "170+" },
    health: { metrics: ["hr", "spo2", "sleep"] },
    batteryLiquid: {
      mah: 500,
      image: "/products/matin-varkon-front-view.webp",
      imageAlt: "MATIN Varkon front view with its round AMOLED screen showing the battery level",
      screen: { cx: 49.5, cy: 47.21, r: 26.07 },
      look: "rings",
      intro:
        "The MATIN Varkon runs on a 500mAh battery: about 12 days of everyday wear, and up to 30 days in power-saving mode.",
      modes: [
        { label: "Heavy use", days: 5, text: "GPS workouts, calls and lots of notifications." },
        { label: "Typical use", days: 12, text: "Everyday wear with health tracking and notifications." },
        { label: "Power saving", days: 30, text: "Stretch the battery on long trips away from a charger." },
      ],
      facts: [
        { value: "500 mAh", label: "Battery" },
        { value: "1.5 h", label: "Magnetic charge" },
        { value: "30 days", label: "Power saving" },
      ],
    },
    faq: [
      {
        q: "How long does the MATIN Varkon battery last?",
        a: "About 12 days with typical use, about 5 days with heavy GPS use and up to 30 days in power-saving mode. It charges in about 1.5 hours with a magnetic charger.",
      },
      {
        q: "Does the MATIN Varkon have GPS?",
        a: "Yes. Built-in GPS uses 6 satellite systems (GPS, GLONASS, Galileo, BeiDou, QZSS and NavIC) to track your route, distance and pace. It also has a compass and a barometric altimeter.",
      },
      {
        q: "Does the MATIN Varkon have a flashlight?",
        a: "Yes. It has a built-in LED flashlight, handy on night hikes, when camping or when you drop something in the dark.",
      },
      {
        q: "Can I take calls on the MATIN Varkon?",
        a: "Yes. Pair it with your phone over Bluetooth and you can answer and make calls from your wrist. It also has a voice assistant.",
      },
      {
        q: "Is the MATIN Varkon good for construction work?",
        a: "Yes. The 316L stainless steel case and Gorilla Glass take daily knocks, it is sealed to IP69K against dust, mud and high-pressure water, and it has a built-in LED flashlight and Bluetooth calls. The battery lasts about 12 days with typical use. Its GPS, compass and altimeter make it a great fit if your work takes you outdoors or off-road.",
      },
      {
        q: "Is the MATIN Varkon waterproof?",
        a: "It is rated 5ATM and IP69K, so pool and open water swimming, rain, mud, dust and high-pressure water are fine, and it tracks your swims with underwater heart rate. Do not use it for diving or in hot showers.",
      },
      {
        q: "Does it track heart rate and blood oxygen?",
        a: "Yes. It reads your heart rate from your wrist, measures blood oxygen (SpO2), tracks stress and sleep, and alerts you to low blood oxygen or an unusually high or low heart rate. It is a wellness smartwatch, not a medical device.",
      },
      {
        q: "What is the screen like?",
        a: "A round 1.43 inch AMOLED display at 466 x 466 pixels, up to 1000 nits bright, behind Corning Gorilla Glass.",
      },
      {
        q: "How big and heavy is it?",
        a: "The case is 49 x 49 x 14 mm and the watch weighs 63 g with the strap. The 22 mm silicone strap fits wrists from 130 to 235 mm.",
      },
      {
        q: "Does it work with iPhone and Android?",
        a: "Yes. It works with iPhone (iOS 11 or newer) and Android (5.0 or newer) through the free phone app.",
      },
      {
        q: "Is the MATIN Varkon certified for the USA?",
        a: "Yes. It has passed FCC, CE and RoHS certification, and its Bluetooth is BQB qualified, so it meets US and EU requirements for electronics.",
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free worldwide, and you get a 1 year warranty and 30 day returns. Delivery takes about 8 to 10 business days to the USA, 7 to 9 to Canada, 5 to 8 to the UK, 7 to 9 to Europe, Australia and the Middle East, and 2 to 4 within Asia.",
      },
    ],
    seoTitle: "MATIN Varkon Rugged GPS Smartwatch | 30 Day Battery",
    seoDescription:
      'MATIN Varkon rugged GPS smartwatch for men: 30 day battery, Bluetooth calls, 1.43" AMOLED, compass, altimeter, heart rate, SpO2, 5ATM and IP69K.',
    art: { case: "#1c1f26", strap: "#121418", accent: "#e0262b" },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number) {
  return `$${n.toFixed(2)}`;
}

// The photos (start and end index in `images`) that belong to one color.
export function colorRange(p: Product, color: number): [number, number] {
  const c = p.colors[color];
  if (!c || c.from === undefined) {
    const firstOther = p.colors.find((x) => x.from !== undefined)?.from;
    return [0, firstOther ?? p.images.length];
  }
  const next = p.colors.slice(color + 1).find((x) => x.from !== undefined)?.from;
  return [c.from, next ?? p.images.length];
}

// Index of the first photo of a color, looked up by its name (used in the cart).
export function colorPhoto(p: Product, colorName: string): number {
  const i = p.colors.findIndex((c) => c.name === colorName);
  return i < 0 ? 0 : colorRange(p, i)[0];
}
