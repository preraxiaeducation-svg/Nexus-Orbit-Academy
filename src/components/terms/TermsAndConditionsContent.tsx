"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="section-heading mb-4 text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
      {title}
    </h2>
  );
}

function TermsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card border border-white/10 bg-black/20 p-8 sm:p-10"
    >
      <SectionHeading title={title} />
      {children}
    </motion.article>
  );
}

export function TermsAndConditionsContent() {
  return (
    <main className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-black/20 px-6 py-16 shadow-[0_0_80px_rgba(0,217,255,0.08)] backdrop-blur-2xl sm:px-10 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.18),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(255,191,0,0.16),_transparent_24%)] opacity-80" />
        <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="relative z-10 max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Terms & Conditions
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl"
          >
            Please read these Terms & Conditions carefully before using the Nexus Orbit Academy website and services.
          </motion.p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300 shadow-[0_0_40px_rgba(0,217,255,0.08)]">
              <p className="font-semibold text-cyan-200">Scope</p>
              <p className="mt-2 text-gray-400">These terms apply to visitors, learners, and users of the academy platform.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300 shadow-[0_0_40px_rgba(255,191,0,0.05)]">
              <p className="font-semibold text-amber-300">Purpose</p>
              <p className="mt-2 text-gray-400">They help define acceptable use while keeping the platform scalable for future growth.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <TermsSection title="Introduction">
            <p className="text-gray-300 leading-8">
              These Terms & Conditions govern the use of the Nexus Orbit Academy website and related services. Nexus Orbit Academy is a branch of Preraxia Nexus, and by using the website, visitors agree to these terms and any future updates made available on this page.
            </p>
          </TermsSection>

          <TermsSection title="Website Usage">
            <p className="mb-5 text-gray-300 leading-8">
              Users agree to use the website in a lawful, respectful, and responsible manner.
            </p>
            <ul className="space-y-3 text-gray-300">
              {[
                "Use the website lawfully",
                "Provide accurate information during registration",
                "Respect intellectual property",
                "Avoid misuse of the platform",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-300 leading-8">
              Prohibited activities include hacking, attempting unauthorized access, uploading malicious software, spamming, and copying website content without permission.
            </p>
          </TermsSection>

          <TermsSection title="Courses & Educational Content">
            <p className="text-gray-300 leading-8">
              Courses are provided for educational purposes. Some courses are free, while others may become premium in the future. Course content may be updated, improved, or replaced over time as the platform develops.
            </p>
          </TermsSection>

          <TermsSection title="Registration">
            <p className="text-gray-300 leading-8">
              Users are responsible for providing accurate information when registering. Submitting the registration form does not automatically create a student account or guarantee admission to any course or program.
            </p>
          </TermsSection>

          <TermsSection title="NASA Explorer">
            <p className="text-gray-300 leading-8">
              NASA Explorer displays publicly available resources provided through official NASA public APIs. NASA content remains the property of NASA or the relevant rights holders. Nexus Orbit Academy does not claim ownership of NASA materials, and NASA Explorer is provided as an educational resource.
            </p>
          </TermsSection>

          <TermsSection title="Intellectual Property">
            <p className="text-gray-300 leading-8">
              Website design, academy branding, logos, course structure, graphics, and original educational content are owned by Nexus Orbit Academy or Preraxia Nexus unless otherwise stated. Users may not copy, reproduce, distribute, or commercially use this content without permission.
            </p>
          </TermsSection>

          <TermsSection title="Third Party Services">
            <p className="text-gray-300 leading-8">
              The website may integrate with third party services including Google Analytics, Microsoft Clarity, NASA public APIs, cloud hosting providers, and email services. Each service may have its own terms and privacy policies that users should review.
            </p>
          </TermsSection>

          <TermsSection title="Availability">
            <p className="text-gray-300 leading-8">
              The website may occasionally undergo maintenance, updates, or temporary downtime. Features may change during the trial or beta phase as the platform evolves.
            </p>
          </TermsSection>

          <TermsSection title="Limitation of Liability">
            <p className="text-gray-300 leading-8">
              Nexus Orbit Academy strives to provide accurate educational content, but cannot guarantee that all information will always be complete or error-free. Users are responsible for how they use the educational materials and any decisions they make based on them.
            </p>
          </TermsSection>

          <TermsSection title="Changes to Terms">
            <p className="text-gray-300 leading-8">
              These Terms & Conditions may be updated from time to time. The latest version will always be available on this page for review.
            </p>
          </TermsSection>
        </div>

        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="glass-card border border-white/10 bg-black/20 p-8 shadow-[0_0_40px_rgba(0,217,255,0.08)]"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Contact</p>
            <h3 className="mt-4 text-2xl font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Nexus Orbit Academy
            </h3>
            <p className="mt-4 text-gray-300 leading-7">A branch of Preraxia Nexus</p>
            <div className="mt-6 space-y-3 text-gray-300">
              <p>
                <span className="font-semibold text-white">Address:</span> Rourkela, Sundargarh, Odisha, India – 770043
              </p>
              <p>
                <span className="font-semibold text-white">Email:</span> preraxia@gmail.com
              </p>
              <p>
                <span className="font-semibold text-white">Phone:</span> +91 8984039105
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="glass-card border border-white/10 bg-black/20 p-8 shadow-[0_0_40px_rgba(255,191,0,0.06)]"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Status</p>
            <p className="mt-4 text-gray-300 leading-8">
              These terms are suitable for the current public trial version of the website and can be scaled for future commercial use.
            </p>
            <p className="mt-6 text-sm text-gray-500">Last Updated July 2026</p>
          </motion.div>
        </aside>
      </div>
    </main>
  );
}
