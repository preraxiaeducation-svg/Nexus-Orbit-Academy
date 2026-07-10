import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

// GET: fetch lesson content (enforces enrollment + sequential unlock)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.userId, courseId: lesson.courseId },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course.", code: "NOT_ENROLLED" }, { status: 403 });
    }

    // Check entrance exam passed for non-beginner courses
    if (lesson.course.level !== "BEGINNER" && !enrollment.entranceExamPassed) {
      return NextResponse.json({ error: "Please pass the entrance exam first.", code: "EXAM_REQUIRED" }, { status: 403 });
    }

    // Check sequential unlock: lesson N requires lesson N-1 to be complete
    if (lesson.orderIndex > 1) {
      const prevLesson = await prisma.lesson.findFirst({
        where: { courseId: lesson.courseId, orderIndex: lesson.orderIndex - 1 },
      });

      if (prevLesson) {
        const prevProgress = await prisma.lessonProgress.findUnique({
          where: {
            enrollmentId_lessonId: {
              enrollmentId: enrollment.id,
              lessonId: prevLesson.id,
            },
          },
        });

        if (!prevProgress?.completed) {
          return NextResponse.json({
            error: "Complete the previous lesson first.",
            code: "LOCKED",
            prevLessonTitle: prevLesson.title,
          }, { status: 403 });
        }
      }
    }

    // Get student's progress on this lesson
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId },
      },
    });

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        chapterTitle: lesson.chapterTitle,
        orderIndex: lesson.orderIndex,
        videoId: lesson.videoId,
        videoUrl: lesson.videoUrl,
        durationSeconds: lesson.durationSeconds,
        notes: lesson.notes,
        quiz: lesson.quiz ? JSON.parse(lesson.quiz) : null,
      },
      progress,
    });
  } catch (error) {
    console.error("Lesson GET error:", error);
    return NextResponse.json({ error: "Failed to load lesson." }, { status: 500 });
  }
}
