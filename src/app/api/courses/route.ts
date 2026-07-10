import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const level = searchParams.get("level");
  const search = searchParams.get("search");

  try {
    const where: Record<string, unknown> = { isPublished: true };
    if (department) where.department = department.toUpperCase();
    if (level) where.level = level.toUpperCase();
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        department: true,
        level: true,
        price: true,
        thumbnail: true,
        instructor: true,
        durationHours: true,
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: [{ department: "asc" }, { level: "asc" }],
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Courses GET error:", error);
    return NextResponse.json({ courses: [] });
  }
}
