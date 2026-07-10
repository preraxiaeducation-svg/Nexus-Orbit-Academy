import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalCertificates,
      totalRevenue,
      recentUsers,
      recentPayments,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
      prisma.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.payment.findMany({
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalCertificates,
        totalRevenue: totalRevenue._sum.amount ?? 0,
      },
      recentUsers,
      recentPayments,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
