import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/users — list all students with enrollment/cert counts
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 20;

  try {
    const where = search
      ? {
          role: "STUDENT",
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : { role: "STUDENT" };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true,
              certificates: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, limit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

// DELETE /api/admin/users — delete a student
export async function DELETE(req: NextRequest) {
  const session = await getAuthSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  try {
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
