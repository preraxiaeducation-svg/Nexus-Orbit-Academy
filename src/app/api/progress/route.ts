import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

// POST: update lesson progress (watch %, quiz pass)
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { lessonId, watchPercent, quizPassed } = await request.json();

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId: lesson.courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled." }, { status: 403 });
    }

    const existing = await prisma.lessonProgress.findUnique({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    });

    // Calculate completion:
    // Video must be ≥90% watched; quiz must be passed (if one exists)
    const hasQuiz = !!lesson.quiz;
    const newWatchPercent = Math.max(existing?.watchPercent ?? 0, watchPercent ?? 0);
    const newQuizPassed = existing?.quizPassed || (quizPassed ?? false);
    const videoCompleted = newWatchPercent >= 90;
    const completed = videoCompleted && (!hasQuiz || newQuizPassed);

    const progress = await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: {
        watchPercent: newWatchPercent,
        videoCompleted,
        quizPassed: newQuizPassed,
        completed,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        watchPercent: newWatchPercent,
        videoCompleted,
        quizPassed: newQuizPassed,
        completed,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Failed to update progress." }, { status: 500 });
  }
}
