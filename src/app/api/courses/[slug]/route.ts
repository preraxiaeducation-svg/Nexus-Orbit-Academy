import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getAuthSession();

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          select: {
            id: true,
            chapterTitle: true,
            title: true,
            orderIndex: true,
            durationSeconds: true,
            isPreview: true,
            // Don't expose videoId/notes to unenrolled users
          },
          orderBy: { orderIndex: "asc" },
        },
        exams: { select: { id: true, type: true, title: true, timeLimitMinutes: true } },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Check enrollment status if logged in
    let enrollment = null;
    if (session) {
      enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId: course.id } },
      });
    }

    return NextResponse.json({ course, enrollment });
  } catch (error) {
    console.error("Course detail error:", error);
    return NextResponse.json({ error: "Failed to load course." }, { status: 500 });
  }
}
