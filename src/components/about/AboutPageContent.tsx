"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { InterestRegistrationForm } from "@/components/interest/InterestRegistrationForm";

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left"}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
      <p className="section-subheading mx-auto text-base leading-8" style={{ fontFamily: "Inter, sans-serif" }}>
        {description}
      </p>
    </div>
  );
}

function AnimatedCounter({ value, label, suffix = "" }: StatItem) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-card p-6 text-center"
    >
      <div className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {displayValue}{suffix}
      </div>
      <p className="mt-2 text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </p>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card p-6"
    >
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm leading-7 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
        {description}
      </p>
    </motion.article>
  );
}

function MissionCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card p-6"
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm leading-7 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
        {description}
      </p>
    </motion.article>
  );
}

function DepartmentCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card p-6 flex h-full flex-col"
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-3 text-xl font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {title}
      </h3>
      <p className="flex-1 text-sm leading-7 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
        {description}
      </p>
      <Link href="/courses" className="mt-6 inline-flex items-center text-sm font-semibold text-cyan-400 transition hover:text-cyan-300">
        Explore Courses →
      </Link>
    </motion.article>
  );
}

function JourneyStep({ step, label }: { step: string; label: string }) {
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-5 text-center">
      <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
        {step}
      </div>
      <div className="text-sm font-medium text-white" style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </div>
    </div>
  );
}

function AboutCTAButtons() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/courses" className="btn-primary px-8 py-4 text-base">
          Explore Courses
        </Link>
        <button type="button" onClick={() => setShowRegisterModal(true)} className="btn-secondary px-8 py-4 text-base">
          Get Registered
        </button>
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
    </>
  );
}

const missionCards = [
  { icon: "🧠", title: "Technology Education", description: "Structured, future-focused learning pathways in aerospace, AI, and space sciences." },
  { icon: "🚀", title: "Innovation", description: "Creative problem solving through project-driven experiences and modern digital tools." },
  { icon: "🔬", title: "Research", description: "A learning ecosystem that supports curiosity, inquiry, and scientific thinking." },
  { icon: "🛠️", title: "Project Based Learning", description: "Turning theory into meaningful work through applied and hands-on experiences." },
  { icon: "🌐", title: "Future Skills", description: "Preparing learners for the technologies shaping tomorrow’s careers and industries." },
  { icon: "🤖", title: "AI Assisted Learning", description: "Using intelligent guidance to make educational journeys more adaptive and engaging." },
  { icon: "🌍", title: "Global Accessibility", description: "Delivering quality education that is reachable from anywhere in the world." },
];

const values = [
  { icon: "✨", title: "Innovation", description: "Building learning experiences that stay ahead of the future." },
  { icon: "🔭", title: "Curiosity", description: "Encouraging learners to explore the unknown with confidence." },
  { icon: "🛡️", title: "Integrity", description: "Maintaining trust, clarity, and ethical growth in every learning journey." },
  { icon: "🎨", title: "Creativity", description: "Blending science, design, and technology into meaningful learning." },
  { icon: "📚", title: "Research", description: "Developing knowledge through structured inquiry and exploration." },
  { icon: "♾️", title: "Continuous Learning", description: "Creating a culture of consistent growth and mastery." },
  { icon: "🤝", title: "Collaboration", description: "Supporting collective discovery and peer-based learning." },
  { icon: "⭐", title: "Excellence", description: "Delivering thoughtful, modern education with high standards." },
];

const departments = [
  {
    icon: "🚀",
    title: "Aerospace Engineering",
    description: "Study aircraft, flight physics, aerodynamics, propulsion, and future aviation technologies.",
  },
  {
    icon: "🤖",
    title: "AI & Machine Learning",
    description: "Learn machine learning, deep learning, neural networks, computer vision, and modern AI systems.",
  },
  {
    icon: "🌌",
    title: "Space Technology",
    description: "Explore rockets, satellites, orbital mechanics, spacecraft systems, and future space missions.",
  },
  {
    icon: "🪐",
    title: "Universe Department",
    description: "Discover astronomy, astrophysics, cosmology, planetary science, galaxies, stars, black holes, and the evolution of the universe.",
  },
];

