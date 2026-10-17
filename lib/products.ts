// All store products live here. To add a real product:
// 1. Put its photos in /public/products/ (e.g. /public/products/titan-x-1.jpg)
// 2. Copy one of the entries below and change the text, price and `images`.
// A product with no `images` shows a drawn placeholder watch instead.

export type Category = "tactical" | "outdoor" | "dive";

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
  // Animated health monitoring section (heart rate, resting heart rate, SpO2).
  // Only for watches that really have all three.
  healthMonitoring?: boolean;
  // Animated battery section: capacity in mAh and the battery life range in days.
  batteryShowcase?: { mah: number; days: string };
  // "What it does", sorted into a few groups (icon: outdoor | health | smart | tools).
  featureGroups?: { title: string; icon: "outdoor" | "health" | "smart" | "tools"; items: string[] }[];
  // "Turn it around" scroll section: each step shows one photo (index into
  // `images`) with a short headline. Order them like a turn: front, angle, side, back.
  // Big lifestyle panels: a photo with the headline and icon points written
  // as real text over it (so Google can read it and it stays sharp).
  stories?: {
    image: string;
    alt: string;
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
  { id: "dive", name: "Dive", blurb: "Water rated to 100m" },
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
      "Rugged tactical smartwatches for men: military-style metal cases, AMOLED screens, GPS or Bluetooth calling and up to 30 days battery. Free US shipping.",
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
      "Rugged outdoor smartwatches for men: GPS, compass, flashlight, bright AMOLED screens and up to 30 days battery for hiking and camping. Free US shipping.",
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
      "Rugged GPS smartwatches for men with built-in GPS route tracking, sport modes, AMOLED screens and up to 30 days battery. Free US shipping.",
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
      "Rugged smartwatches with Bluetooth calling: answer and make calls from your wrist, AMOLED screens, heart rate and up to 30 days battery. Free US shipping.",
  },
  {
    id: "long-battery",
    name: "Long battery",
    blurb: "Up to 30 days on one charge",
    title: "Long battery",
    heading: "Rugged smartwatches with long battery life",
    intro:
      "Every watch here lasts up to 30 days on one charge with typical use, so you charge it a few times a month instead of every night.",
    seoTitle: "Rugged Smartwatches with Long Battery Life (30 Days)",
    seoDescription:
      "Rugged smartwatches with long battery life: up to 30 days on one charge, tough metal cases, AMOLED screens and GPS or calling. Free US shipping.",
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
      "/products/matin-trekon-rugged-smartwatch.webp",
      "/products/matin-trekon-front-view.webp",
      "/products/matin-trekon-angle-view.webp",
      "/products/matin-trekon-side-buttons.webp",
      "/products/matin-trekon-heart-rate-sensor-back.webp",
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
        image: "/products/life/matin-trekon-built-for-the-tough.webp",
        tab: "Tough",
        alt: "MATIN Trekon rugged smartwatch covered in mud on a soldier's wrist in the mountains",
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
        image: "/products/life/matin-trekon-built-tough-outdoors.webp",
        tab: "Outdoors",
        alt: "Hiker checking a GPS route on the MATIN Trekon smartwatch above a mountain lake",
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
        image: "/products/life/matin-trekon-heart-rate-monitoring.webp",
        tab: "Heart rate",
        alt: "Hiker checking his heart rate on the MATIN Trekon smartwatch",
        title: ["Heart rate", "monitoring"],
        text: "Track your heart rate in real time and stay in control of your health every day.",
        points: [
          { icon: "heart", title: "Real-time heart rate", text: "24/7 continuous monitoring" },
          { icon: "chart", title: "Heart rate trends", text: "View your daily, weekly and monthly data" },
          { icon: "run", title: "Stay active and healthy", text: "Get insights to improve your fitness" },
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
    batteryShowcase: { mah: 1000, days: "11 – 30" },
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
        image: "/products/matin-trekon-sport-fitness-modes.webp",
        imageAlt:
          "MATIN Trekon rugged smartwatch on a hiker's wrist showing the workout menu with running, cycling, hiking and gym sport modes",
      },
      {
        eyebrow: "Waterproof",
        title: "Rain or river. Keep going.",
        text: "Rain, splashes, sweat and stream crossings don't slow it down. Wear it on every trail and never stop to take it off.",
        image: "/products/matin-trekon-waterproof-rugged-smartwatch.webp",
        imageAlt:
          "Waterproof MATIN Trekon rugged smartwatch splashed with water on a hiker's wrist by a mountain river",
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
        src: "/products/matin-trekon-sport-fitness-modes.webp",
        alt: "MATIN Trekon rugged smartwatch on a hiker's wrist showing the workout menu with running, cycling, hiking and gym sport modes",
        width: 2000,
        height: 2000,
      },
      {
        src: "/products/matin-trekon-waterproof-rugged-smartwatch.webp",
        alt: "Waterproof MATIN Trekon rugged smartwatch splashed with water on a hiker's wrist by a mountain river",
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
        q: "Is the MATIN Trekon waterproof?",
        a: "It is rated 3ATM, so rain, sweat and splashes are fine. It is not made for swimming or diving.",
      },
      {
        q: "What is the screen like?",
        a: 'A big 1.95 inch AMOLED touchscreen with bright, sharp colors that stays readable outdoors.',
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free across the USA, and you get a 2 year warranty and 30 day returns.",
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
      "MATIN Torvan front view with round AMOLED display showing steps, heart rate, weather, date and moon phase",
      "MATIN Torvan side view with two buttons and a blue stainless steel side plate",
      "Back of the MATIN Torvan with heart rate sensor and magnetic charging pins",
    ],
    colors: [{ name: "Stealth Black", hex: "#1c1f26" }],
    description:
      'The MATIN Torvan is a round, military-style rugged smartwatch with a stainless steel case, sapphire glass and a bold blue side plate. The 1.43" AMOLED display (466x466) is sharp and bright, and you can take calls right from your wrist over Bluetooth. A built-in LED flashlight lights the way at night. It tracks heart rate around the clock, blood oxygen, sleep and calories, and the 550mAh battery lasts up to 30 days with typical use or up to 60 days in power-saving mode. Rated 5ATM water resistant, it is a tough outdoor smartwatch that works with both iPhone and Android.',
    highlights: [
      { value: '1.43"', label: "AMOLED screen" },
      { value: "30d", label: "Battery life" },
      { value: "5ATM", label: "Water rating" },
      { value: "Calls", label: "From your wrist" },
    ],
    specs: [
      { group: "Display", label: "Screen", value: '1.43" AMOLED, ultra HD' },
      { group: "Display", label: "Resolution", value: "466 x 466 pixels" },
      { group: "Display", label: "Glass", value: "Sapphire glass" },
      { group: "Display", label: "Shape", value: "Round" },
      { group: "Battery", label: "Capacity", value: "550mAh" },
      { group: "Battery", label: "Battery life", value: "Up to 30 days typical, 18 days heavy use, 60 days power saving" },
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
      { group: "Build", label: "Case", value: "Stainless steel with liquid silicone" },
      { group: "Build", label: "Water resistance", value: "5ATM" },
      { group: "Build", label: "Strap", value: "Liquid silicone sport strap with two keepers" },
      { group: "Smart features", label: "Calls", value: "Bluetooth calls, dial pad, contacts, recent calls, voice assistant" },
      { group: "Smart features", label: "Notifications", value: "Calls, messages, email and app alerts" },
      { group: "Smart features", label: "Tools", value: "Weather, music and camera control, find my phone, calendar, calculator, alarm, stopwatch, timer" },
      { group: "Smart features", label: "Bluetooth", value: "BLE 5.3" },
      { group: "Smart features", label: "Phone app", value: "Works with iPhone (iOS 10+) and Android (5.0+)" },
      { group: "Smart features", label: "Languages", value: "19, including English, Arabic, French, German and Spanish" },
    ],
    featureGroups: [
      { title: "Calls & connect", icon: "smart", items: ["Bluetooth calls", "Voice assistant", "Message and app notifications", "Find my phone"] },
      { title: "Health", icon: "health", items: ["24/7 heart rate", "Blood oxygen (SpO2)", "Sleep score", "Breathing training"] },
      { title: "Sport & activity", icon: "outdoor", items: ["9 sport modes", "Steps and distance", "Calorie tracker", "Real-time pace"] },
      { title: "Everyday tools", icon: "tools", items: ["LED flashlight", "Weather", "Music control", "Stopwatch and timer"] },
    ],
    healthMonitoring: true,
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
        a: "Up to 30 days with typical use, up to 18 days with heavy use and up to 60 days in power-saving mode. It charges in about 1.5 hours with a magnetic charger.",
      },
      {
        q: "Does the MATIN Torvan have a flashlight?",
        a: "Yes. It has a built-in LED flashlight, handy at night, when camping or when you drop something in the dark.",
      },
      {
        q: "Is the MATIN Torvan waterproof?",
        a: "It is rated 5ATM, so rain, sweat, splashes and washing your hands are fine.",
      },
      {
        q: "Does it work with iPhone and Android?",
        a: "Yes. It works with iPhone (iOS 10 or newer) and Android (5.0 or newer).",
      },
      {
        q: "What is the screen like?",
        a: "A round 1.43 inch AMOLED display at 466 x 466 pixels, protected by sapphire glass.",
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free across the USA, and you get a 2 year warranty and 30 day returns.",
      },
    ],
    seoTitle: "MATIN Torvan Military Smartwatch | Bluetooth Calling, AMOLED",
    seoDescription:
      'MATIN Torvan rugged military-style smartwatch for men: Bluetooth calling, 1.43" AMOLED, sapphire glass, heart rate, SpO2, 30 day battery, 5ATM waterproof.',
    art: { case: "#1c1f26", strap: "#121418", accent: "#2f62e0" },
  },
  {
    slug: "matin-kaldor",
    name: "MATIN Kaldor",
    tagline: "Tactical GPS smartwatch with flashlight, compass and Bluetooth calls",
    price: 130,
    shareImage: "/products/matin-kaldor-share.jpg",
    category: "outdoor",
    collections: ["outdoor", "tactical", "gps", "calling", "long-battery"],
    badge: "New",
    images: [
      "/products/matin-kaldor-rugged-smartwatch.webp",
      "/products/matin-kaldor-front-view.webp",
      "/products/matin-kaldor-angle-view.webp",
      "/products/matin-kaldor-side-flashlight.webp",
      "/products/matin-kaldor-heart-rate-sensor-back.webp",
    ],
    imageAlts: [
      'MATIN Kaldor tactical GPS smartwatch in black with a compass bezel, yellow LED flashlight and 1.43" AMOLED display',
      "MATIN Kaldor front view with round AMOLED watch face showing time, steps, heart rate and battery",
      "MATIN Kaldor rugged smartwatch angled view with armored screws, grip keys and black silicone strap",
      "MATIN Kaldor side view with the LED flashlight between textured side buttons",
      "Back of the MATIN Kaldor with heart rate sensor, magnetic charging pins and flashlight",
    ],
    colors: [{ name: "Stealth Black", hex: "#1c1f26" }],
    description:
      'The MATIN Kaldor is a tactical GPS smartwatch for men, built for night shifts, trails and long days outside. A built-in LED flashlight with 3 light modes sits on the side of the armored zinc alloy case, and the compass bezel, altitude meter and multi-system GPS (GPS, GLONASS, BeiDou, Galileo and QZSS) keep you on track. Take calls from your wrist over Bluetooth, follow your heart rate, sleep and calories, and train with multiple sport modes. The bright 1.43" AMOLED display is easy to read in the sun, the battery lasts 11 to 30 days, and it is rated 3ATM against rain, sweat and splashes.',
    highlights: [
      { value: "GPS", label: "Multi-system" },
      { value: "LED", label: "Flashlight" },
      { value: "Calls", label: "From your wrist" },
      { value: "30d", label: "Battery life" },
    ],
    specs: [
      { group: "Display", label: "Screen", value: '1.43" AMOLED touchscreen' },
      { group: "Display", label: "Shape", value: "Round" },
      { group: "Battery", label: "Capacity", value: "530mAh" },
      { group: "Battery", label: "Battery life", value: "11 to 30 days, depending on use" },
      { group: "Battery", label: "Charging", value: "Magnetic charger" },
      { group: "GPS & outdoor", label: "GPS", value: "Built-in, multi-system (GPS, GLONASS, BeiDou, Galileo, QZSS)" },
      { group: "GPS & outdoor", label: "Flashlight", value: "LED flashlight with 3 light modes" },
      { group: "GPS & outdoor", label: "Navigation", value: "Compass and altitude meter" },
      { group: "Health", label: "Heart rate", value: "Heart rate monitoring from the wrist" },
      { group: "Health", label: "Sleep", value: "Sleep tracking" },
      { group: "Health", label: "Activity", value: "Steps, calories and sedentary reminder" },
      { group: "Sports", label: "Sport modes", value: "Multiple modes, including running, walking, cycling, fitness, climbing and swimming" },
      { group: "Build", label: "Case", value: "Zinc alloy middle frame with armored screws" },
      { group: "Build", label: "Water resistance", value: "3ATM" },
      { group: "Build", label: "Strap", value: "Silicone sport strap, fits 150 to 260 mm wrists" },
      { group: "Smart features", label: "Calls", value: "Bluetooth calls from your wrist" },
      { group: "Smart features", label: "Notifications", value: "Call and message reminders, push notifications" },
      { group: "Smart features", label: "Tools", value: "World time, calendar, calculator, alarm clock" },
      { group: "Smart features", label: "Camera", value: "No camera" },
      { group: "Smart features", label: "Phone app", value: "Works with iPhone and Android" },
    ],
    featureGroups: [
      { title: "Outdoor & navigation", icon: "outdoor", items: ["Multi-system GPS", "LED flashlight, 3 modes", "Compass", "Altitude meter"] },
      { title: "Calls & connect", icon: "smart", items: ["Bluetooth calls", "Call and message reminders", "Push notifications", "Phone app sync"] },
      { title: "Health & sport", icon: "health", items: ["Heart rate", "Sleep tracking", "Calorie tracker", "Multiple sport modes"] },
      { title: "Everyday tools", icon: "tools", items: ["World time", "Calendar", "Calculator", "Alarm clock"] },
    ],
    faq: [
      {
        q: "Does the MATIN Kaldor have a flashlight?",
        a: "Yes. An LED flashlight is built into the side of the case, with 3 light modes for walking at night, camping or working in the dark.",
      },
      {
        q: "Does it have GPS?",
        a: "Yes. Built-in GPS tracks your route, distance and pace, and it uses several satellite systems (GPS, GLONASS, BeiDou, Galileo and QZSS) for a more reliable position. It also has a compass and an altitude meter.",
      },
      {
        q: "Can I take calls on the MATIN Kaldor?",
        a: "Yes. Pair it with your phone over Bluetooth and you can answer and make calls from your wrist.",
      },
      {
        q: "How long does the battery last?",
        a: "11 to 30 days on one charge, depending on how much you use GPS, calls and the flashlight. It charges with a magnetic cable.",
      },
      {
        q: "Is the MATIN Kaldor waterproof?",
        a: "It is rated 3ATM, so rain, sweat, splashes and washing your hands are fine. Do not use it for diving or in hot showers.",
      },
      {
        q: "What is the screen like?",
        a: "A round 1.43 inch AMOLED touchscreen that stays bright and easy to read outdoors.",
      },
      {
        q: "Does shipping cost anything?",
        a: "No. Shipping is free across the USA, and you get a 2 year warranty and 30 day returns.",
      },
    ],
    seoTitle: "MATIN Kaldor Tactical GPS Smartwatch with Flashlight",
    seoDescription:
      'MATIN Kaldor tactical GPS smartwatch for men: LED flashlight, compass, Bluetooth calls, 1.43" AMOLED, heart rate, 30 day battery, 3ATM. Free US shipping.',
    art: { case: "#1c1f26", strap: "#121418", accent: "#e8e04a" },
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
