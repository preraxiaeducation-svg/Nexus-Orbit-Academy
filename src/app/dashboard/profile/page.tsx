import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Profile
          </h1>
          <p className="text-gray-500 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Your account settings and account information.
          </p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Account Details
            </h2>
            <p className="text-gray-400 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
              Manage your profile and view your account role.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-gray-400 uppercase tracking-[0.18em]">Name</div>
              <div className="text-white">{user?.name ?? session.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 uppercase tracking-[0.18em]">Email</div>
              <div className="text-white">{user?.email ?? session.email}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 uppercase tracking-[0.18em]">Role</div>
              <div className="text-white">{user?.role ?? "STUDENT"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 uppercase tracking-[0.18em]">Joined</div>
              <div className="text-white">
                {user ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
            Profile editing and account settings will be available soon.
          </div>
        </div>
      </div>
    </div>
  );
}
