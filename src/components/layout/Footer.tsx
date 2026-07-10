"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRIMARY_LOGO_PATH, ACADEMY_NAME, ACADEMY_TAGLINE, SOCIAL_LINKS, CONTACT_EMAIL } from "@/config/branding";
import { DEPARTMENTS } from "@/config/departments";
import { InterestRegistrationForm } from "@/components/interest/InterestRegistrationForm";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [logoError, setLogoError] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <footer
      className="relative border-t mt-20"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(6,8,20,0.9)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 flex items-center justify-center">
                {!logoError ? (
                  <Image
                    src={PRIMARY_LOGO_PATH}
                    alt={ACADEMY_NAME}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-2xl">🌌</span>
                )}
              </div>
              <span
                className="font-bold"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "0.9rem",
                  background: "linear-gradient(135deg, #7b2ff7, #00d9ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {ACADEMY_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              {ACADEMY_TAGLINE}. International-standard courses built for the next generation of space explorers.
            </p>
            <div className="flex gap-3">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm">
                𝕏
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm">
                in
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm">
                ▶
              </a>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "0.05em" }}>
              Departments
            </h4>
            <ul className="space-y-2">
              {DEPARTMENTS.map((dept) => (
                <li key={dept.id}>
                  <Link
                    href={`/courses?department=${dept.id}`}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors flex items-center gap-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span>{dept.icon}</span>
                    <span>{dept.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "0.05em" }}>
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/courses", label: "All Courses" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Get Registered
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "0.05em" }}>
              Contact
            </h4>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-sm text-gray-600 mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Reach Beyond The Stars
            </p>
            <div className="mt-4 p-3 glass-card rounded-xl">
              <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Verify Certificate</p>
              <Link href="/verify" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                nexusorbitacademy.com/verify →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
            © {currentYear} {ACADEMY_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/disclaimer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8">
          <div className="relative w-full max-w-5xl">
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
    </footer>
  );
}
