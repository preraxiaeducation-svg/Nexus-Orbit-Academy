import type { MetadataRoute } from "next";
import { ACADEMY_DESCRIPTION, ACADEMY_NAME, SQUARE_LOGO_PATH, ICON_LOGO_PATH } from "@/config/branding";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ACADEMY_NAME,
    short_name: "Nexus Orbit",
    description: ACADEMY_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#060814",
    theme_color: "#060814",
    icons: [
      {
        src: ICON_LOGO_PATH,
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: SQUARE_LOGO_PATH,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logos/primary-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
