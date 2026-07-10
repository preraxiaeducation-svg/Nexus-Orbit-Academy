"use client";

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  return { ok: res.ok, status: res.status };
}

export async function me() {
  const res = await fetch("/api/auth/me");
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
