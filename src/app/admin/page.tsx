import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Control Center — Nexus Orbit Academy",
  description: "Manage students, courses, and platform analytics.",
};

export default async function AdminPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return <AdminDashboardClient />;
}
