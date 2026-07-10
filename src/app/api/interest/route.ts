import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      fullName: body?.fullName?.toString().trim() ?? "",
      gender: body?.gender?.toString().trim() ?? "",
      dateOfBirth: body?.dateOfBirth?.toString().trim() ?? "",
      nationality: body?.nationality?.toString().trim() ?? "",
      email: body?.email?.toString().trim() ?? "",
      mobileNumber: body?.mobileNumber?.toString().trim() ?? "",
      country: body?.country?.toString().trim() ?? "",
      state: body?.state?.toString().trim() ?? "",
      city: body?.city?.toString().trim() ?? "",
      highestQualification: body?.highestQualification?.toString().trim() ?? "",
      schoolCollege: body?.schoolCollege?.toString().trim() ?? "",
      preferredDepartment: body?.preferredDepartment?.toString().trim() ?? "",
      preferredCourseLevel: body?.preferredCourseLevel?.toString().trim() ?? "",
      preferredLanguage: body?.preferredLanguage?.toString().trim() ?? "",
    };

    const requiredFields = Object.entries(payload).filter(([, value]) => !value);
    if (requiredFields.length) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const registration = await prisma.interestRegistration.create({ data: payload });

    return NextResponse.json({ message: "Interest registered successfully.", registration }, { status: 201 });
  } catch (error) {
    console.error("Interest registration error:", error);
    return NextResponse.json({ error: "Unable to save registration right now." }, { status: 500 });
  }
}
