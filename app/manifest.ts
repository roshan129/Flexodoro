import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flexodoro",
    short_name: "Flexodoro",
    description:
      "Flexible focus timer with adaptive breaks, ambient music, and productivity insights.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6fb",
    theme_color: "#0b6e4f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
