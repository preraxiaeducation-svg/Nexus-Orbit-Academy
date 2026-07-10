import type { Metadata } from "next";
import React, { Suspense } from "react";
import CoursesClient from "./CoursesClient";
import { buildMetadata, buildBreadcrumbSchema, buildCourseSchema } from "@/config/seo";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description:
    "Explore premium aerospace engineering, AI, space technology, astronomy, and machine learning courses at Nexus Orbit Academy.",
  path: "/courses",
  keywords: ["online STEM education", "AI courses", "aerospace engineering"],
});

export default function CoursesPage() {
  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "Home", url: "/" }, { name: "Courses", url: "/courses" }])} />
      <StructuredData
        data={buildCourseSchema({
          name: "Aerospace Engineering",
          description: "Premium online learning in aerospace engineering, space technology, and future exploration.",
          url: "/courses",
        })}
      />
      <Suspense fallback={<div className="min-h-screen pt-28 pb-20 px-4 sm:px-6" />}>
        <CoursesClient />
      </Suspense>
    </>
  );
}