const journeySteps = ["Register", "Choose Course", "Learn", "Practice", "Complete Lessons", "Explore NASA Resources", "Future AI Tutor", "Projects", "Career Growth"];

const reasons = [
  { icon: "🌍", title: "International Standard Curriculum", description: "Thoughtfully structured learning paths designed for modern academic and professional relevance." },
  { icon: "🧩", title: "Interactive Learning Experience", description: "Immersive, engaging study experiences that encourage deeper understanding and participation." },
  { icon: "🛰️", title: "NASA Explorer", description: "Connect your learning journey to official public space and science resources." },
  { icon: "🤖", title: "Future AI Tutor", description: "A smart companion that helps learners navigate concepts with contextual support." },
  { icon: "🛠️", title: "Project Based Learning", description: "Apply knowledge through projects that reinforce research and real-world thinking." },
  { icon: "🔬", title: "Research Focused Education", description: "Build inquiry-based skills through exploration, reflection, and modern study methods." },
  { icon: "⚡", title: "Modern Technology Platform", description: "Enjoy a fast, elegant, and responsive environment built for digital learning." },
  { icon: "🌟", title: "Lifetime Learning", description: "Develop a sustainable learning habit that grows with your ambitions and career." },
];

const platformFeatures = [
  { icon: "📱", title: "Responsive Design", description: "Study seamlessly across desktop, tablet, and mobile devices." },
  { icon: "🔐", title: "Secure Platform", description: "A protected learning environment built with careful digital standards." },
  { icon: "⚡", title: "Fast Performance", description: "Smooth experiences with optimized content delivery and modern architecture." },
  { icon: "🎨", title: "Modern UI", description: "A polished, premium visual experience aligned with the academy’s identity." },
  { icon: "🧠", title: "Interactive Courses", description: "Meaningful content that invites curiosity beyond passive reading." },
  { icon: "📈", title: "Real Progress Tracking", description: "Monitor learning milestones and stay engaged with your path forward." },
  { icon: "🛰️", title: "Future Ready Architecture", description: "A platform designed to grow with additional learning experiences and technologies." },
];

const roadmap = [
  { phase: "Phase 1", title: "Public Website", description: "A polished gateway for learners to discover the academy and its vision." },
  { phase: "Phase 2", title: "Student Dashboard", description: "A personalized environment for courses, progress, and learning continuity." },
  { phase: "Phase 3", title: "AI Tutor", description: "Intelligent guidance that supports independent study and deeper understanding." },
  { phase: "Phase 4", title: "Interactive Labs", description: "Hands-on learning experiences that bring concepts to life in practice." },
  { phase: "Phase 5", title: "Global Learning Platform", description: "Expanding access to quality science and technology education worldwide." },
];

const stats = [
  { value: 4, label: "Departments" },
  { value: 8, label: "Course Tracks", suffix: "+" },
  { value: 60, label: "Lessons", suffix: "+" },
  { value: 12, label: "Research Topics", suffix: "+" },
  { value: 1000, label: "Growing Community", suffix: "+" },
];

