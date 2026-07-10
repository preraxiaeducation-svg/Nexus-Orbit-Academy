import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
