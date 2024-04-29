import type { MetadataRoute } from "next";

export default function manifest() {
  return json;
}

const json = {
  name: "Anirohi",
  short_name: "Anirohi",
  description: "Ad-free Anime streaming site built with Nextjs 14",
  theme_color: "#FFFFFF",
  background_color: "#FFFFFF",
  display: "standalone",
  orientation: "portrait",
  id: "/",
  scope: "/",
  start_url: "/",
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
} satisfies MetadataRoute.Manifest;
