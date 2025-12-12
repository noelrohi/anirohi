import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anirohi - Stream Anime Free",
    short_name: "Anirohi",
    description:
      "Watch your favorite anime series and movies in HD quality. Stream the latest episodes and discover new shows.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#06b6d4",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
