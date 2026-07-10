import type { Metadata } from "next";
import AboutPageContent from "@/components/about/AboutPageContent";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Learn about Nexus Orbit Academy, a futuristic platform for aerospace, AI, space technology, and universe education.",
  path: "/about",
  keywords: ["about Nexus Orbit Academy", "future learning academy"],
});

export default function AboutPage() {
  return <AboutPageContent />;
}
