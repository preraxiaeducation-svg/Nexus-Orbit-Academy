"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DEPARTMENTS } from "@/config/departments";
import { NotifyMeModal } from "@/components/courses/NotifyMeModal";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  department: string;
  level: string;
  price: number;
  thumbnail: string | null;
  instructor: string;
  durationHours: number | null;
  _count: { lessons: number; enrollments: number };
}

const LEVEL_ORDER = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };

export default function CoursesClient() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState(searchParams.get("department") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [search, setSearch] = useState("");
  const [notifyCourse, setNotifyCourse] = useState<{
    id?: string;
    slug?: string;
    title: string;
    department?: string;
    level?: string;
  } | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (department) params.set("department", department);
      if (level) params.set("level", level);
      if (search) params.set("search", search);

      const res = await fetch(`/api/courses?${params}`);
      const data = await res.json();
      setCourses(data.courses || []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [department, level, search]);

  useEffect(() => {
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  const getDept = (id: string) =>
    DEPARTMENTS.find((d) => d.id === id.toLowerCase());

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-heading">Course Catalog</h1>
          <p className="section-subheading mx-auto mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
            International-standard, chapter-wise courses across four frontier departments.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-5 mb-10 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            id="course-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="input-field max-w-xs"
            style={{ padding: "10px 14px", fontSize: "0.875rem" }}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDepartment("")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${!department ? "btn-primary py-2" : "btn-secondary py-2"}`}
            >
              All Departments
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setDepartment(department === dept.id ? "" : dept.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${department === dept.id ? "btn-primary py-2" : "btn-secondary py-2"}`}
              >
                {dept.icon} {dept.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-auto">
            { ["", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${level === l
                  ? "glass-card border-purple-500/40 text-white"
                  : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {l || "All Levels"}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="orbit-spinner" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌌</div>
            <p className="text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
              No courses found. Try adjusting your filters.
            </p>
            {!loading && <p className="text-gray-600 text-sm mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
              Run <code className="text-cyan-400">npm run setup</code> to seed courses.
            </p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => {
              const dept = getDept(course.department);
              return (
                <div key={course.id} className={`glass-card ${dept?.hoverGlow ?? ""} p-5 group transition-all duration-300`}>
                  <Link href={`/courses/${course.slug}`} className="block">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dept?.icon ?? "📚"}</span>
                        <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                          {dept?.name ?? course.department}
                        </span>
                      </div>
                      <span className={course.price === 0 ? "badge badge-free" : "badge badge-paid"}>
                        {course.price === 0 ? "FREE" : `₹${course.price}`}
                      </span>
                    </div>

                    <h2 className="text-white font-semibold text-base mb-2 group-hover:text-purple-300 transition-colors" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      {course.title}
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                      <div className="flex items-center gap-3">
                        <span className={`badge badge-${course.level.toLowerCase()}`}>{course.level}</span>
                        <span>{course._count.lessons} lessons</span>
                      </div>
                      <span>{course.durationHours ?? "—"}h</span>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-xs text-gray-600">{course.instructor}</span>
                      <span className="text-xs font-medium" style={{ color: dept?.accent ?? "#7b2ff7", fontFamily: "Inter, sans-serif" }}>
                        View Course →
                      </span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setNotifyCourse({ id: course.id, slug: course.slug, title: course.title, department: course.department, level: course.level })}
                    className="mt-4 w-full rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20"
                  >
                    Notify Me
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NotifyMeModal
        isOpen={!!notifyCourse}
        onClose={() => setNotifyCourse(null)}
        course={notifyCourse ?? { title: "this course" }}
      />
    </div>
  );
}
