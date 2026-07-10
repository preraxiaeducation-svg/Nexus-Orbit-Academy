import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import InterestRegistrationsAdminClient from "./InterestRegistrationsAdminClient";

export const metadata: Metadata = {
  title: "Interest Registrations — Nexus Orbit Academy",
  description: "Manage prospect registrations and export insights.",
};

export default async function InterestRegistrationsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return <InterestRegistrationsAdminClient />;
}
