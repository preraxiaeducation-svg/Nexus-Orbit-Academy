"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login as loginRequest } from "@/lib/authClient";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { ok, data } = await loginRequest(email, password);
      if (!ok) {
        setError(data?.error || "Login failed.");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(123,47,247,0.12) 0%, transparent 60%)" }} />

          <div className="relative">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🌌</div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Sign in to continue your journey
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg text-sm text-red-400"
                style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", fontFamily: "Inter, sans-serif" }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="orbit-spinner" style={{ width: 18, height: 18 }} />
                    Signing in…
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
