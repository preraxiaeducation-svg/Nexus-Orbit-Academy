import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { id } = await params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found." }, { status: 404 });
    }

    // Verify student enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.userId,
          courseId: exam.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course." }, { status: 403 });
    }

    // Parse and scrub correct answers / explanations to prevent cheating
    let scrubbedQuestions = [];
    if (exam.questions) {
      try {
        const questions = JSON.parse(exam.questions);
        if (Array.isArray(questions)) {
          scrubbedQuestions = questions.map((q: any) => {
            const { correct, explanation, ...rest } = q;
            return rest;
          });
        }
      } catch (parseError) {
        console.error("Failed to parse exam questions JSON:", parseError);
      }
    }

    return NextResponse.json({
      exam: {
        id: exam.id,
        type: exam.type,
        title: exam.title,
        timeLimitMinutes: exam.timeLimitMinutes,
        passingScore: exam.passingScore,
        questions: scrubbedQuestions,
        course: {
          title: exam.course.title,
          slug: exam.course.slug,
        },
      },
    });
  } catch (error) {
    console.error("Error loading exam:", error);
    return NextResponse.json({ error: "Failed to load exam." }, { status: 500 });
  }
}
