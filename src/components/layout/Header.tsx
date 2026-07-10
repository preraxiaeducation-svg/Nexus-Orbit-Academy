"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { PRIMARY_LOGO_PATH, ICON_LOGO_PATH, ACADEMY_NAME } from "@/config/branding";
import { InterestRegistrationForm } from "@/components/interest/InterestRegistrationForm";

interface User {
  name: string;
  email: string;
  role: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const openRegisterModal = () => {
    setMobileOpen(false);
    setShowRegisterModal(true);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/nasa", label: "NASA Explorer" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            {!logoError ? (
              <>
                <div className="hidden md:block relative h-10 w-28">
                  <Image
                    src={PRIMARY_LOGO_PATH}
                    alt={ACADEMY_NAME}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
                <div className="md:hidden relative h-10 w-10">
                  <Image
                    src={ICON_LOGO_PATH}
                    alt={ACADEMY_NAME}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              </>
            ) : (
              <span className="text-2xl">🌌</span>
            )}
          </div>
          <span
            className="font-bold text-lg hidden sm:block"
            style={{
              fontFamily: "Orbitron, sans-serif",
              background: "linear-gradient(135deg, #7b2ff7, #00d9ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {ACADEMY_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.03em" }}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Admin ✦
            </Link>
          )}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="btn-secondary text-sm py-2 px-5">
                Dashboard
              </Link>
              <div className="relative group">
                <button
                  className="flex items-center gap-2 glass-card px-3 py-2 text-sm text-gray-300 hover:text-white rounded-xl transition-all"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-24 truncate">{user.name}</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass-card p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/dashboard/profile" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Profile</Link>
                  <Link href="/dashboard/certificates" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Certificates</Link>
                  <hr className="border-white/10 my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                    Sign Out
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-all py-2 px-4 border border-red-500/20 hover:border-red-500/40 rounded-xl bg-red-500/5 hover:bg-red-500/10 cursor-pointer"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* <Link href="/login" className="btn-secondary text-sm py-2 px-5">Sign In</Link> */}
              <button type="button" onClick={openRegisterModal} className="btn-primary text-sm py-2 px-5">Get Registered</button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-5xl relative">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/50 px-3 py-2 text-sm text-gray-300 hover:text-white"
              aria-label="Close registration form"
            >
              ✕
            </button>
            <InterestRegistrationForm onSuccess={() => setShowRegisterModal(false)} onCancel={() => setShowRegisterModal(false)} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-white/10 mt-2 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-300 hover:text-white py-2 text-sm"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-gray-300 hover:text-white py-2 text-sm">Dashboard</Link>
              <button onClick={handleLogout} className="block text-red-400 py-2 text-sm">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              {/* <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm py-2 px-4 flex-1 text-center">Sign In</Link> */}
              <button type="button" onClick={openRegisterModal} className="btn-primary text-sm py-2 px-4 flex-1 text-center">Get Registered</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
