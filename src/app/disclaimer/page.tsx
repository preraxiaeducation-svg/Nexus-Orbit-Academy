import type { Metadata } from "next";
import { DisclaimerContent } from "@/components/disclaimer/DisclaimerContent";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Read Nexus Orbit Academy’s disclaimer covering educational use, third-party APIs, AI features, external links, and platform limitations.",
  path: "/disclaimer",
  keywords: ["disclaimer", "educational disclaimer", "AI services disclaimer"],
});

export default function DisclaimerPage() {
  return <DisclaimerContent />;
}
