import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalRegistrations, todaysRegistrations, departmentStats, countryStats, levelStats] = await Promise.all([
      prisma.interestRegistration.count(),
      prisma.interestRegistration.count({ where: { createdAt: { gte: today } } }),
      prisma.interestRegistration.groupBy({
        by: ["preferredDepartment"],
        _count: { preferredDepartment: true },
      }),
      prisma.interestRegistration.groupBy({
        by: ["country"],
        _count: { country: true },
      }),
      prisma.interestRegistration.groupBy({
        by: ["preferredCourseLevel"],
        _count: { preferredCourseLevel: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalRegistrations,
        todaysRegistrations,
        departmentStats,
        countryStats,
        levelStats,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
