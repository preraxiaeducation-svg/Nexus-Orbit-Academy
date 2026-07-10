"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────── */
interface Course {
  id: string;
  title: string;
  slug: string;
  department: string;
  level: string;
  price: number;
  isPublished: boolean;
  description: string;
  instructor: string;
  _count?: { lessons: number; enrollments: number };
}

interface Lesson {
  id: string;
  chapterTitle: string;
  title: string;
  orderIndex: number;
  videoUrl: string | null;
  notes: string | null;
  isPreview: boolean;
}

type EditorMode = "select" | "lessons" | "edit-lesson" | "new-lesson";

const DEPT_ICONS: Record<string, string> = {
  AEROSPACE: "🚀",
  AI_ML: "🤖",
  SPACE_TECH: "🛸",
  UNIVERSE: "🌌",
};

export default function CourseBuilderClient() {
  const searchParams = useSearchParams();
  const initialEditId = searchParams.get("edit");

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [mode, setMode] = useState<EditorMode>("select");

  /* Lessons */
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  /* Lesson form */
  const [lessonForm, setLessonForm] = useState({
    chapterTitle: "",
    title: "",
    orderIndex: "1",
    videoUrl: "",
    notes: "",
    isPreview: false,
  });
  const [lessonMsg, setLessonMsg] = useState("");
  const [lessonSaving, setLessonSaving] = useState(false);

  /* ── Fetch all courses ──────────────────────────────── */
  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    setCourses(data.courses ?? []);
    setCoursesLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* Auto-open course from query param */
  useEffect(() => {
    if (initialEditId && courses.length > 0) {
      const c = courses.find((c) => c.id === initialEditId);
      if (c) {
        setSelectedCourse(c);
        setMode("lessons");
      }
    }
  }, [initialEditId, courses]);

  /* ── Fetch lessons for selected course ─────────────── */
  const fetchLessons = useCallback(async () => {
    if (!selectedCourse) return;
    setLessonsLoading(true);
    const res = await fetch(`/api/admin/lessons?courseId=${selectedCourse.id}`);
    const data = await res.json();
    setLessons(data.lessons ?? []);
    setLessonsLoading(false);
  }, [selectedCourse]);

  useEffect(() => {
    if (mode === "lessons") fetchLessons();
  }, [mode, fetchLessons]);

  /* ── Open lesson for editing ────────────────────────── */
  const openEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      chapterTitle: lesson.chapterTitle,
      title: lesson.title,
      orderIndex: String(lesson.orderIndex),
      videoUrl: lesson.videoUrl ?? "",
      notes: lesson.notes ?? "",
      isPreview: lesson.isPreview,
    });
    setLessonMsg("");
    setMode("edit-lesson");
  };

  /* ── Open new lesson form ───────────────────────────── */
  const openNewLesson = () => {
    setSelectedLesson(null);
    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map((l) => l.orderIndex)) + 1 : 1;
    setLessonForm({
      chapterTitle: lessons[lessons.length - 1]?.chapterTitle ?? "Chapter 1",
      title: "",
      orderIndex: String(nextOrder),
      videoUrl: "",
      notes: "",
      isPreview: false,
    });
    setLessonMsg("");
    setMode("new-lesson");
  };

  /* ── Save lesson (create or update) ────────────────── */
  const saveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setLessonSaving(true);
    setLessonMsg("");

    const payload = {
      ...(selectedLesson ? { lessonId: selectedLesson.id } : { courseId: selectedCourse.id }),
      chapterTitle: lessonForm.chapterTitle,
      title: lessonForm.title,
      orderIndex: parseInt(lessonForm.orderIndex) || 1,
      videoUrl: lessonForm.videoUrl || null,
      notes: lessonForm.notes,
      isPreview: lessonForm.isPreview,
    };

    const res = await fetch("/api/admin/lessons", {
      method: selectedLesson ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLessonSaving(false);
    if (res.ok) {
      setLessonMsg("✅ Saved successfully!");
      fetchLessons();
      setTimeout(() => { setMode("lessons"); setLessonMsg(""); }, 1000);
    } else {
      setLessonMsg(`❌ ${data.error}`);
    }
  };

  /* ── Delete lesson ──────────────────────────────────── */
  const deleteLesson = async (lessonId: string, title: string) => {
    if (!confirm(`Delete lesson "${title}"?`)) return;
    await fetch("/api/admin/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    });
    fetchLessons();
  };

  /* ── Toggle publish ─────────────────────────────────── */
  const togglePublish = async (courseId: string, current: boolean) => {
    await fetch("/api/admin/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, isPublished: !current }),
    });
    fetchCourses();
    if (selectedCourse?.id === courseId) {
      setSelectedCourse((c) => c ? { ...c, isPublished: !current } : c);
    }
  };

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {(mode !== "select") && (
                <button
                  onClick={() => {
                    if (mode === "edit-lesson" || mode === "new-lesson") setMode("lessons");
                    else { setMode("select"); setSelectedCourse(null); }
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-lg mr-1"
                  title="Go back"
                >
                  ←
                </button>
              )}
              <span className="text-2xl">📝</span>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                {mode === "select" && "Course Builder"}
                {mode === "lessons" && (selectedCourse?.title ?? "Lessons")}
                {mode === "edit-lesson" && "Edit Lesson"}
                {mode === "new-lesson" && "New Lesson"}
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-10" style={{ fontFamily: "Inter, sans-serif" }}>
              {mode === "select" && "Select a course to manage its lessons"}
              {mode === "lessons" && `${lessons.length} lesson${lessons.length !== 1 ? "s" : ""} — ${selectedCourse?.department}`}
              {(mode === "edit-lesson" || mode === "new-lesson") && selectedCourse?.title}
            </p>
          </div>
          <Link href="/admin" className="btn-secondary py-2 px-4 text-sm">
            ← Admin Panel
          </Link>
        </div>

        {/* ══ SELECT COURSE ══════════════════════════════════ */}
        {mode === "select" && (
          <div>
            {coursesLoading ? (
              <div className="text-center text-gray-400 py-20">Loading courses…</div>
            ) : courses.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>No courses found.</p>
                <Link href="/admin" className="btn-primary">Go to Admin Panel</Link>
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
                  const col = deptColors[c.department] ?? "#7b2ff7";
                  return (
                    <button
                      key={c.id}
                      id={`course-select-${c.id}`}
                      onClick={() => { setSelectedCourse(c); setMode("lessons"); }}
                      className="glass-card p-5 text-left transition-all duration-300 hover:scale-[1.02]"
                      style={{ boxShadow: `0 0 15px ${col}18`, border: `1px solid ${col}22` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{DEPT_ICONS[c.department] ?? "📚"}</span>
                        <div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-md font-semibold"
                            style={{ background: `${col}18`, color: col, fontFamily: "Inter, sans-serif" }}
                          >
                            {c.level}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                        {c.title}
                      </h3>
                      <div className="flex gap-4 text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                        <span>📚 {c._count?.lessons ?? 0} lessons</span>
                        <span>👥 {c._count?.enrollments ?? 0} enrolled</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{
                            background: c.isPublished ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
                            color: c.isPublished ? "#00ff88" : "#888",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {c.isPublished ? "● Live" : "○ Draft"}
                        </span>
                        <span className="text-xs text-purple-400" style={{ fontFamily: "Inter, sans-serif" }}>
                          Edit Lessons →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ LESSONS LIST ════════════════════════════════════ */}
        {mode === "lessons" && selectedCourse && (
          <div>
            {/* Course info bar */}
            <div className="glass-card p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-6 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                <span className="text-gray-400">
                  Dept: <span className="text-white">{selectedCourse.department.replace("_", " ")}</span>
                </span>
                <span className="text-gray-400">
                  Level: <span className="text-white">{selectedCourse.level}</span>
                </span>
                <span className="text-gray-400">
                  Price: <span className="text-white">{selectedCourse.price === 0 ? "Free" : `₹${selectedCourse.price}`}</span>
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => togglePublish(selectedCourse.id, selectedCourse.isPublished)}
                  className="text-xs px-4 py-2 rounded-lg transition-colors font-medium"
                  style={{
                    background: selectedCourse.isPublished ? "rgba(255,80,80,0.1)" : "rgba(0,255,136,0.1)",
                    color: selectedCourse.isPublished ? "#ff5050" : "#00ff88",
                    border: `1px solid ${selectedCourse.isPublished ? "rgba(255,80,80,0.2)" : "rgba(0,255,136,0.2)"}`,
                  }}
                >
                  {selectedCourse.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  id="add-lesson-btn"
                  onClick={openNewLesson}
                  className="btn-primary text-xs py-2 px-5"
                >
                  + Add Lesson
                </button>
              </div>
            </div>

            {/* Lessons table */}
            {lessonsLoading ? (
              <div className="text-center text-gray-400 py-12">Loading lessons…</div>
            ) : lessons.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  No lessons yet. Add the first lesson to get started.
                </p>
                <button onClick={openNewLesson} className="btn-primary">
                  + Add First Lesson
                </button>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                {/* Group by chapter */}
                {(() => {
                  const chapters: Record<string, Lesson[]> = {};
                  lessons.forEach((l) => {
                    if (!chapters[l.chapterTitle]) chapters[l.chapterTitle] = [];
                    chapters[l.chapterTitle].push(l);
                  });
                  return Object.entries(chapters).map(([chapter, chLessons]) => (
                    <div key={chapter}>
                      {/* Chapter header */}
                      <div
                        className="px-5 py-3 flex items-center gap-2"
                        style={{ background: "rgba(123,47,247,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <span className="text-purple-400 font-bold text-xs uppercase tracking-widest" style={{ fontFamily: "Orbitron, sans-serif" }}>
                          📂 {chapter}
                        </span>
                        <span className="text-gray-600 text-xs ml-auto">({chLessons.length} lessons)</span>
                      </div>

                      {/* Lessons */}
                      {chLessons.map((lesson, idx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors"
                          style={{ borderBottom: idx < chLessons.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
                        >
                          <span
                            className="text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                            style={{ background: "rgba(123,47,247,0.15)", color: "#7b2ff7", fontFamily: "Orbitron, sans-serif" }}
                          >
                            {lesson.orderIndex}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                              {lesson.title}
                              {lesson.isPreview && (
                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(0,217,255,0.1)", color: "#00d9ff" }}>
                                  Preview
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                              {lesson.videoUrl ? "🎬 Has video" : "📝 Notes only"}
                              {lesson.notes && " · Notes ✓"}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => openEditLesson(lesson)}
                              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(123,47,247,0.1)", color: "#7b2ff7", border: "1px solid rgba(123,47,247,0.2)" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteLesson(lesson.id, lesson.title)}
                              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{ background: "rgba(255,80,80,0.08)", color: "#ff5050", border: "1px solid rgba(255,80,80,0.15)" }}
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══ LESSON EDITOR ════════════════════════════════════ */}
        {(mode === "edit-lesson" || mode === "new-lesson") && (
          <div className="max-w-3xl mx-auto">
            <form onSubmit={saveLesson} className="space-y-6">

              {/* Row 1: Chapter + Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Chapter Title *</label>
                  <input
                    id="lesson-chapter"
                    required
                    value={lessonForm.chapterTitle}
                    onChange={(e) => setLessonForm((f) => ({ ...f, chapterTitle: e.target.value }))}
                    placeholder="Chapter 1: Introduction"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Order #</label>
                  <input
                    id="lesson-order"
                    type="number"
                    min="1"
                    value={lessonForm.orderIndex}
                    onChange={(e) => setLessonForm((f) => ({ ...f, orderIndex: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>

              {/* Lesson Title */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>Lesson Title *</label>
                <input
                  id="lesson-title"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Introduction to Orbital Mechanics"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                  Video URL / Bunny Stream ID{" "}
                  <span className="text-gray-600">(optional)</span>
                </label>
                <input
                  id="lesson-video"
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm((f) => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://iframe.mediadelivery.net/embed/..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontFamily: "Inter, sans-serif" }}
                />
              </div>

              {/* Notes (Markdown) */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
                  Lesson Notes{" "}
                  <span className="text-gray-600">(Markdown supported)</span>
                </label>
                <textarea
                  id="lesson-notes"
                  rows={12}
                  value={lessonForm.notes}
                  onChange={(e) => setLessonForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="## Introduction&#10;&#10;Write lesson notes here in **Markdown**…"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white resize-y font-mono"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    outline: "none",
                    lineHeight: "1.7",
                    minHeight: "280px",
                  }}
                />
              </div>

              {/* Preview toggle */}
              <div className="flex items-center gap-3 glass-card px-5 py-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="lesson-preview-toggle"
                    type="checkbox"
                    className="sr-only peer"
                    checked={lessonForm.isPreview}
                    onChange={(e) => setLessonForm((f) => ({ ...f, isPreview: e.target.checked }))}
                  />
                  <div className="w-11 h-6 rounded-full peer-checked:bg-purple-600 transition-colors"
                    style={{ background: lessonForm.isPreview ? "#7b2ff7" : "rgba(255,255,255,0.12)" }}>
                    <div
                      className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: lessonForm.isPreview ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </div>
                </label>
                <div style={{ fontFamily: "Inter, sans-serif" }}>
                  <div className="text-sm text-white font-medium">Free Preview</div>
                  <div className="text-xs text-gray-500">Visible to non-enrolled users</div>
                </div>
              </div>

              {/* Message */}
              {lessonMsg && (
                <p
                  className="text-sm text-center py-2"
                  style={{ color: lessonMsg.startsWith("✅") ? "#00ff88" : "#ff5050", fontFamily: "Inter, sans-serif" }}
                >
                  {lessonMsg}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode("lessons")}
                  className="flex-1 btn-secondary py-3 text-sm"
                >
                  Cancel
                </button>
                <button
                  id="save-lesson-btn"
                  type="submit"
                  disabled={lessonSaving}
                  className="flex-1 btn-primary py-3 text-sm disabled:opacity-60"
                >
                  {lessonSaving ? "Saving…" : mode === "new-lesson" ? "Create Lesson" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
