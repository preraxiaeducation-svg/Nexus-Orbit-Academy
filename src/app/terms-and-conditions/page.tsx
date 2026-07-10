import type { Metadata } from "next";
import { TermsAndConditionsContent } from "@/components/terms/TermsAndConditionsContent";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for using Nexus Orbit Academy’s website, educational services, and public resources.",
  path: "/terms-and-conditions",
  keywords: ["terms and conditions", "course usage", "website policies"],
});

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsContent />;
}
