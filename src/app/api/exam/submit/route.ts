import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import crypto from "crypto";

// POST: submit exam answers, grade, and issue certificate if final exam
export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { examId, answers, tabSwitches, timeTakenSeconds } = await request.json();

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { course: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found." }, { status: 404 });
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId: exam.courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course." }, { status: 403 });
    }

    // Grade the exam
    const questions = JSON.parse(exam.questions) as Array<{
      id: string;
      type: "MCQ" | "NUMERICAL";
      correct: string | number;
      points: number;
      negMarks: number;
    }>;

    let score = 0;
    let maxScore = 0;
    const gradedAnswers: Record<string, { correct: boolean; earned: number }> = {};

    for (const q of questions) {
      maxScore += q.points;
      const studentAnswer = answers[q.id];

      if (studentAnswer === undefined || studentAnswer === null || studentAnswer === "") {
        gradedAnswers[q.id] = { correct: false, earned: 0 };
        continue;
      }

      const isCorrect =
        q.type === "NUMERICAL"
          ? Math.abs(Number(studentAnswer) - Number(q.correct)) < 0.001
          : String(studentAnswer) === String(q.correct);

      if (isCorrect) {
        score += q.points;
        gradedAnswers[q.id] = { correct: true, earned: q.points };
      } else {
        const deduction = exam.negativeMarking > 0 ? q.negMarks * exam.negativeMarking : 0;
        score = Math.max(0, score - deduction);
        gradedAnswers[q.id] = { correct: false, earned: -deduction };
      }
    }

    const percentScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const passed = percentScore >= exam.passingScore;

    // Save attempt
    const attempt = await prisma.examAttempt.create({
      data: {
        userId: session.userId,
        examId,
        score,
        maxScore,
        passed,
        answers: JSON.stringify(gradedAnswers),
        tabSwitches: tabSwitches ?? 0,
        timeTakenSeconds,
      },
    });

    let certificateId = null;

    if (passed) {
      if (exam.type === "ENTRANCE") {
        // Unlock course content
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { entranceExamPassed: true },
        });
      } else if (exam.type === "FINAL") {
        // Issue certificate
        const certUid = `NOA-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
        const cert = await prisma.certificate.upsert({
          where: { userId_courseId: { userId: session.userId, courseId: exam.courseId } },
          update: {},
          create: {
            userId: session.userId,
            courseId: exam.courseId,
            certificateUid: certUid,
          },
        });
        certificateId = cert.id;
      }
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        score,
        maxScore,
        percentScore: Math.round(percentScore * 10) / 10,
        passed,
        passingScore: exam.passingScore,
      },
      gradedAnswers,
      certificateId,
      examType: exam.type,
    });
  } catch (error) {
    console.error("Exam submit error:", error);
    return NextResponse.json({ error: "Failed to submit exam." }, { status: 500 });
  }
}
