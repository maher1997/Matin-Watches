import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f1018",
    theme_color: "#0f1018",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
