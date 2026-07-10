import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { DEPARTMENTS } from "@/config/departments";
import { EnrollButton } from "./EnrollButton";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) return { title: "Course Not Found" };
    return { title: course.title, description: course.description };
  } catch {
    return { title: "Course" };
  }
}

export default async function CourseDetailPage({ params }: Params) {
  const { slug } = await params;
  const session = await getAuthSession();

  let course, enrollment, exam;
  try {
    course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { orderBy: { orderIndex: "asc" } },
        exams: { select: { id: true, type: true, title: true, timeLimitMinutes: true } },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course || !course.isPublished) {
      notFound();
    }

    if (session) {
      enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId: course.id } },
      });
    }

    exam = course.exams.find((e: { type: string }) => e.type === "ENTRANCE");
  } catch {
    notFound();
  }

  const dept = DEPARTMENTS.find((d) => d.id === course!.department.toLowerCase());

  // Group lessons by chapter
  const chapterMap = new Map<string, typeof course.lessons>();
  for (const lesson of course!.lessons) {
    if (!chapterMap.has(lesson.chapterTitle)) {
      chapterMap.set(lesson.chapterTitle, []);
    }
    chapterMap.get(lesson.chapterTitle)!.push(lesson);
  }

  const isFree = course!.price === 0;
  const isEnrolled = !!enrollment;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-6 animate-fade-in-up">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
          <Link href="/courses" className="hover:text-gray-300 transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-gray-400">{course!.title}</span>
        </div>

        <div className="glass-card p-10 relative overflow-hidden"
          style={{ border: "1px solid rgba(123,47,247,0.3)", boxShadow: "0 0 80px rgba(123,47,247,0.15)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${dept?.accent ?? "#00d9ff"}18 0%, transparent 70%)` }} />
          <div className="relative">
            <div className="text-5xl mb-4">{dept?.icon ?? "🚀"}</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Coming Soon
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
              We are currently designing and crafting the curriculum for <strong>{course!.title}</strong>. 
              Get Registered today to reserve your spot and receive immediate updates when this course launches!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary px-8 py-3.5 text-sm">
                Get Registered Now
              </Link>
              <Link href="/courses" className="btn-secondary px-8 py-3.5 text-sm">
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
