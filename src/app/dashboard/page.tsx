import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { DEPARTMENTS } from "@/config/departments";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  let enrollments: Array<{
    id: string;
    enrolledAt: Date;
    entranceExamPassed: boolean;
    course: {
      id: string;
      title: string;
      slug: string;
      department: string;
      level: string;
      price: number;
    };
    lessonProgress: { completed: boolean }[];
    _count?: { lessonProgress: number };
  }> = [];

  let totalLessonsMap: Map<string, number> = new Map();
  let certificateCount = 0;
  let recentActivity: Array<{ type: string; title: string; date: Date; details?: string }> = [];
  let streakDays = "—";

  try {
    enrollments = await prisma.enrollment.findMany({
      where: { userId: session.userId },
      include: {
        course: {
          select: {
            id: true, title: true, slug: true, department: true, level: true, price: true,
          },
        },
        lessonProgress: { select: { completed: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Get lesson counts for progress calculation
    const courseIds = enrollments.map((e) => e.course.id);
    const lessonCounts = await prisma.lesson.groupBy({
      by: ["courseId"],
      where: { courseId: { in: courseIds } },
      _count: { id: true },
    });
    totalLessonsMap = new Map(lessonCounts.map((l: any) => [l.courseId, l._count.id]));

    // Certificates
    certificateCount = await prisma.certificate.count({ where: { userId: session.userId } });

    // Recent payments
    const payments = await prisma.payment.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Recent exam attempts
    const attempts = await prisma.examAttempt.findMany({
      where: { userId: session.userId },
      orderBy: { attemptedAt: "desc" },
      take: 5,
      include: { exam: { select: { title: true } } },
    });

    recentActivity = [
      ...payments.map((p: any) => ({ type: "payment", title: `Payment ₹${p.amount}`, date: p.createdAt, details: p.status })),
      ...attempts.map((a: any) => ({ type: "exam", title: `Exam: ${a.exam.title}`, date: a.attemptedAt, details: a.passed ? "Passed" : "Failed" })),
    ].sort((a, b) => +b.date - +a.date).slice(0, 6);

    // Streak: days with progress in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentProgress = await prisma.lessonProgress.findMany({
      where: { enrollment: { userId: session.userId }, updatedAt: { gte: sevenDaysAgo } },
      select: { updatedAt: true },
    });
    if (recentProgress.length > 0) {
      const daySet = new Set(recentProgress.map((p: any) => p.updatedAt.toISOString().slice(0, 10)));
      streakDays = String(daySet.size);
    }
  } catch {
    // DB not seeded yet — show empty state
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Welcome back, {session.name.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Continue where you left off or explore new courses.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Enrolled Courses", value: enrollments.length },
            { label: "Completed Lessons", value: enrollments.reduce((a, e) => a + e.lessonProgress.filter((p) => p.completed).length, 0) },
            { label: "Certificates", value: certificateCount },
            { label: "Streak (days)", value: streakDays },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text" style={{ fontFamily: "Orbitron, sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              My Courses
            </h2>
            <Link href="/courses" className="btn-secondary py-2 px-5 text-sm">
              Browse More Courses →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-4">🌌</div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Your learning journey begins here
              </h3>
              <p className="text-gray-500 mb-6 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                Enroll in a free course to get started. No payment needed for beginner courses.
              </p>
              <Link href="/courses" className="btn-primary">Explore Free Courses 🚀</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrollments.map((enrollment) => {
                const dept = DEPARTMENTS.find((d) => d.id === enrollment.course.department.toLowerCase());
                const totalLessons = totalLessonsMap.get(enrollment.course.id) ?? 0;
                const completedLessons = enrollment.lessonProgress.filter((p) => p.completed).length;
                const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                const needsExam = enrollment.course.level !== "BEGINNER" && !enrollment.entranceExamPassed;

                return (
                  <div
                    key={enrollment.id}
                    className={`glass-card ${dept?.hoverGlow ?? ""} p-5 transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{dept?.icon ?? "📚"}</span>
                      {needsExam && (
                        <span className="badge" style={{ background: "rgba(255,184,0,0.15)", color: "#ffb800", border: "1px solid rgba(255,184,0,0.3)" }}>
                          Exam Pending
                        </span>
                      )}
                    </div>

                    <h3 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      {enrollment.course.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`badge badge-${enrollment.course.level.toLowerCase()} text-xs`}>
                        {enrollment.course.level}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        <span>{completedLessons}/{totalLessons} lessons</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {needsExam ? (
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="btn-gold w-full text-center text-sm py-2 block"
                      >
                        Take Entrance Exam
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/course/${enrollment.course.slug}`}
                        className="btn-primary w-full text-center text-sm py-2 block"
                      >
                        {progress > 0 ? "Continue →" : "Start Learning →"}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { href: "/dashboard/certificates", label: "🏆 My Certificates" },
            { href: "/dashboard/profile", label: "👤 Profile" },
            { href: "/dashboard/payments", label: "💳 Payment History" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="glass-card p-4 text-center text-sm text-gray-400 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="glass-card p-6 text-center text-gray-400">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((act, i) => (
                <div key={i} className="glass-card p-4 flex items-start justify-between">
                  <div>
                    <div className="text-sm text-white font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{act.title}</div>
                    {act.details && <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{act.details}</div>}
                  </div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>{new Date(act.date).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
