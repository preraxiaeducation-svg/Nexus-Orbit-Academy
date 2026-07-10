import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

function buildWhere(search: string, status?: string, department?: string, level?: string) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { courseTitle: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) where.status = status;
  if (department) where.department = department;
  if (level) where.level = level;

  return where;
}

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const department = searchParams.get("department") ?? "";
  const level = searchParams.get("level") ?? "";

  try {
    const notifications = await prisma.courseNotification.findMany({
      where: buildWhere(search, status, department, level),
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ notifications });
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

    await prisma.courseNotification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
