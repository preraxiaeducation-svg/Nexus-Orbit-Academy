import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import crypto from "crypto";

// Create Razorpay or sandbox order
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

    if (course.price === 0) {
      return NextResponse.json({ error: "This course is free." }, { status: 400 });
    }

    const amountPaise = Math.round(course.price * 100);

    // Check if Razorpay keys are configured
    const hasRazorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

    if (hasRazorpay) {
      // Real Razorpay integration
      const keyId = process.env.RAZORPAY_KEY_ID!;
      const keySecret = process.env.RAZORPAY_KEY_SECRET!;

      const orderData = {
        amount: amountPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Razorpay order creation failed");
      }

      const rzOrder = await response.json();

      // Save pending payment record
      const payment = await prisma.payment.create({
        data: {
          userId: session.userId,
          courseId,
          razorpayOrderId: rzOrder.id,
          amount: course.price,
          status: "PENDING",
        },
      });

      return NextResponse.json({
        orderId: rzOrder.id,
        amount: amountPaise,
        currency: "INR",
        keyId,
        paymentId: payment.id,
        sandboxMode: false,
      });
    } else {
      // Sandbox mode: generate a mock order ID
      const sandboxOrderId = `sandbox_order_${crypto.randomUUID()}`;

      const payment = await prisma.payment.create({
        data: {
          userId: session.userId,
          courseId,
          razorpayOrderId: sandboxOrderId,
          amount: course.price,
          status: "PENDING",
        },
      });

      return NextResponse.json({
        orderId: sandboxOrderId,
        amount: amountPaise,
        currency: "INR",
        paymentId: payment.id,
        sandboxMode: true,
        courseName: course.title,
        coursePrice: course.price,
      });
    }
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create payment order." }, { status: 500 });
  }
}
