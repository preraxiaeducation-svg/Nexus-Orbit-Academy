import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, profession } = body;

    if (!name || !email || !phone || !profession) {
      return NextResponse.json(
        { error: "Name, email, phone number, and profession are required." },
        { status: 400 }
      );
    }

    const lead = await prisma.studentLead.create({
      data: { name, email, phone, profession },
    });

    return NextResponse.json({
      message: "Registration captured successfully!",
      lead: { id: lead.id, name: lead.name, email: lead.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
