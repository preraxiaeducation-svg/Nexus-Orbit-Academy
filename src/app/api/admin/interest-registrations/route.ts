import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

function buildWhere(search: string, department?: string, level?: string, country?: string) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { mobileNumber: { contains: search, mode: "insensitive" } },
      { preferredDepartment: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
    ];
  }

  if (department) {
    where.preferredDepartment = department;
  }

  if (level) {
    where.preferredCourseLevel = level;
  }

  if (country) {
    where.country = country;
  }

  return where;
}

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const department = searchParams.get("department") ?? "";
  const level = searchParams.get("level") ?? "";
  const country = searchParams.get("country") ?? "";
  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") ?? "desc";

  try {
    const registrations = await prisma.interestRegistration.findMany({
      where: buildWhere(search, department, level, country),
      orderBy: { [sort]: order },
      take: 200,
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await prisma.interestRegistration.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