export default function AboutPageContent() {
  return (
    <div className="pt-24">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(123,47,247,0.18),transparent_45%)]" />
        <div className="absolute left-6 top-20 h-24 w-24 rounded-full border border-cyan-400/20" />
        <div className="absolute bottom-12 right-10 h-40 w-40 rounded-full border border-purple-500/20" />
        <div className="absolute left-1/2 top-1/3 h-60 w-60 -translate-x-1/2 rounded-full border border-cyan-400/10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-6xl text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            Future-Ready Learning Platform
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
            About <span className="gradient-text">Nexus Orbit Academy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400 sm:text-xl" style={{ fontFamily: "Inter, sans-serif" }}>
            Empowering the next generation of aerospace engineers, AI innovators, and space explorers through world-class technology education.
          </p>
          <div className="mt-10">
            <AboutCTAButtons />
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-black/15 p-8 shadow-[0_0_80px_rgba(123,47,247,0.12)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Who We Are"
                title="A future-focused academy for advanced technology education"
                description="Nexus Orbit Academy is a futuristic online learning platform focused on advanced technology education. It is designed to help students learn through structured courses, practical knowledge, research-oriented learning, and modern digital experiences."
                align="left"
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Aerospace Engineering",
                  "Artificial Intelligence & Machine Learning",
                  "Space Technology",
                  "Universe Studies",
                ].map((item) => (
                  <div key={item} className="glass-card px-4 py-3 text-sm text-gray-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="glass-card p-8"
            >
              <div className="mb-4 text-5xl">🛰️</div>
              <h3 className="mb-3 text-2xl font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Designed for curious minds
              </h3>
              <p className="text-sm leading-8 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                We create an inspiring environment where students can build strong foundations in technology, explore emerging fields, and learn with purpose.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-2">
          <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="glass-card p-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">Our Vision</p>
            <h3 className="section-heading mb-4 text-left">To build a trusted platform for future technologies</h3>
            <p className="text-base leading-8 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
              To build one of the world&apos;s most trusted learning platforms for future technologies by making high-quality education accessible, practical, engaging, and research-driven for learners everywhere.
            </p>
          </motion.article>

          <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="glass-card p-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Our Mission</p>
            <h3 className="section-heading mb-4 text-left">Creating meaningful learning pathways for tomorrow</h3>
            <p className="text-base leading-8 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
              Nexus Orbit Academy exists to make advanced technology education more accessible, inspiring, and useful for learners who want to explore science, systems, innovation, and future careers.
            </p>
          </motion.article>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Mission"
            title="What guides every experience on our platform"
            description="We are building a learning environment rooted in future skills, deep curiosity, research thinking, and purposeful innovation."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {missionCards.map((item) => (
              <MissionCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Core Values"
            title="The principles behind the academy"
            description="Every course, experience, and interaction is shaped by values that support thoughtful growth and meaningful exploration."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {values.map((item) => (
              <motion.article
                key={item.title}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="glass-card p-6"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Departments"
            title="Explore the disciplines that shape the future"
            description="Our academic focus spans aerospace, artificial intelligence, space technology, and the universe sciences."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {departments.map((item) => (
              <DepartmentCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Learning Journey"
            title="A clear path from curiosity to capability"
            description="Every learner can move through an inspiring journey that blends discovery, practice, and growth."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {journeySteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <JourneyStep step={`0${index + 1}`} label={step} />
                {index < journeySteps.length - 1 && <div className="hidden text-2xl text-cyan-400 xl:block">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why Choose Nexus Orbit Academy"
            title="A premium platform for future-minded learners"
            description="We combine modern experience design with high-quality educational direction to create something meaningful and memorable."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {reasons.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Platform Features"
            title="Built for modern, responsive learning"
            description="The platform is designed to offer a smooth, accessible, and future-ready experience for every learner."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {platformFeatures.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Roadmap"
            title="A long-term vision for a global learning ecosystem"
            description="Our roadmap is focused on building the foundation for a richer, more interactive educational future."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            {roadmap.map((item) => (
              <motion.article key={item.phase} whileHover={{ y: -6 }} className="glass-card p-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">{item.phase}</p>
                <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Statistics"
            title="A growing foundation for future-focused education"
            description="These figures reflect a realistic launch scale for an ambitious academy experience."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((item) => (
              <AnimatedCounter key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-400/10 p-8 shadow-[0_0_80px_rgba(0,217,255,0.14)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Start Your Journey</p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Start your journey into the future
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-300" style={{ fontFamily: "Inter, sans-serif" }}>
              Discover the world of Aerospace Engineering, Artificial Intelligence, Space Technology, and Universe Sciences.
            </p>
            <div className="mt-8">
              <AboutCTAButtons />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-sm leading-8 text-gray-400 backdrop-blur-xl">
          Nexus Orbit Academy is committed to building an inspiring educational ecosystem where curiosity, innovation, and technology come together to prepare learners for the future.
        </div>
      </section>
    </div>
  );
}
