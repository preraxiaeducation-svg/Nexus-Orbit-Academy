"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { InterestRegistrationForm } from "@/components/interest/InterestRegistrationForm";

interface ContactFormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

const initialForm: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
};

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
      <p className="section-subheading mx-auto text-base leading-8" style={{ fontFamily: "Inter, sans-serif" }}>
        {description}
      </p>
    </div>
  );
}

function InfoCard({ icon, title, value, accent = "cyan" }: { icon: string; title: string; value: string; accent?: "cyan" | "purple" }) {
  const accentClasses = accent === "purple" ? "text-purple-400" : "text-cyan-400";
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card p-6"
    >
      <p className="mb-3 text-2xl">{icon}</p>
      <p className={`mb-2 text-sm font-semibold uppercase tracking-[0.25em] ${accentClasses}`}>{title}</p>
      <p className="text-base leading-7 text-gray-300" style={{ fontFamily: "Inter, sans-serif" }}>
        {value}
      </p>
    </motion.article>
  );
}

function WhyCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="glass-card p-6"
    >
      <h3 className="mb-2 text-lg font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
        {title}
      </h3>
      <p className="text-sm leading-7 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
        {description}
      </p>
    </motion.article>
  );
}

function ContactCTAButtons() {
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

export default function ContactPageContent() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const updateField = (field: keyof ContactFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value } as ContactFormState));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionError("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!form.message.trim()) nextErrors.message = "Message is required.";
    if (!form.consent) nextErrors.consent = "Please agree to the Privacy Policy.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      setSubmissionError("Please review the highlighted fields before sending your message.");
      return;
    }

    setLoading(true);
    setSubmissionError("");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <main className="pt-24">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(123,47,247,0.16),transparent_45%)]" />
        <div className="absolute left-6 top-20 h-24 w-24 rounded-full border border-cyan-400/20" />
        <div className="absolute bottom-12 right-10 h-40 w-40 rounded-full border border-purple-500/20" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-6xl text-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            Premium Contact & Enquiries
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Contact <span className="gradient-text">Nexus Orbit Academy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400 sm:text-xl" style={{ fontFamily: "Inter, sans-serif" }}>
            Have questions about our courses, NASA Explorer, future learning programs, or partnerships? We&apos;re here to help.
          </p>
          <div className="mt-10">
            <ContactCTAButtons />
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Contact Information"
            title="Reach the academy through premium support channels"
            description="Whether you are exploring programs or need guidance, our team is here to help with clear and direct communication."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <InfoCard icon="📍" title="Address" value="Rourkela, Sundargarh, Odisha, India – 770043" />
            <InfoCard icon="📧" title="Email" value="preraxia@gmail.com" accent="purple" />
            <InfoCard icon="📞" title="Phone" value="+91 8984039105" />
            <InfoCard icon="🏢" title="Organization" value="Nexus Orbit Academy\nA Branch of Preraxia Nexus" accent="purple" />
            <InfoCard icon="🕒" title="Working Hours" value="Monday – Saturday\n9:00 AM – 6:00 PM (IST)\nSunday Closed" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} className="glass-card p-8 sm:p-10">
            <SectionHeading
              eyebrow="Premium Contact Form"
              title="Send us a message"
              description="Fill in your details and we will get back to you shortly. This form is prepared for future backend integration."
            />
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              {submitted && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-300" role="status">
                  Your message has been prepared successfully. We will contact you soon.
                </div>
              )}
              {submissionError && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300" role="alert">
                  {submissionError}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm text-gray-400">Full Name</label>
                  <input id="fullName" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="input-field" placeholder="Enter your full name" />
                  {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-gray-400">Email Address</label>
                  <input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input-field" placeholder="you@example.com" />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm text-gray-400">Phone Number</label>
                  <input id="phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="input-field" placeholder="+91 8984039105" />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm text-gray-400">Subject</label>
                  <input id="subject" value={form.subject} onChange={(e) => updateField("subject", e.target.value)} className="input-field" placeholder="What do you want to discuss?" />
                  {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-gray-400">Message</label>
                <textarea id="message" value={form.message} onChange={(e) => updateField("message", e.target.value)} rows={6} className="input-field min-h-[170px] resize-y" placeholder="Write your message here..." />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-300">
                <input type="checkbox" checked={form.consent} onChange={(e) => updateField("consent", e.target.checked)} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
                <span>
                  I agree to the <Link href="/privacy-policy" className="text-cyan-300 hover:text-cyan-200">Privacy Policy</Link>.
                </span>
              </label>
              {errors.consent && <p className="text-xs text-red-400">{errors.consent}</p>}

              <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
                {loading ? "Sending…" : "Send Message 🚀"}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} className="space-y-6">
            <div className="glass-card p-8">
              <SectionHeading
                eyebrow="Why Contact Us"
                title="Support for every stage of your journey"
                description="Choose the right path for your goals and get clarity on your next step."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <WhyCard title="Course Guidance" description="Need help choosing the right learning path?" />
                <WhyCard title="Partnerships" description="Collaborate with Nexus Orbit Academy." />
                <WhyCard title="Career Opportunities" description="Future internship and career enquiries." />
                <WhyCard title="Technical Support" description="Website and technical assistance." />
                <WhyCard title="General Questions" description="Ask anything about the academy." />
                <WhyCard title="Feedback" description="Help us improve the platform." />
              </div>
            </div>

            <div className="glass-card p-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">Office Location</p>
              <h3 className="mb-4 text-2xl font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Visit our campus address
              </h3>
              <p className="text-sm leading-8 text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                Rourkela, Sundargarh, Odisha, India – 770043
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-gray-400">
                Google Maps integration can be added here in the future.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="Helpful answers for prospective students and partners"
            description="Everything you need to know before reaching out to the academy."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-card p-8">
              <div className="space-y-3">
                {[
                  {
                    question: "How can I register?",
                    answer: "Use the Get Registered button available throughout the website.",
                  },
                  {
                    question: "Are Beginner courses free?",
                    answer: "Yes. Beginner courses are available free of charge.",
                  },
                  {
                    question: "Is NASA Explorer free?",
                    answer: "Yes. NASA Explorer provides access to publicly available NASA educational resources.",
                  },
                  {
                    question: "Will AI Tutor be available?",
                    answer: "Yes. AI Tutor is currently under development and will be introduced in a future update.",
                  },
                  {
                    question: "How can I contact the academy?",
                    answer: "Use the contact form, email or phone number listed on this page.",
                  },
                ].map((item) => (
                  <details key={item.question} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold text-white">{item.question}</summary>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Response Time</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-lg font-semibold text-white">📬 Email Support</p>
                  <p className="mt-2 text-sm leading-7 text-gray-400">Within 24–48 hours</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-lg font-semibold text-white">☎ Phone Support</p>
                  <p className="mt-2 text-sm leading-7 text-gray-400">Monday – Saturday, 9:00 AM – 6:00 PM (IST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-400/10 p-8 shadow-[0_0_80px_rgba(0,217,255,0.14)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Ready to Begin?</p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Ready to Begin Your Journey?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Join the next generation of Aerospace Engineers, AI Innovators, and Space Explorers.
            </p>
            <div className="mt-8">
              <ContactCTAButtons />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
