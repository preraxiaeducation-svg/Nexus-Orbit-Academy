import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import CourseBuilderClient from "./CourseBuilderClient";

export const metadata: Metadata = {
  title: "Course Builder — Nexus Orbit Academy Admin",
  description: "Create and manage courses and lessons.",
};

export default async function AdminCoursesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <Suspense fallback={<div className="min-h-screen pt-28 text-center text-gray-400">Loading…</div>}>
      <CourseBuilderClient />
    </Suspense>
  );
}
