import type { Metadata } from "next";
import ContactPageContent from "@/components/contact/ContactPageContent";
import { buildFaqSchema, buildMetadata } from "@/config/seo";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Nexus Orbit Academy for course guidance, partnership enquiries, technical support, feedback, and general questions.",
  path: "/contact",
  keywords: ["contact Nexus Orbit Academy", "academy support"],
});

export default function ContactPage() {
  return (
    <>
      <StructuredData data={buildFaqSchema([{ question: "How can I register?", answer: "Use the Get Registered button available throughout the website." }, { question: "Is NASA Explorer free?", answer: "Yes. NASA Explorer provides access to publicly available NASA educational resources." }])} />
      <ContactPageContent />
    </>
  );
}
