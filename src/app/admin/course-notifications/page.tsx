import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Course Notifications — Nexus Orbit Academy",
  description: "Manage launch notifications for upcoming courses.",
};

export default async function CourseNotificationsPage() {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const notifications = await prisma.courseNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(123,47,247,0.2),_transparent_40%)] px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin</p>
            <h1 className="text-3xl font-semibold" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Course Notifications
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Review waitlist signups for upcoming courses and prepare launch outreach.
            </p>
          </div>
          <a href="/admin" className="btn-secondary px-4 py-2 text-sm">
            ← Back to Dashboard
          </a>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.2em] text-gray-400">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{item.courseTitle}</div>
                      <div className="text-xs text-gray-500">{item.department ?? "—"} · {item.level ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{item.name ?? "—"}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                      <div className="text-xs text-gray-500">{item.phone ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-300">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{item.alreadyRegistered ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
