"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { submitExamRequest } from "@/lib/examClient";

interface Question {
  id: string;
  type: "MCQ" | "NUMERICAL";
  question: string;
  options?: string[];
  points: number;
  negMarks: number;
  explanation?: string;
}

interface Exam {
  id: string;
  type: string;
  title: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: Question[];
  course: { title: string; slug: string };
}

interface GradedResult {
  attempt: {
    score: number;
    maxScore: number;
    percentScore: number;
    passed: boolean;
    passingScore: number;
  };
  gradedAnswers: Record<string, { correct: boolean; earned: number }>;
  certificateId: string | null;
  examType: string;
}

const MAX_TAB_SWITCHES = 3;

export default function ExamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<GradedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [tabWarning, setTabWarning] = useState(false);
  const startTimeRef = useRef<number>(0);

  // Load exam data
  useEffect(() => {
    if (!id) return;
    fetch(`/api/exam/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.exam) {
          setExam(data.exam);
          setTimeLeft(data.exam.timeLimitMinutes * 60);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const submitExam = useCallback(async (autoSubmit = false, switches = tabSwitches) => {
    if (submitted || submitting) return;
    setSubmitting(true);
    setSubmitted(true);

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const { ok, data } = await submitExamRequest({ examId: id!, answers, tabSwitches: switches, timeTakenSeconds: timeTaken });
    if (ok) setResult(data as any);
    setSubmitting(false);
  }, [submitted, submitting, tabSwitches, id, answers]);

  // Countdown timer
  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          submitExam(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft, submitExam]);

  // Tab switch detection
  useEffect(() => {
    if (!started || submitted) return;

    const handleBlur = () => {
      setTabSwitches((s) => {
        const newCount = s + 1;
        setTabWarning(true);
        setTimeout(() => setTabWarning(false), 3000);
        if (newCount >= MAX_TAB_SWITCHES) {
          submitExam(true, newCount);
        }
        return newCount;
      });
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [started, submitted, submitExam]);

  const startExam = () => {
    setStarted(true);
    startTimeRef.current = Date.now();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 300) return "#00d9ff";
    if (timeLeft > 60) return "#ffb800";
    return "#ff5050";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="orbit-spinner" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 text-center">
        <div>
          <div className="text-5xl mb-4">❌</div>
          <p className="text-gray-400">Exam not found.</p>
          <Link href="/dashboard" className="btn-secondary mt-4 inline-block">← Dashboard</Link>
        </div>
      </div>
    );
  }

  // Results Screen
  if (result) {
    const { attempt, certificateId, examType } = result;
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="max-w-lg w-full animate-fade-in-up">
          <div className="glass-card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: attempt.passed
                  ? "radial-gradient(circle at 50% 0%, rgba(0,217,100,0.1) 0%, transparent 60%)"
                  : "radial-gradient(circle at 50% 0%, rgba(255,80,80,0.1) 0%, transparent 60%)"
              }} />
            <div className="relative">
              <div className="text-6xl mb-4">{attempt.passed ? "🏆" : "📉"}</div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
                {attempt.passed ? "Congratulations!" : "Not Quite There Yet"}
              </h1>

              <div className="my-6 space-y-2">
                <div className="flex justify-between text-sm px-4">
                  <span className="text-gray-500">Your Score</span>
                  <span className="text-white font-bold">{attempt.percentScore}%</span>
                </div>
                <div className="progress-bar mx-4">
                  <div className="progress-bar-fill" style={{
                    width: `${attempt.percentScore}%`,
                    background: attempt.passed
                      ? "linear-gradient(90deg, #00d964, #00ff80)"
                      : "linear-gradient(90deg, #ff5050, #ff8080)"
                  }} />
                </div>
                <div className="flex justify-between text-xs text-gray-600 px-4">
                  <span>0%</span>
                  <span>Pass: {attempt.passingScore}%</span>
                  <span>100%</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                {attempt.passed
                  ? examType === "ENTRANCE"
                    ? "Course content is now unlocked. Start learning!"
                    : certificateId
                      ? "Your certificate has been issued!"
                      : "Excellent work!"
                  : "Review the material and try again."}
              </p>

              <div className="flex flex-col gap-3">
                {attempt.passed && examType === "ENTRANCE" && (
                  <Link href={`/dashboard/course/${exam.course.slug}`} className="btn-primary">
                    Start Learning →
                  </Link>
                )}
                {attempt.passed && certificateId && (
                  <Link href="/dashboard/certificates" className="btn-gold">
                    View Certificate 🏆
                  </Link>
                )}
                <Link href="/dashboard" className="btn-secondary">
                  ← Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pre-exam start screen
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="max-w-lg w-full animate-fade-in-up">
          <div className="glass-card p-10 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {exam.title}
            </h1>
            <p className="text-gray-400 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>{exam.course.title}</p>

            <div className="glass-card p-5 my-6 text-left space-y-2">
              {[
                [`📋 Questions`, `${exam.questions.length} questions`],
                [`⏱ Time Limit`, `${exam.timeLimitMinutes} minutes`],
                [`✅ Passing Score`, `${exam.passingScore}%`],
                [`⚠ Tab Switches Allowed`, `${MAX_TAB_SWITCHES - 1} (auto-submits after ${MAX_TAB_SWITCHES})`],
                [`🚫 Negative Marking`, `Enabled for wrong answers`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}>
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-300">{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-600 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Once started, the timer cannot be paused. Switching tabs too many times will auto-submit your exam.
            </p>

            <button onClick={startExam} className="btn-primary w-full py-3 text-base">
              Start Exam →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam in progress
  const answered = Object.keys(answers).length;
  const total = exam.questions.length;

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 sm:px-6" style={{ background: "var(--color-bg-primary)" }}>
      {/* Tab switch warning */}
      {tabWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium animate-fade-in"
          style={{ background: "rgba(255,80,80,0.9)", color: "white", fontFamily: "Inter, sans-serif" }}>
          ⚠ Tab switch detected! ({tabSwitches}/{MAX_TAB_SWITCHES}) — {MAX_TAB_SWITCHES - tabSwitches} remaining before auto-submit
        </div>
      )}

      {/* Sticky header */}
      <div className="fixed top-16 left-0 right-0 z-40 glass-nav px-6 py-3 flex items-center justify-between">
        <div>
          <span className="text-white text-sm font-medium" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {exam.title}
          </span>
          <span className="text-gray-500 text-xs ml-3" style={{ fontFamily: "Inter, sans-serif" }}>
            {answered}/{total} answered
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-lg font-bold font-mono" style={{ color: getTimerColor() }}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => submitExam(false)}
            disabled={submitting}
            className="btn-primary py-2 px-4 text-sm"
          >
            {submitting ? "Submitting…" : "Submit Exam"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto pt-16 space-y-5">
        {exam.questions.map((q, qi) => (
          <div key={q.id} className="glass-card p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-xs text-gray-600 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Q{qi + 1} • {q.type} • +{q.points} marks
                  {q.negMarks > 0 && <span className="text-red-400"> • -{q.negMarks} wrong</span>}
                </span>
                <p className="text-white text-sm mt-1 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {q.question}
                </p>
              </div>
              {answers[q.id] !== undefined && (
                <span className="text-cyan-400 text-xs flex-shrink-0">✓</span>
              )}
            </div>

            {q.type === "MCQ" && q.options ? (
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: String(oi) }))}
                    className={`exam-option w-full text-left ${answers[q.id] === String(oi) ? "selected" : ""}`}
                  >
                    <span className="text-gray-500 text-sm w-6 flex-shrink-0">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    <span className="text-gray-300 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="number"
                className="input-field max-w-xs"
                placeholder="Enter your numerical answer"
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              />
            )}
          </div>
        ))}

        <div className="text-center pt-4">
          <button
            onClick={() => submitExam(false)}
            disabled={submitting}
            className="btn-primary px-10 py-3 text-base"
          >
            {submitting ? "Submitting…" : `Submit Exam (${answered}/${total} answered)`}
          </button>
        </div>
      </div>
    </div>
  );
}
