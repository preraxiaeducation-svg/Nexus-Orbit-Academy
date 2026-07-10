import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { courseId } = await request.json();

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId } },
    });
    if (existing) {
      return NextResponse.json({ message: "Already enrolled.", enrollment: existing });
    }

    // For paid courses, verify payment first
    if (course.price > 0) {
      const payment = await prisma.payment.findFirst({
        where: {
          userId: session.userId,
          courseId,
          status: "SUCCESS",
        },
      });
      if (!payment) {
        return NextResponse.json(
          { error: "Payment required to enroll in this course.", requiresPayment: true },
          { status: 402 }
        );
      }
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.userId,
        courseId,
        // Beginners don't need entrance exam
        entranceExamPassed: course.level === "BEGINNER",
      },
    });

    return NextResponse.json({
      message: "Enrolled successfully!",
      enrollment,
      requiresExam: course.level !== "BEGINNER",
    });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json({ error: "Enrollment failed." }, { status: 500 });
  }
}
