"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateProgress } from "@/lib/progressClient";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  chapterTitle: string;
  orderIndex: number;
  videoId: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  notes: string | null;
  quiz: Array<{
    id: string;
    question: string;
    options?: string[];
    type: "MCQ" | "NUMERICAL";
    points: number;
  }> | null;
}

interface LessonProgress {
  completed: boolean;
  watchPercent: number;
  quizPassed: boolean;
}

interface SidebarLesson {
  id: string;
  title: string;
  chapterTitle: string;
  orderIndex: number;
  completed?: boolean;
  isPreview: boolean;
}

interface CourseSidebar {
  id: string;
  title: string;
  slug: string;
  level: string;
  lessons: SidebarLesson[];
}

type TabType = "video" | "notes" | "quiz" | "chat";

export default function CoursePlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<CourseSidebar | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("video");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; total: number } | null>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLang, setChatLang] = useState<"english" | "hindi">("english");
  const [chatLoading, setChatLoading] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockedMsg, setLockedMsg] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load current user profile for watermark
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => console.error("Error loading user profile:", err));
  }, []);

  // Load course sidebar data
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/courses/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.course) {
          setCourse(data.course);
          // Auto-load first lesson
          const firstLesson = data.course.lessons?.[0];
          if (firstLesson) loadLesson(firstLesson.id);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadLesson = useCallback(async (lessonId: string) => {
    setLoadingLesson(true);
    setError(null);
    setLockedMsg(null);
    setQuizAnswers({});
    setQuizResult(null);

    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();

      if (res.status === 403) {
        if (data.code === "LOCKED") {
          setLockedMsg(`Complete "${data.prevLessonTitle}" first to unlock this lesson.`);
        } else if (data.code === "EXAM_REQUIRED") {
          setLockedMsg("You must pass the entrance exam before accessing this lesson.");
        } else {
          setError(data.error || "Access denied.");
        }
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to load lesson.");
        return;
      }

      setCurrentLesson(data.lesson);
      setProgress(data.progress || null);
      progressRef.current = data.progress?.watchPercent ?? 0;

      // Load chat history for this lesson
      const chatRes = await fetch(`/api/chat?lessonId=${lessonId}`);
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        setChatMessages(chatData.messages || []);
      }
    } finally {
      setLoadingLesson(false);
    }
  }, []);

  // Video watch % heartbeat (every 5s)
  useEffect(() => {
    if (!videoRef.current || !currentLesson) return;
    const video = videoRef.current;

    const interval = setInterval(async () => {
      const watchPercent = video.duration > 0
        ? (video.currentTime / video.duration) * 100
        : 0;

      if (watchPercent > progressRef.current) {
        progressRef.current = watchPercent;
        const { ok, data } = await updateProgress({ lessonId: currentLesson.id, watchPercent });
        if (ok && data?.progress) {
          // update local progress and sidebar lesson completion
          setProgress(data.progress);
          if (data.progress.completed && course) {
            setCourse((c) => c ? { ...c, lessons: c.lessons.map((l) => l.id === currentLesson.id ? { ...l, completed: true } : l) } : c);
          }
        }
        if (watchPercent >= 90 && !(progress as any)?.videoCompleted) {
          setProgress((p) => p ? { ...(p as any), videoCompleted: true } : null);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentLesson, progress]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const submitQuiz = async () => {
    if (!currentLesson?.quiz) return;
    setQuizSubmitting(true);

    const quiz = currentLesson.quiz;
    let score = 0;
    for (const q of quiz) {
      if (quizAnswers[q.id] !== undefined) score += q.points;
    }
    const total = quiz.reduce((a, q) => a + q.points, 0);
    const passed = score >= total * 0.6;

    setQuizResult({ score, passed, total });

    const { ok, data } = await updateProgress({ lessonId: currentLesson.id, quizPassed: passed });
    if (ok && data?.progress) {
      setProgress(data.progress);
      if (data.progress.completed && course) {
        setCourse((c) => c ? { ...c, lessons: c.lessons.map((l) => l.id === currentLesson.id ? { ...l, completed: true } : l) } : c);
      }
    }
    setQuizSubmitting(false);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !currentLesson) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", content: userMsg }]);
    setChatLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: currentLesson.id, message: userMsg, language: chatLang }),
    });
    const data = await res.json();
    setChatMessages((m) => [
      ...m,
      { role: "assistant", content: data.response || data.error || "Sorry, something went wrong." },
    ]);
    setChatLoading(false);
  };

  const chapterMap = new Map<string, SidebarLesson[]>();
  for (const lesson of (course?.lessons ?? [])) {
    if (!chapterMap.has(lesson.chapterTitle)) chapterMap.set(lesson.chapterTitle, []);
    chapterMap.get(lesson.chapterTitle)!.push(lesson);
  }

  return (
    <div className="flex h-screen pt-16 overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r overflow-y-auto"
        style={{ background: "rgba(6,8,20,0.95)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 mb-3">
            ← Dashboard
          </Link>
          <h2 className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {course?.title || "Loading…"}
          </h2>
          <span className="badge badge-beginner mt-1">{course?.level}</span>
        </div>

        <div className="p-3">
          {Array.from(chapterMap.entries()).map(([chapter, lessons]) => (
            <div key={chapter} className="mb-4">
              <div className="text-xs text-gray-600 font-semibold px-2 py-1 mb-1 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}>
                {chapter}
              </div>
              {lessons.map((lesson) => {
                const isActive = currentLesson?.id === lesson.id;
                const isCompleted = lesson.completed;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => loadLesson(lesson.id)}
                    className={`lesson-item w-full text-left ${isActive ? "lesson-active" : ""} ${isCompleted ? "lesson-completed" : ""}`}
                  >
                    <span className={`text-sm lesson-icon ${isCompleted ? "text-cyan-400" : isActive ? "text-purple-400" : "text-gray-600"}`}>
                      {isCompleted ? "✓" : isActive ? "▶" : "○"}
                    </span>
                    <span className={`text-xs flex-1 leading-tight ${isActive ? "text-white" : "text-gray-400"}`}
                      style={{ fontFamily: "Inter, sans-serif" }}>
                      {lesson.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b flex-shrink-0"
          style={{ background: "rgba(6,8,20,0.9)", borderColor: "rgba(255,255,255,0.07)" }}>
          {(["video", "notes", "quiz", "chat"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm capitalize transition-all ${activeTab === tab
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-500 hover:text-gray-300"
                }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {tab === "video" && "▶ "}
              {tab === "notes" && "📄 "}
              {tab === "quiz" && "📝 "}
              {tab === "chat" && "🤖 "}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loadingLesson ? (
            <div className="flex items-center justify-center h-64">
              <div className="orbit-spinner" />
            </div>
          ) : lockedMsg ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Lesson Locked
              </h3>
              <p className="text-gray-400 text-sm max-w-md" style={{ fontFamily: "Inter, sans-serif" }}>
                {lockedMsg}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">{error}</div>
          ) : !currentLesson ? (
            <div className="text-center py-20 text-gray-500">Select a lesson from the sidebar</div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>
                {currentLesson.title}
              </h1>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                {currentLesson.chapterTitle}
              </p>

              {/* VIDEO TAB */}
              {activeTab === "video" && (
                <div>
                  <div
                    className="relative rounded-xl overflow-hidden mb-4 bg-black"
                    style={{ aspectRatio: "16/9" }}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {currentLesson.videoUrl ? (
                      <video
                        ref={videoRef}
                        src={currentLesson.videoUrl}
                        controls
                        className="w-full h-full"
                        controlsList="nodownload"
                        disablePictureInPicture
                      >
                        Your browser does not support video.
                      </video>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center p-8">
                        <div className="text-5xl mb-3">🎬</div>
                        <p className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                          Video will appear here once uploaded via the Admin Panel.
                        </p>
                        <p className="text-xs mt-2 text-gray-700">
                          Go to <Link href="/admin" className="text-purple-400 hover:text-purple-300">/admin</Link> to add video content.
                        </p>
                      </div>
                    )}

                    {/* Watermark overlay */}
                    {currentUser && (
                      <div
                        className="absolute text-[10px] sm:text-xs text-white/10 pointer-events-none select-none watermark-animated whitespace-nowrap z-10"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Logged in as: {currentUser.name} ({currentUser.email})
                      </div>
                    )}
                    <div
                      className="absolute top-3 right-3 text-xs text-white/20 pointer-events-none select-none"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Nexus Orbit Academy
                    </div>
                  </div>

                  {progress && (
                    <div className="glass-card p-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          Watch Progress
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${progress.watchPercent}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {Math.round(progress.watchPercent)}%
                      </span>
                      {progress.completed && (
                        <span className="text-cyan-400 text-xs">✓ Complete</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === "notes" && (
                <div className="glass-card p-6 prose prose-invert max-w-none">
                  {currentLesson.notes ? (
                    <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed"
                      style={{ fontFamily: "Inter, sans-serif" }}>
                      {currentLesson.notes}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-10" style={{ fontFamily: "Inter, sans-serif" }}>
                      Notes for this lesson will be added by the instructor.
                    </div>
                  )}
                </div>
              )}

              {/* QUIZ TAB */}
              {activeTab === "quiz" && (
                <div>
                  {!currentLesson.quiz || currentLesson.quiz.length === 0 ? (
                    <div className="glass-card p-10 text-center text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                      No quiz for this lesson.
                    </div>
                  ) : quizResult ? (
                    <div className="glass-card p-8 text-center">
                      <div className="text-5xl mb-4">{quizResult.passed ? "🎉" : "😞"}</div>
                      <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                        {quizResult.passed ? "Quiz Passed!" : "Try Again"}
                      </h3>
                      <p className="text-gray-400 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                        Score: {quizResult.score}/{quizResult.total} points
                      </p>
                      {!quizResult.passed && (
                        <button
                          onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                          className="btn-primary"
                        >
                          Retry Quiz
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {currentLesson.quiz.map((q, qi) => (
                        <div key={q.id} className="glass-card p-5">
                          <p className="text-white text-sm font-medium mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                            Q{qi + 1}. {q.question}
                          </p>
                          {q.type === "MCQ" && q.options ? (
                            <div className="space-y-2">
                              {q.options.map((opt, oi) => (
                                <button
                                  key={oi}
                                  onClick={() => setQuizAnswers((a) => ({ ...a, [q.id]: String(oi) }))}
                                  className={`exam-option w-full text-left ${quizAnswers[q.id] === String(oi) ? "selected" : ""}`}
                                >
                                  <span className="text-gray-400 text-sm w-5">
                                    {String.fromCharCode(65 + oi)}.
                                  </span>
                                  <span className="text-sm text-gray-300" style={{ fontFamily: "Inter, sans-serif" }}>
                                    {opt}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="number"
                              className="input-field max-w-xs"
                              placeholder="Enter numerical answer"
                              value={quizAnswers[q.id] ?? ""}
                              onChange={(e) => setQuizAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                      <button
                        onClick={submitQuiz}
                        disabled={quizSubmitting}
                        className="btn-primary"
                      >
                        {quizSubmitting ? "Grading…" : "Submit Quiz"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CHAT TAB */}
              {activeTab === "chat" && (
                <div className="flex flex-col h-[60vh]">
                  <div className="glass-card p-3 mb-3 flex items-center justify-between">
                    <span className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      🤖 AI Tutor — {currentLesson.title}
                    </span>
                    <div className="flex gap-1">
                      {(["english", "hindi"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setChatLang(lang)}
                          className={`text-xs px-3 py-1 rounded-lg transition-all ${chatLang === lang ? "bg-purple-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                        >
                          {lang === "hindi" ? "हिंदी" : "English"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-600 py-8 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        Ask me anything about this lesson! 🚀
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${msg.role === "user"
                            ? "bg-purple-600/30 text-gray-200"
                            : "glass-card text-gray-300"
                            }`}
                          style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="glass-card px-4 py-2.5 text-sm text-gray-400">
                          <span className="animate-pulse">AI is thinking…</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                      className="input-field flex-1"
                      placeholder="Ask a question about this lesson…"
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={chatLoading || !chatInput.trim()}
                      className="btn-primary px-4"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
