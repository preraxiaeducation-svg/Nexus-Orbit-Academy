import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { certificateUid: id },
    include: {
      course: { select: { title: true, slug: true, level: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  return NextResponse.json({ certificate });
}
