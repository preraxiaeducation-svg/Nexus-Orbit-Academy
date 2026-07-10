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

function DisclaimerSection({ title, children }: { title: string; children: ReactNode }) {
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

export function DisclaimerContent() {
  const thirdPartyExamples = [
    "NASA Public APIs",
    "ESA (European Space Agency)",
    "ISRO",
    "JAXA",
    "CSA",
    "NOAA",
    "OpenAI",
    "Anthropic Claude",
    "Google Gemini",
    "Other official educational or scientific APIs added in the future",
  ];

  const futureExplorerOrganizations = ["ISRO", "ESA", "JAXA", "CSA", "NOAA", "and other official agencies"];

  const aiProviders = ["OpenAI", "Anthropic Claude", "Google Gemini", "or other providers"];

  return (
    <main className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/10 bg-black/20 px-6 py-16 shadow-[0_0_80px_rgba(0,217,255,0.08)] backdrop-blur-2xl sm:px-10 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.18),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(255,191,0,0.16),_transparent_24%)] opacity-80" />
        <div className="absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="relative z-10 max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Disclaimer
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Disclaimer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 max-w-3xl text-lg leading-8 text-gray-300 sm:text-xl"
          >
            Please read this Disclaimer carefully before using the Nexus Orbit Academy website, educational resources, and integrated third-party services.
          </motion.p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300 shadow-[0_0_40px_rgba(0,217,255,0.08)]">
              <p className="font-semibold text-cyan-200">Purpose</p>
              <p className="mt-2 text-gray-400">Educational guidance and public discovery content for learners, researchers, and curious explorers.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300 shadow-[0_0_40px_rgba(255,191,0,0.05)]">
              <p className="font-semibold text-amber-300">Scope</p>
              <p className="mt-2 text-gray-400">Covers website use, public APIs, AI-driven features, and third-party content integration.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <DisclaimerSection title="Educational Purpose">
            <p className="text-gray-300 leading-8">
              Nexus Orbit Academy is an educational platform created to provide learning resources, technology education, research-oriented content, and interactive learning experiences. The content is intended for educational and informational purposes only and should not be considered professional engineering, legal, financial, medical, or scientific advice.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="Third-Party APIs & Services">
            <p className="mb-5 text-gray-300 leading-8">
              The platform may integrate publicly available services and APIs from trusted organizations. Examples include:
            </p>
            <ul className="space-y-3 text-gray-300">
              {thirdPartyExamples.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-300 leading-8">
              All trademarks, logos, images, videos, names, and data belong to their respective owners. Nexus Orbit Academy does not claim ownership of any third-party content.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="NASA Explorer Disclaimer">
            <p className="text-gray-300 leading-8">
              NASA Explorer displays publicly available information provided through official NASA public APIs. Nexus Orbit Academy is an independent educational platform and is not affiliated with, endorsed by, sponsored by, or officially connected with NASA. NASA names, logos, images, videos, mission information, and related materials remain the property of NASA where applicable.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="Future Explorer Pages">
            <p className="mb-5 text-gray-300 leading-8">
              Future explorer sections may include public educational resources from organizations such as:
            </p>
            <ul className="space-y-3 text-gray-300">
              {futureExplorerOrganizations.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-300 leading-8">
              These resources are displayed only for educational purposes.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="Content Accuracy">
            <p className="text-gray-300 leading-8">
              While every effort is made to provide accurate educational information, the platform cannot guarantee that all third-party content, API responses, mission data, or external resources are always complete, current, or error-free.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="External Links">
            <p className="text-gray-300 leading-8">
              The website may contain links to third-party websites. Nexus Orbit Academy is not responsible for the content, availability, or privacy practices of external websites.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="AI Services Disclaimer">
            <p className="mb-5 text-gray-300 leading-8">
              Future AI-powered features may use external AI services such as:
            </p>
            <ul className="space-y-3 text-gray-300">
              {aiProviders.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-300 leading-8">
              AI-generated responses are intended to assist learning and should not be treated as official professional advice.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="Beta Version Notice">
            <p className="text-gray-300 leading-8">
              The website is currently in a public trial or beta phase. Features, design, content, and functionality may change, improve, or be removed without prior notice.
            </p>
          </DisclaimerSection>

          <DisclaimerSection title="Intellectual Property">
            <p className="text-gray-300 leading-8">
              All original content created by Nexus Orbit Academy, including website design, branding, logos, graphics, course structures, original educational materials, and software, remain the intellectual property of Nexus Orbit Academy or Preraxia Nexus unless otherwise stated.
            </p>
          </DisclaimerSection>
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
            <p className="mt-4 text-gray-300 leading-7">A Branch of Preraxia Nexus</p>
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
              This disclaimer is designed to remain future-ready as new APIs, educational partners, and AI services are introduced.
            </p>
            <p className="mt-6 text-sm text-gray-500">Last Updated July 2026</p>
          </motion.div>
        </aside>
      </div>
    </main>
  );
}
