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
  "matin-kaldor": "Nights out, trails and navigation",
  "matin-varkon": "GPS, calls and tough jobs",
};

// The short card on the home page.
export const homeRows: Record<
  LineupSlug,
  {
    screen: string;
    gps: string;
    calls: string;
    battery: string;
    water: string;
    sports: string;
    build: string;
  }
> = {
  "matin-trekon": {
    screen: '1.95" AMOLED, square',
    gps: "Yes",
    calls: "Call alerts",
    battery: "11 to 30 days, 1000mAh",
    water: "3ATM",
    sports: "170+",
    build: "Zinc alloy case",
  },
  "matin-torvan": {
    screen: '1.43" AMOLED, round',
    gps: "No",
    calls: "Yes, from your wrist",
    battery: "About 14 days (30 saving), 550mAh",
    water: "5ATM, IP69K",
    sports: "9",
    build: "316L steel case, sapphire glass, flashlight",
  },
  "matin-kaldor": {
    screen: '1.43" AMOLED, round',
    gps: "Yes, multi-system",
    calls: "Yes, from your wrist",
    battery: "7 to 15 days, 530mAh",
    water: "3ATM",
    sports: "30+",
    build: "Zinc alloy case, flashlight",
  },
  "matin-varkon": {
    screen: '1.43" AMOLED, round, 1000 nits',
    gps: "Yes, 6 systems",
    calls: "Yes, from your wrist",
    battery: "About 12 days (30 saving), 500mAh",
    water: "5ATM, IP69K",
    sports: "170+",
    build: "316L steel case, flashlight",
  },
};

export const homeRowLabels: [keyof (typeof homeRows)[LineupSlug], string][] = [
  ["screen", "Screen"],
  ["gps", "GPS"],
  ["calls", "Bluetooth calls"],
  ["battery", "Battery"],
  ["water", "Water rating"],
  ["sports", "Sport modes"],
  ["build", "Build"],
];

const NO = "—";

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
        values: ["20 days", "14 days", "7 days", "12 days"],
      },
      {
        label: "Light use or power saving",
        values: ["30 days", "30 days", "15 days", "30 days"],
      },
      { label: "Heavy use", values: ["11 days", "6 days", NO, "5 days"] },
      { label: "Capacity", values: ["1000mAh", "550mAh", "530mAh", "500mAh"] },
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
        values: [
          "Built-in",
          "No",
          "Built-in, 5 systems",
          "Built-in, 6 systems",
        ],
      },
      { label: "Compass", values: ["Yes", NO, "Yes", "Yes"] },
      {
        label: "Altitude",
        values: [
          "Altitude meter",
          NO,
          "Altitude meter",
          "Barometric altimeter",
        ],
      },
      {
        label: "Flashlight",
        values: ["No", "LED flashlight", "LED, 3 modes", "Yes"],
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
          "Continuous, every minute",
          "Yes",
          "Yes, with high and low alerts",
        ],
      },
      { label: "Blood oxygen (SpO2)", values: ["No", "Yes", "No", "Yes"] },
      {
        label: "Sleep",
        values: ["Yes", "Sleep score", "Yes", "Sleep and naps"],
      },
    ],
  },
  {
    title: "Sports",
    rows: [
      { label: "Sport modes", values: ["170+", "9", "30+", "170+"] },
      {
        label: "Swim tracking",
        values: [NO, NO, "Pool and open water", "Pool and open water"],
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
          "Zinc alloy, armored screws",
          "316L stainless steel",
        ],
      },
      {
        label: "Water and dust",
        values: ["3ATM", "5ATM and IP69K", "3ATM", "5ATM and IP69K"],
      },
      {
        label: "Size",
        values: [
          NO,
          "49.2 x 49.2 x 13.6 mm",
          "49 mm wide, 13.9 mm thick",
          "49 x 49 x 14 mm",
        ],
      },
    ],
  },
];
