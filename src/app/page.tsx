import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ACADEMY_NAME, ACADEMY_TAGLINE, ACADEMY_DESCRIPTION } from "@/config/branding";
import { buildMetadata, buildBreadcrumbSchema, buildOrganizationSchema, buildWebSiteSchema } from "@/config/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { DEPARTMENTS } from "@/config/departments";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `Learn Aerospace, AI & Space Technology`,
    description:
      "Nexus Orbit Academy offers aerospace engineering, AI, space technology, astronomy, and future learning programs for ambitious learners.",
    path: "/",
    keywords: ["Aerospace Engineering", "Space Technology", "NASA Explorer", "Future Learning"],
  }),
};

async function getFeaturedCourses() {
  try {
    return await prisma.course.findMany({
      where: { isPublished: true, level: "BEGINNER" },
      take: 4,
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return [];
  }
}

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Aerospace Engineering Student",
    avatar: "PS",
    text: "The rocket propulsion course is incredible — MIT-level depth with real mission case studies. I got placed at ISRO after completing the advanced module.",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "ML Engineer",
    avatar: "AM",
    text: "The AI Research & Engineering course pushed me beyond my limits in the best way. The AI tutor actually understands the lesson context — it's like having a personal mentor.",
    stars: 5,
  },
  {
    name: "Sofia Chen",
    role: "Astrophysics Enthusiast",
    avatar: "SC",
    text: "From Big Bang Theory to dark matter — all in one course. The cosmology modules are the most engaging science content I've ever consumed.",
    stars: 5,
  },
];

