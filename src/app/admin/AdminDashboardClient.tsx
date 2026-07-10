"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────── */
interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;
  totalRevenue: number;
}
interface RecentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
interface RecentPayment {
  id: string;
  amount: number;
  createdAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

/* ── Component ─────────────────────────────────────────── */
export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses">("overview");

  // Users tab state
  const [users, setUsers] = useState<any[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userLoading, setUserLoading] = useState(false);

  // Courses tab state
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "", slug: "", description: "", department: "AEROSPACE",
    level: "BEGINNER", price: "0", instructor: "",
  });
  const [courseFormLoading, setCourseFormLoading] = useState(false);
  const [courseMsg, setCourseMsg] = useState("");

  /* fetch overview stats */
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecentUsers(d.recentUsers ?? []);
        setRecentPayments(d.recentPayments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* fetch users */
  const fetchUsers = useCallback(() => {
    setUserLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}&page=${userPage}`)
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users ?? []);
        setUserTotal(d.total ?? 0);
        setUserLoading(false);
      })
      .catch(() => setUserLoading(false));
  }, [userSearch, userPage]);

  /* fetch courses */
  const fetchCourses = useCallback(() => {
    setCoursesLoading(true);
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((d) => {
        setCourses(d.courses ?? []);
        setCoursesLoading(false);
      })
      .catch(() => setCoursesLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "courses") fetchCourses();
  }, [activeTab, fetchUsers, fetchCourses]);

  /* delete user */
  const deleteUser = async (userId: string, name: string) => {
    if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    fetchUsers();
  };

  /* toggle publish */
  const togglePublish = async (courseId: string, current: boolean) => {
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, isPublished: !current }),
    });
    fetchCourses();
  };

  /* delete course */
  const deleteCourse = async (courseId: string, title: string) => {
    if (!confirm(`Delete course "${title}"? All lessons and enrollments will be lost.`)) return;
    await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    fetchCourses();
  };

  /* create course */
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseFormLoading(true);
    setCourseMsg("");
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...courseForm,
        price: parseFloat(courseForm.price) || 0,
      }),
    });
    const data = await res.json();
    setCourseFormLoading(false);
    if (res.ok) {
      setCourseMsg("✅ Course created!");
      setCourseForm({ title: "", slug: "", description: "", department: "AEROSPACE", level: "BEGINNER", price: "0", instructor: "" });
      fetchCourses();
      setTimeout(() => { setShowCourseModal(false); setCourseMsg(""); }, 1500);
    } else {
      setCourseMsg(`❌ ${data.error}`);
    }
  };

  /* auto-generate slug */
  const handleTitleChange = (v: string) => {
    setCourseForm((f) => ({
      ...f,
      title: v,
      slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🛸</span>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Admin Control Center
              </h1>
            </div>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              Nexus Orbit Academy — Platform Management
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="btn-secondary py-2 px-4 text-sm">
              ← Student View
            </Link>
            <Link href="/admin/courses" className="btn-primary py-2 px-4 text-sm">
              📝 Course Builder
            </Link>
            <Link href="/admin/interest-registrations" className="btn-secondary py-2 px-4 text-sm">
              📬 Interest Registrations
            </Link>
            <Link href="/admin/course-notifications" className="btn-secondary py-2 px-4 text-sm">
              🔔 Course Notifications
            </Link>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["overview", "users", "courses"] as const).map((tab) => (
            <button
              key={tab}
              id={`admin-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-purple-600/70 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {tab === "overview" ? "📊 Overview" : tab === "users" ? "👥 Students" : "📚 Courses"}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════
            OVERVIEW TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            {loading ? (
              <div className="text-center text-gray-400 py-20">Loading metrics…</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                  {[
                    { icon: "👥", label: "Total Students", value: stats?.totalUsers ?? 0, color: "#00d9ff" },
                    { icon: "📚", label: "Total Courses", value: stats?.totalCourses ?? 0, color: "#7b2ff7" },
                    { icon: "🎓", label: "Enrollments", value: stats?.totalEnrollments ?? 0, color: "#ffb800" },
                    { icon: "🏆", label: "Certificates", value: stats?.totalCertificates ?? 0, color: "#9632fa" },
                    {
                      icon: "💰",
                      label: "Revenue",
                      value: `₹${((stats?.totalRevenue ?? 0) / 100).toLocaleString("en-IN")}`,
                      color: "#00ff88",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="glass-card p-5 text-center"
                      style={{ boxShadow: `0 0 20px ${s.color}18` }}
                    >
                      <div className="text-3xl mb-2">{s.icon}</div>
                      <div
                        className="text-2xl font-bold mb-1"
                        style={{ fontFamily: "Orbitron, sans-serif", color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Signups */}
                  <div className="glass-card p-6">
                    <h2 className="text-base font-bold text-white mb-5" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      🆕 Recent Sign-ups
                    </h2>
                    {recentUsers.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6">No students yet</p>
                    ) : (
                      <div className="space-y-3">
                        {recentUsers.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <div>
                              <div className="text-sm font-medium text-white" style={{ fontFamily: "Inter, sans-serif" }}>{u.name}</div>
                              <div className="text-xs text-gray-500">{u.email}</div>
                            </div>
                            <div className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString("en-IN")}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Payments */}
                  <div className="glass-card p-6">
                    <h2 className="text-base font-bold text-white mb-5" style={{ fontFamily: "Orbitron, sans-serif" }}>
                      💳 Recent Payments
                    </h2>
                    {recentPayments.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6">No successful payments yet</p>
                    ) : (
                      <div className="space-y-3">
                        {recentPayments.map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <div>
                              <div className="text-sm font-medium text-white" style={{ fontFamily: "Inter, sans-serif" }}>{p.user.name}</div>
                              <div className="text-xs text-gray-500">{p.course.title}</div>
                            </div>
                            <div className="text-sm font-bold" style={{ color: "#00ff88", fontFamily: "Orbitron, sans-serif" }}>
                              ₹{p.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  {[
                    { href: "/admin/courses", icon: "📝", label: "Course Builder", sub: "Add & edit courses and lessons" },
                    { href: "/courses", icon: "🌐", label: "Public Catalog", sub: "View the student-facing catalog" },
                    { href: "/dashboard", icon: "🎓", label: "Student Dashboard", sub: "Preview the student experience" },
                  ].map((a) => (
                    <Link key={a.href} href={a.href} className="glass-card p-5 hover:bg-white/5 transition-all duration-300 group">
                      <div className="text-2xl mb-2">{a.icon}</div>
                      <div className="text-sm font-bold text-white mb-1 group-hover:text-purple-300 transition-colors" style={{ fontFamily: "Orbitron, sans-serif" }}>{a.label}</div>
                      <div className="text-xs text-gray-500">{a.sub}</div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            STUDENTS TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div>
            {/* Search */}
            <div className="flex gap-3 mb-6">
              <input
                id="admin-user-search"
                type="text"
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <button
                onClick={fetchUsers}
                className="btn-secondary py-2 px-5 text-sm"
              >
                Search
              </button>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {["Name", "Email", "Enrolled", "Certificates", "Joined", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">Loading…</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">No students found</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u.id}
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          className="hover:bg-white/2 transition-colors"
                        >
                          <td className="px-5 py-4 font-medium text-white">{u.name}</td>
                          <td className="px-5 py-4 text-gray-400">{u.email}</td>
                          <td className="px-5 py-4 text-center">
                            <span className="badge" style={{ background: "rgba(0,217,255,0.1)", color: "#00d9ff", border: "1px solid rgba(0,217,255,0.2)" }}>
                              {u._count?.enrollments ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="badge" style={{ background: "rgba(255,184,0,0.1)", color: "#ffb800", border: "1px solid rgba(255,184,0,0.2)" }}>
                              {u._count?.certificates ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-xs">
                            {new Date(u.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => deleteUser(u.id, u.name)}
                              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(255,80,80,0.1)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.2)" }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {userTotal > 20 && (
                <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                    Showing {(userPage - 1) * 20 + 1}–{Math.min(userPage * 20, userTotal)} of {userTotal}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={userPage === 1}
                      onClick={() => setUserPage((p) => p - 1)}
                      className="btn-secondary py-1.5 px-4 text-xs disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <button
                      disabled={userPage * 20 >= userTotal}
                      onClick={() => setUserPage((p) => p + 1)}
                      className="btn-secondary py-1.5 px-4 text-xs disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            COURSES TAB
            ════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <p className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                {courses.length} course{courses.length !== 1 ? "s" : ""} total
              </p>
              <div className="flex gap-3">
                <button
                  id="admin-new-course-btn"
                  onClick={() => setShowCourseModal(true)}
                  className="btn-primary py-2 px-5 text-sm"
                >
                  + New Course
                </button>
                <Link href="/admin/courses" className="btn-secondary py-2 px-5 text-sm">
                  Full Builder →
                </Link>
              </div>
            </div>

            {/* Courses Grid */}
            {coursesLoading ? (
              <div className="text-center text-gray-400 py-20">Loading courses…</div>
            ) : courses.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>No courses yet.</p>
                <button onClick={() => setShowCourseModal(true)} className="btn-primary">
                  Create First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((c) => {
                  const deptColors: Record<string, string> = {
                    AEROSPACE: "#00d9ff",
                    AI_ML: "#7b2ff7",
                    SPACE_TECH: "#ffb800",
                    UNIVERSE: "#9632fa",
                  };
                  const color = deptColors[c.department] ?? "#7b2ff7";
                  return (
                    <div
                      key={c.id}
                      className="glass-card p-5 flex flex-col justify-between"
                      style={{ boxShadow: `0 0 15px ${color}18` }}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <span
                            className="text-xs px-2 py-1 rounded-md font-semibold"
                            style={{ background: `${color}18`, color, border: `1px solid ${color}30`, fontFamily: "Inter, sans-serif" }}
                          >
                            {c.department.replace("_", " ")}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-md font-semibold`}
                            style={{
                              background: c.isPublished ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
                              color: c.isPublished ? "#00ff88" : "#888",
                              border: `1px solid ${c.isPublished ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.08)"}`,
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {c.isPublished ? "● Live" : "○ Draft"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                          {c.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {c.description}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-500 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                          <span>📚 {c._count?.lessons ?? 0} lessons</span>
                          <span>👥 {c._count?.enrollments ?? 0} enrolled</span>
                          <span>💰 {c.price === 0 ? "Free" : `₹${c.price}`}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePublish(c.id, c.isPublished)}
                          className="flex-1 py-1.5 text-xs rounded-lg transition-colors font-medium"
                          style={{
                            background: c.isPublished ? "rgba(255,80,80,0.1)" : "rgba(0,255,136,0.1)",
                            color: c.isPublished ? "#ff5050" : "#00ff88",
                            border: `1px solid ${c.isPublished ? "rgba(255,80,80,0.2)" : "rgba(0,255,136,0.2)"}`,
                          }}
                        >
                          {c.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <Link
                          href={`/admin/courses?edit=${c.id}`}
                          className="flex-1 py-1.5 text-xs rounded-lg text-center transition-colors font-medium"
                          style={{ background: "rgba(123,47,247,0.1)", color: "#7b2ff7", border: "1px solid rgba(123,47,247,0.2)" }}
                        >
                          Edit Lessons
                        </Link>
                        <button
                          onClick={() => deleteCourse(c.id, c.title)}
                          className="py-1.5 px-3 text-xs rounded-lg transition-colors"
                          style={{ background: "rgba(255,80,80,0.08)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.15)" }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create Course Modal ──────────────────────────── */}
      {showCourseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6,8,20,0.85)", backdropFilter: "blur(12px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCourseModal(false); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-8"
            style={{ background: "rgba(15,17,35,0.98)", border: "1px solid rgba(123,47,247,0.3)", boxShadow: "0 0 60px rgba(123,47,247,0.2)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                + Create New Course
              </h2>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-500 hover:text-white text-xl transition-colors">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Course Title *</label>
                <input
                  id="modal-course-title"
                  required
                  value={courseForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Rocket Propulsion Systems"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Slug (auto-generated)</label>
                <input
                  id="modal-course-slug"
                  required
                  value={courseForm.slug}
                  onChange={(e) => setCourseForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="rocket-propulsion-systems"
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#7b2ff7", outline: "none", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Description</label>
                <textarea
                  id="modal-course-description"
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief course overview…"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white resize-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Department</label>
                  <select
                    id="modal-course-dept"
                    value={courseForm.department}
                    onChange={(e) => setCourseForm((f) => ({ ...f, department: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="AEROSPACE">Aerospace</option>
                    <option value="AI_ML">AI & ML</option>
                    <option value="SPACE_TECH">Space Tech</option>
                    <option value="UNIVERSE">Universe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Level</label>
                  <select
                    id="modal-course-level"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm((f) => ({ ...f, level: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="BEGINNER">Beginner (Free)</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Price (₹)</label>
                  <input
                    id="modal-course-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Instructor</label>
                  <input
                    id="modal-course-instructor"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm((f) => ({ ...f, instructor: e.target.value }))}
                    placeholder="Faculty name…"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>

              {courseMsg && (
                <p className="text-sm text-center py-2" style={{ fontFamily: "Inter, sans-serif", color: courseMsg.startsWith("✅") ? "#00ff88" : "#ff5050" }}>
                  {courseMsg}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 btn-secondary py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={courseFormLoading}
                  className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60"
                >
                  {courseFormLoading ? "Creating…" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
