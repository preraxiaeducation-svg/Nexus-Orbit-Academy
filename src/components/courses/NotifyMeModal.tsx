"use client";

import { useEffect, useMemo, useState } from "react";

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id?: string;
    slug?: string;
    title: string;
    department?: string;
    level?: string;
  };
  defaultEmail?: string;
  defaultName?: string;
}

export function NotifyMeModal({ isOpen, onClose, course, defaultEmail = "", defaultName = "" }: NotifyMeModalProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!isOpen) return;
    setName(defaultName);
    setEmail(defaultEmail);
    setPhone("");
    setAlreadyRegistered(false);
    setLoading(false);
    setMessage("");
  }, [isOpen, defaultEmail, defaultName]);

  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);

  if (!isOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !isValidEmail) {
      setMessageTone("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/courses/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id ?? null,
          courseSlug: course.slug ?? null,
          courseTitle: course.title,
          department: course.department ?? null,
          level: course.level ?? null,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          alreadyRegistered,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "We could not save your request right now.");
      }

      setMessageTone("success");
      setMessage(data?.message || "You’re on the list. We’ll notify you when this course opens.");
      setName("");
      setEmail("");
      setPhone("");
      setAlreadyRegistered(false);
    } catch (error) {
      setMessageTone("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(2,6,23,0.82)] px-4 py-8 backdrop-blur-xl" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 shadow-[0_0_80px_rgba(123,47,247,0.25)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Launch Alert</p>
            <h3 className="mt-2 text-xl font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Notify me for {course.title}
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Join the waitlist and get first access when this course becomes available.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-400 transition hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Phone (optional)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/50" />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-gray-300">
            <input type="checkbox" checked={alreadyRegistered} onChange={(e) => setAlreadyRegistered(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-transparent" />
            I am already registered with Nexus Orbit Academy.
          </label>

          {message ? (
            <div className={`rounded-xl border px-3 py-3 text-sm ${messageTone === "success" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-rose-400/30 bg-rose-500/10 text-rose-300"}`}>
              {message}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">Close</button>
            <button type="submit" disabled={loading} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
              {loading ? "Saving…" : "Notify Me"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
