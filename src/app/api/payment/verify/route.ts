import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId,
      sandboxMode,
    } = await request.json();

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.userId !== session.userId) {
      return NextResponse.json({ error: "Invalid payment record." }, { status: 400 });
    }

    if (!sandboxMode && process.env.RAZORPAY_KEY_SECRET) {
      // Verify Razorpay signature
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: { status: "FAILED" },
        });
        return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
      }
    }

    // Mark payment successful
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: sandboxMode ? `sandbox_pay_${Date.now()}` : razorpayPaymentId,
      },
    });

    // Auto-enroll
    const course = await prisma.course.findUnique({ where: { id: payment.courseId } });
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.userId, courseId: payment.courseId } },
      update: {},
      create: {
        userId: session.userId,
        courseId: payment.courseId,
        entranceExamPassed: course?.level === "BEGINNER",
      },
    });

    // Find entrance exam if applicable
    let entranceExamId = null;
    if (course && course.level !== "BEGINNER") {
      const exam = await prisma.exam.findFirst({
        where: { courseId: payment.courseId, type: "ENTRANCE" },
      });
      entranceExamId = exam?.id;
    }

    return NextResponse.json({
      message: "Payment verified and enrollment confirmed!",
      enrollment,
      entranceExamId,
      requiresExam: course?.level !== "BEGINNER",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Payment verification failed." }, { status: 500 });
  }
}
