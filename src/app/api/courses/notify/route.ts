import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      courseId: body?.courseId?.toString() || null,
      courseSlug: body?.courseSlug?.toString() || null,
      courseTitle: body?.courseTitle?.toString().trim() || "Untitled Course",
      department: body?.department?.toString().trim() || null,
      level: body?.level?.toString().trim() || null,
      name: body?.name?.toString().trim() || null,
      email: body?.email?.toString().trim() || "",
      phone: body?.phone?.toString().trim() || null,
      alreadyRegistered: Boolean(body?.alreadyRegistered),
    };

    if (!payload.email || !/.+@.+\..+/.test(payload.email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const existing = await prisma.courseNotification.findFirst({
      where: { email: payload.email, courseSlug: payload.courseSlug ?? undefined },
    });

    if (existing) {
      return NextResponse.json({ message: "You’re already on the list for this course." }, { status: 200 });
    }

    const notification = await prisma.courseNotification.create({ data: payload });

    return NextResponse.json(
      { message: "Your interest has been saved. We’ll notify you when the course launches.", notification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Course notification error:", error);
    return NextResponse.json({ error: "Unable to save your notification request right now." }, { status: 500 });
  }
}
