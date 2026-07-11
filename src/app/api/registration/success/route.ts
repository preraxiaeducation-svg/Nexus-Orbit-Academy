import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processRegistrationSuccess } from "@/app/actions/registrationActions";

/**
 * POST /api/registration/success
 * Process registration success workflow
 * Body: { registrationId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId } = body;

    if (!registrationId || typeof registrationId !== "string") {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    // Verify registration exists
    const registration = await prisma.interestRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Process the registration success workflow
    const result = await processRegistrationSuccess(registrationId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to process registration success",
          registrationId,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: result.data?.message || "Registration processed successfully",
        emailStatus: result.data?.emailStatus || "DISABLED",
        registrationId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration success processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process registration success",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/registration/success?registrationId=xxx
 * Get registration success status
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registrationId");

    if (!registrationId) {
      return NextResponse.json(
        { error: "Registration ID is required" },
        { status: 400 }
      );
    }

    // Get registration success record
    const successRecord = await prisma.registrationSuccess.findUnique({
      where: { interestRegistrationId: registrationId },
    });

    if (!successRecord) {
      return NextResponse.json(
        { error: "Success record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          studentName: successRecord.studentName,
          email: successRecord.email,
          registeredCourse: successRecord.registeredCourse,
          registrationId: successRecord.registrationId,
          emailStatus: successRecord.emailStatus,
          pdfGenerated: successRecord.pdfGenerated,
          registrationCompletedAt: successRecord.registrationCompletedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get registration success error:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve registration success data",
      },
      { status: 500 }
    );
  }
}
