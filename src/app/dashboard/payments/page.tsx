import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment History",
};

function statusLabel(status: string) {
  if (status === "SUCCESS") return "Paid";
  if (status === "PENDING") return "Pending";
  return "Failed";
}

export default async function PaymentsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const payments = await prisma.payment.findMany({
    where: { userId: session.userId },
    include: {
      course: {
        select: { title: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Payment History
          </h1>
          <p className="text-gray-500 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Track your purchase history and payment status across enrolled courses.
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Nothing to show here yet
            </h3>
            <p className="text-gray-500 mb-6 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              Pay for a premium course to see your transactions here.
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Paid Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="glass-card p-6 grid gap-4 sm:grid-cols-[1fr_auto] items-center">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{payment.currency}</span>
                  </div>

                  <h2 className="text-lg text-white font-semibold" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    {payment.course?.title ?? "Course payment"}
                  </h2>
                  <div className="text-sm text-gray-400 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Amount: ₹{payment.amount.toFixed(0)}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <span className={`badge ${payment.status === "SUCCESS" ? "badge-paid" : payment.status === "PENDING" ? "badge-free" : "badge-advanced"}`}>
                    {statusLabel(payment.status)}
                  </span>
                  {payment.course?.slug && (
                    <Link href={`/courses/${payment.course.slug}`} className="btn-secondary w-full text-sm py-2 block">
                      View Course
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