const STATS = [
  { value: "12+", label: "Courses" },
  { value: "4", label: "Departments" },
  {
    value: "Entrance Exam",
    label: "for Advanced Courses",
    description: "Required to unlock Intermediate and Advanced learning paths.",
  },
  { value: "Verified", label: "Certificates" },
];

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses();

  return (
    <div className="pt-24">
      <StructuredData data={buildOrganizationSchema()} />
      <StructuredData data={buildWebSiteSchema()} />
      <StructuredData data={buildBreadcrumbSchema([{ name: "Home", url: "/" }])} />
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-5xl mx-auto animate-fade-in-up">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm"
            style={{ color: "#00d9ff", fontFamily: "Inter, sans-serif", borderColor: "rgba(0,217,255,0.2)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Public Beta
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-tight"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            <span className="gradient-text">Reach</span>{" "}
            <span className="text-white">Beyond</span>
            <br />
            <span className="text-white">The </span>
            <span className="gradient-text-gold">Stars</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Master Aerospace Engineering, AI & Space Technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/courses" className="btn-primary text-base px-8 py-4">
              Explore Courses
            </Link>
            <Link href="/register" className="btn-secondary text-base px-8 py-4">
              Get Registered
            </Link>
          </div>

          <div className="glass-card max-w-2xl mx-auto mb-10 p-5 text-center">
            <div className="text-sm font-semibold text-cyan-300 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
              🚀 Public Beta
            </div>
            <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Nexus Orbit Academy is currently in Public Beta. We&apos;re continuously improving the platform. Your feedback helps us build a better learning experience.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div
                  className="text-2xl font-bold gradient-text"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  {stat.label}
                </div>
                {stat.description ? (
                  <div className="text-[10px] text-gray-600 mt-1 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    {stat.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Floating orbit decoration */}
        <div className="absolute animate-float pointer-events-none hidden lg:block"
          style={{ right: "8%", top: "25%", opacity: 0.15 }}>
          <div className="w-64 h-64 rounded-full border border-purple-500/40"
            style={{ boxShadow: "0 0 60px rgba(123,47,247,0.2)" }} />
          <div className="absolute inset-8 rounded-full border border-cyan-500/30" />
          <div className="absolute inset-16 rounded-full border border-amber-500/20" />
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🪐</div>
        </div>
      </section>

      {/* ── DEPARTMENTS ──────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading">Four Frontiers of Knowledge</h2>
            <p className="section-subheading mx-auto mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
              Dive deep into humanity&apos;s most exciting scientific frontiers — from building rockets
              to unravelling the universe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEPARTMENTS.map((dept, i) => (
              <Link
                key={dept.id}
                href={`/courses?department=${dept.id}`}
                className={`glass-card ${dept.hoverGlow} p-6 group block transition-all duration-300`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`text-4xl mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  {dept.icon}
                </div>
                <h3
                  className="text-white font-bold text-base mb-2"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {dept.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  {dept.description}
                </p>
                <div
                  className="text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: dept.accent, fontFamily: "Inter, sans-serif" }}
                >
                  Explore courses →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE COURSES ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="section-heading">Start Free Today</h2>
              <p className="text-gray-500 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                No credit card required. Begin your journey with our beginner courses.
              </p>
            </div>
            <Link href="/courses?level=BEGINNER" className="btn-secondary whitespace-nowrap">
              View All Free →
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredCourses.map((course: any, i: number) => {
                const dept = DEPARTMENTS.find((d) => d.id === course.department);
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className={`glass-card ${dept?.hoverGlow ?? ""} p-5 block group transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{dept?.icon ?? "📚"}</span>
                      <span className="badge badge-free">FREE</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="badge badge-beginner">Beginner</span>
                      <span className="text-xs text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                        {course.durationHours ?? "—"} hrs
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Placeholder cards when DB not seeded */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.id}
                  href={`/courses?department=${dept.id}&level=BEGINNER`}
                  className={`glass-card ${dept.hoverGlow} p-5 block group transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{dept.icon}</span>
                    <span className="badge badge-free">FREE</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    {dept.id === "aerospace" && "Foundations & Flight Physics"}
                    {dept.id === "ai_ml" && "Machine Learning Foundations"}
                    {dept.id === "space_tech" && "Introduction to Space Technology"}
                    {dept.id === "universe" && "Astronomy: Stars & Galaxies"}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    {dept.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-beginner">Beginner</span>
                    <span className="text-xs text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>Free</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading">Your Learning Journey</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "🎓",
                title: "Register & Browse",
                desc: "Create a free account and explore all 12+ courses. Beginner courses start immediately — no payment needed.",
                color: "#00d9ff",
              },
              {
                step: "02",
                icon: "📝",
                title: "Pass the Entrance Exam",
                desc: "For Intermediate & Advanced courses, prove your fundamentals with our IIT-style MCQ entrance exam before unlocking content.",
                color: "#7b2ff7",
              },
              {
                step: "03",
                icon: "🏆",
                title: "Earn Your Certificate",
                desc: "Complete all lessons, pass the final exam, and receive a verified, QR-coded certificate to share with employers.",
                color: "#ffb800",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 text-center relative overflow-hidden group">
                <div
                  className="text-5xl font-black absolute top-4 right-4 opacity-5"
                  style={{ fontFamily: "Orbitron, sans-serif", color: item.color }}
                >
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3
                  className="text-white font-bold text-base mb-3"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      {/* <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading">What Students Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} style={{ color: "#ffb800" }}>★</span>
                  ))}
                </div>
                <p
                  className="text-gray-400 text-sm leading-relaxed mb-5 italic"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7b2ff7, #00d9ff)" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-600 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="glass-card p-12 relative overflow-hidden"
            style={{ border: "1px solid rgba(123,47,247,0.3)", boxShadow: "0 0 80px rgba(123,47,247,0.15)" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(123,47,247,0.12) 0%, transparent 70%)" }} />
            <div className="relative">
              <h2 className="section-heading mb-4">Ready for Launch? 🚀</h2>
              <p className="text-gray-400 mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                Join thousands of students exploring the universe of knowledge.
                Start with a free course today — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn-primary px-10 py-4 text-base">
                  Create Free Account
                </Link>
                <Link href="/courses" className="btn-secondary px-10 py-4 text-base">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
