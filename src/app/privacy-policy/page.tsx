import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/privacy/PrivacyPolicyContent";
import { buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Nexus Orbit Academy’s privacy policy explains how we collect, use, store, and protect information for learners and visitors.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "academy privacy"],
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
