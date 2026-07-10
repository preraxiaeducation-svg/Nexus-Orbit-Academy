import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/lessons?courseId=xxx
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 });

  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ lessons });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// POST /api/admin/lessons — create lesson
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { courseId, chapterTitle, title, orderIndex, notes, videoUrl, isPreview } = body;
    if (!courseId || !title || !chapterTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        chapterTitle,
        title,
        orderIndex: orderIndex ?? 1,
        notes: notes ?? "",
        videoUrl: videoUrl ?? null,
        isPreview: isPreview ?? false,
      },
    });
    return NextResponse.json({ lesson }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

// PATCH /api/admin/lessons — update lesson
export async function PATCH(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { lessonId, ...updates } = body;
    if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updates,
    });
    return NextResponse.json({ lesson });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/admin/lessons — delete lesson
export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { lessonId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  try {
    await prisma.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
