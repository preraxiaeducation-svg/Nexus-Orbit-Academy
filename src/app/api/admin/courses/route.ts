import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/courses — list all courses with enrollment counts
export async function GET() {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { enrollments: true, lessons: true },
        },
      },
    });
    return NextResponse.json({ courses });
  } catch (err) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// POST /api/admin/courses — create a new course
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, slug, description, department, level, price, instructor, isPublished } = body;

    if (!title || !slug || !department || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description: description ?? "",
        department,
        level,
        price: price ?? 0,
        instructor: instructor ?? "Nexus Orbit Faculty",
        isPublished: isPublished ?? false,
      },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

// PATCH /api/admin/courses — toggle publish or update course
export async function PATCH(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { courseId, ...updates } = body;
    if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

    const course = await prisma.course.update({
      where: { id: courseId },
      data: updates,
    });
    return NextResponse.json({ course });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/admin/courses — delete a course
export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  try {
    await prisma.course.delete({ where: { id: courseId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
