"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enroll as enrollRequest, createOrder, verifyPayment } from "@/lib/paymentClient";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  price: number;
  level: string;
  isEnrolled: boolean;
  entranceExamPassed: boolean;
  entranceExamId?: string;
  isLoggedIn: boolean;
}

export function EnrollButton({
  courseId,
  courseSlug,
  price,
  level,
  isEnrolled,
  entranceExamPassed,
  entranceExamId,
  isLoggedIn,
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxData, setSandboxData] = useState<{
    orderId: string;
    paymentId: string;
    courseName: string;
    coursePrice: number;
  } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Link href={`/register?from=/courses/${courseSlug}`} className="btn-primary w-full text-center py-3 block">
        Register to Enroll
      </Link>
    );
  }

  if (isEnrolled) {
    if (level !== "BEGINNER" && !entranceExamPassed && entranceExamId) {
      return (
        <div className="space-y-3">
          <div className="p-3 rounded-xl text-xs text-center text-amber-400"
            style={{ background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.2)", fontFamily: "Inter, sans-serif" }}>
            ⚠ Pass the entrance exam to unlock course content
          </div>
          <Link href={`/dashboard/exam/${entranceExamId}`} className="btn-gold w-full text-center block">
            Take Entrance Exam →
          </Link>
          <Link href={`/dashboard`} className="btn-secondary w-full text-center block text-sm">
            Go to Dashboard
          </Link>
        </div>
      );
    }
    return (
      <Link href={`/dashboard/course/${courseSlug}`} className="btn-primary w-full text-center py-3 block">
        Continue Learning →
      </Link>
    );
  }

  const handleFreeEnroll = async () => {
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await enrollRequest(courseId);
      if (!ok) throw new Error(data?.error || "Failed to enroll.");
      router.push(`/dashboard/course/${courseSlug}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to enroll.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaidEnroll = async () => {
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await createOrder(courseId);
      if (!ok) throw new Error(data?.error || "Payment setup failed.");

      if (data.sandboxMode) {
        setSandboxData({
          orderId: data.orderId,
          paymentId: data.paymentId,
          courseName: data.courseName,
          coursePrice: data.coursePrice,
        });
        setShowSandbox(true);
      } else {
        // Real Razorpay
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        script.onload = () => {
          const rzp = new (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay({
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            order_id: data.orderId,
            name: "Nexus Orbit Academy",
            description: "Course Enrollment",
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              const { ok: vOk } = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId: data.paymentId,
                sandboxMode: false,
              });
              if (vOk) {
                router.push(`/dashboard/course/${courseSlug}`);
                router.refresh();
              }
            },
          });
          rzp.open();
        };
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment setup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxConfirm = async () => {
    if (!sandboxData) return;
    setLoading(true);
    try {
      const { ok, data } = await verifyPayment({ paymentId: sandboxData.paymentId, sandboxMode: true });
      if (ok) {
        setShowSandbox(false);
        if (data?.entranceExamId) {
          router.push(`/dashboard/exam/${data.entranceExamId}`);
        } else {
          router.push(`/dashboard/course/${courseSlug}`);
        }
        router.refresh();
      }
    } catch {
      setError("Sandbox payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-lg text-xs text-red-400"
          style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", fontFamily: "Inter, sans-serif" }}>
          {error}
        </div>
      )}

      {showSandbox && sandboxData ? (
        <div className="space-y-3">
          <div className="p-4 rounded-xl text-center"
            style={{ background: "rgba(255,184,0,0.08)", border: "2px dashed rgba(255,184,0,0.3)" }}>
            <div className="text-amber-400 font-bold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
              🧪 Sandbox Mode
            </div>
            <p className="text-gray-400 text-xs mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
              No Razorpay keys configured. Click below to simulate a ₹{sandboxData.coursePrice} payment.
            </p>
            <button
              onClick={handleSandboxConfirm}
              disabled={loading}
              className="btn-gold w-full"
            >
              ✓ Confirm Test Payment — ₹{sandboxData.coursePrice}
            </button>
            <button
              onClick={() => setShowSandbox(false)}
              className="text-xs text-gray-500 hover:text-gray-300 mt-2 block mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : price === 0 ? (
        <button
          onClick={handleFreeEnroll}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? "Enrolling…" : "Enroll Free — Start Now 🚀"}
        </button>
      ) : (
        <button
          onClick={handlePaidEnroll}
          disabled={loading}
          className="btn-gold w-full py-3"
        >
          {loading ? "Setting up…" : `Enroll for ₹${price}`}
        </button>
      )}

      {level !== "BEGINNER" && (
        <p className="text-xs text-gray-600 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
          Requires passing an entrance exam after enrollment
        </p>
      )}
    </div>
  );
}
