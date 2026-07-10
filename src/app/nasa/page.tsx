import type { Metadata } from "next";
import NASAExplorerClient from "./NASAExplorerClient";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "NASA Explorer",
  description: "Explore public NASA resources including APOD, imagery, and Mars rover photos through Nexus Orbit Academy.",
  path: "/nasa",
  keywords: ["NASA Explorer", "NASA learning", "space education"],
});

export default function NASAExplorerPage() {
  return <NASAExplorerClient />;
}
