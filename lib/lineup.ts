// The four real watches side by side. Every value is copied from the spec
// sheet in lib/products.ts; "—" means the watch does not have it (or the
// supplier does not list it), so the comparison never claims more than the
// product pages do.

export const lineupSlugs = [
  "matin-trekon",
  "matin-torvan",
  "matin-kaldor",
  "matin-varkon",
] as const;
export type LineupSlug = (typeof lineupSlugs)[number];

export const bestFor: Record<LineupSlug, string> = {
  "matin-trekon": "Long trips and training",
  "matin-torvan": "Calls, health and everyday wear",
  "matin-kaldor": "Trails, swimming and navigation",
  "matin-varkon": "GPS, calls and tough jobs",
};

const NO = "—";

type Row = { label: string; values: [string, string, string, string] };

// The short table on the home page: what most buyers choose on.
export const keyRows: Row[] = [
  {
    label: "Screen",
    values: [
      '1.95" square AMOLED',
      '1.43" round AMOLED',
      '1.43" round AMOLED',
      '1.43" round AMOLED',
    ],
  },
  { label: "GPS", values: ["Yes", "No", "Yes, dual-frequency, 5 systems", "Yes, 6 systems"] },
  {
    label: "Bluetooth calls",
    values: ["Call alerts only", "Yes", "Yes", "Yes"],
  },
  { label: "Flashlight", values: ["No", "Yes", "Yes", "Yes"] },
  { label: "Blood oxygen (SpO2)", values: ["No", "Yes", "Yes", "Yes"] },
  {
    label: "Battery, typical use",
    values: ["20 days", "14 days", "10 days", "12 days"],
  },
  {
    label: "Battery, longest",
    values: ["30 days", "30 days", "15 days", "30 days"],
  },
  {
    label: "Water rating",
    values: ["3ATM", "5ATM + IP69K", "5ATM", "5ATM + IP69K"],
  },
  { label: "Sport modes", values: ["170+", "9", "100+", "170+"] },
  {
    label: "Case",
    values: ["Zinc alloy", "316L steel", "Zinc alloy", "316L steel"],
  },
];

// The full table on /compare: groups of rows, one value per watch in the
// order of lineupSlugs.
export const compareGroups: {
  title: string;
  rows: { label: string; values: [string, string, string, string] }[];
}[] = [
  {
    title: "Display",
    rows: [
      {
        label: "Screen",
        values: [
          '1.95" AMOLED',
          '1.43" AMOLED',
          '1.43" AMOLED',
          '1.43" AMOLED',
        ],
      },
      { label: "Shape", values: ["Square", "Round", "Round", "Round"] },
      {
        label: "Resolution",
        values: [NO, "466 x 466", "466 x 466", "466 x 466"],
      },
      {
        label: "Brightness",
        values: [NO, "Up to 1000 nits", NO, "Up to 1000 nits"],
      },
      { label: "Glass", values: [NO, "Sapphire", NO, "Gorilla Glass"] },
    ],
  },
  {
    title: "Battery",
    rows: [
      {
        label: "Typical use",
        values: ["20 days", "14 days", "10 days", "12 days"],
      },
      {
        label: "Light use or power saving",
        values: ["30 days", "30 days", "15 days", "30 days"],
      },
      { label: "Heavy use", values: ["11 days", "6 days", "5 days", "5 days"] },
      { label: "Capacity", values: ["1000mAh", "550mAh", "670mAh", "500mAh"] },
      {
        label: "Charging",
        values: [
          "Magnetic",
          "Magnetic, about 1.5 h",
          "Magnetic",
          "Magnetic, about 1.5 h",
        ],
      },
    ],
  },
  {
    title: "GPS and outdoor",
    rows: [
      {
        label: "GPS",
        values: ["Yes", "No", "Yes, dual-frequency, 5 systems", "Yes, 6 systems"],
      },
      { label: "Compass", values: ["Yes", NO, "Yes", "Yes"] },
      {
        label: "Altitude",
        values: [
          "Altitude meter",
          NO,
          "Barometric altimeter",
          "Barometric altimeter",
        ],
      },
      {
        label: "Flashlight",
        values: ["No", "Yes, LED", "Yes, LED", "Yes"],
      },
    ],
  },
  {
    title: "Health",
    rows: [
      {
        label: "Heart rate",
        values: [
          "Yes",
          "Yes, every minute",
          "Yes, plus HRV and stress",
          "Yes, with high and low alerts",
        ],
      },
      { label: "Blood oxygen (SpO2)", values: ["No", "Yes", "Yes", "Yes"] },
      {
        label: "Sleep",
        values: ["Yes", "Yes, with sleep score", "Yes, 24/7", "Yes, with naps"],
      },
    ],
  },
  {
    title: "Sports",
    rows: [
      { label: "Sport modes", values: ["170+", "9", "100+", "170+"] },
      {
        label: "Swim tracking",
        values: [NO, NO, "Pool swimming", "Pool and open water"],
      },
    ],
  },
  {
    title: "Calls and smart features",
    rows: [
      {
        label: "Bluetooth calls",
        values: [
          "Call alerts only",
          "Yes, from your wrist",
          "Yes, from your wrist",
          "Yes, from your wrist",
        ],
      },
      {
        label: "Notifications",
        values: [
          "Calls, messages, apps",
          "Calls, messages, email, apps",
          "Calls, messages, apps",
          "Calls, SMS, apps",
        ],
      },
      {
        label: "Phone app",
        values: [
          "iPhone and Android",
          "iPhone and Android",
          "iPhone and Android",
          "iPhone and Android",
        ],
      },
    ],
  },
  {
    title: "Build",
    rows: [
      {
        label: "Case",
        values: [
          "Zinc alloy",
          "316L stainless steel",
          "Zinc alloy middle frame",
          "316L stainless steel",
        ],
      },
      {
        label: "Water and dust",
        values: ["3ATM", "5ATM and IP69K", "5ATM", "5ATM and IP69K"],
      },
      {
        label: "Size",
        values: [
          NO,
          "49.2 x 49.2 x 13.6 mm",
          NO,
          "49 x 49 x 14 mm",
        ],
      },
    ],
  },
];
