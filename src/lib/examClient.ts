"use client";

export async function submitExamRequest(payload: {
  examId: string;
  answers: Record<string, unknown>;
  tabSwitches?: number;
  timeTakenSeconds?: number;
}) {
  const res = await fetch("/api/exam/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
