"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RegistrationSuccessModal } from "@/components/registration/RegistrationSuccessModal";

export interface InterestRegistrationPayload {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  mobileNumber: string;
  country: string;
  state: string;
  city: string;
  highestQualification: string;
  schoolCollege: string;
  preferredDepartment: string;
  preferredCourseLevel: string;
  preferredLanguage: string;
}

interface InterestRegistrationFormProps {
  onSuccess?: (registration: { id: string }) => void;
  onCancel?: () => void;
}

const initialForm: InterestRegistrationPayload = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  nationality: "",
  email: "",
  mobileNumber: "",
  country: "",
  state: "",
  city: "",
  highestQualification: "",
  schoolCollege: "",
  preferredDepartment: "",
  preferredCourseLevel: "",
  preferredLanguage: "",
};

const REQUIRED_FIELDS: Array<keyof InterestRegistrationPayload> = [
  "fullName",
  "gender",
  "dateOfBirth",
  "nationality",
  "email",
  "mobileNumber",
  "country",
  "state",
  "city",
  "highestQualification",
  "schoolCollege",
  "preferredDepartment",
  "preferredCourseLevel",
  "preferredLanguage",
];

export function InterestRegistrationForm({ onSuccess, onCancel }: InterestRegistrationFormProps) {
  const [form, setForm] = useState<InterestRegistrationPayload>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof InterestRegistrationPayload, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [successData, setSuccessData] = useState<{
    id: string;
    fullName: string;
    email: string;
    preferredDepartment: string;
    createdAt: string;
  } | null>(null);

  const departmentOptions = useMemo(
    () => [
      { value: "AEROSPACE", label: "Aerospace Engineering" },
      { value: "AI_ML", label: "AI & Machine Learning" },
      { value: "SPACE_TECH", label: "Space Technology" },
      { value: "UNIVERSE", label: "Universe Department" },
    ],
    []
  );

  const levelOptions = useMemo(
    () => [
      { value: "BEGINNER", label: "Beginner" },
      { value: "INTERMEDIATE", label: "Intermediate" },
      { value: "ADVANCED", label: "Advanced" },
    ],
    []
  );

  const updateField = (field: keyof InterestRegistrationPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof InterestRegistrationPayload, string>> = {};

    REQUIRED_FIELDS.forEach((field) => {
      const value = form[field].trim();
      if (!value) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.mobileNumber && form.mobileNumber.replace(/\D/g, "").length < 7) {
      nextErrors.mobileNumber = "Please enter a valid mobile number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCancel = () => {
    setSubmitError("");
    setConsentError("");
    setAcceptedTerms(false);
    setErrors({});
    if (onCancel) {
      onCancel();
      return;
    }
    setForm(initialForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError("");

    if (!acceptedTerms) {
      setConsentError("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data?.error || "We could not save your interest right now.");
        return;
      }

      // Store registration data for success modal
      const registrationId = data.registration.id;
      setSuccessData({
        id: registrationId,
        fullName: form.fullName,
        email: form.email,
        preferredDepartment: form.preferredDepartment,
        createdAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      // Mark as submitted first (triggers re-render)
      setSubmitted(true);

      // Show modal with slight delay to ensure state is synced
      setTimeout(() => setShowSuccessModal(true), 50);

      onSuccess?.(data.registration);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success Modal JSX
  const successModalJSX = (
    <RegistrationSuccessModal
      isOpen={showSuccessModal}
      studentName={successData?.fullName || "Student"}
      registeredCourse={
        form.preferredDepartment === "AEROSPACE"
          ? "Aerospace Engineering"
          : form.preferredDepartment === "AI_ML"
          ? "AI & Machine Learning"
          : form.preferredDepartment === "SPACE_TECH"
          ? "Space Technology"
          : form.preferredDepartment === "UNIVERSE"
          ? "Astronomy & Universe"
          : "Nexus Orbit Academy Program"
      }
      studentEmail={successData?.email || ""}
      registrationId={successData?.id || ""}
      registrationDate={successData?.createdAt || ""}
      onClose={() => {
        setShowSuccessModal(false);
        setSubmitted(false);
        setForm(initialForm);
      }}
      onDashboardClick={() => {
        window.location.href = "/courses";
      }}
    />
  );

  if (submitted) {
    return (
      <>
        {/* Success Modal - Always render when submitted */}
        {successModalJSX}

        <div className="w-full max-w-5xl animate-fade-in-up">
          <div className="glass-card p-8 text-center relative overflow-hidden">
            <div className="hero-glow-strong absolute inset-0 pointer-events-none" />
            <div className="relative space-y-4">
              <div className="text-5xl">🚀</div>
              <h2 className="text-2xl font-bold text-white orbit-heading">
                Interest Received
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed body-copy">
                Thanks for expressing interest in Nexus Orbit Academy. Our admissions team will contact you shortly with the next steps.
              </p>
              <button onClick={() => { setShowSuccessModal(false); setSubmitted(false); setForm(initialForm); }} className="btn-secondary px-6 py-3">
                Register Another Interest
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6 animate-fade-in-up">
      {submitError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          ⚠ {submitError}
        </div>
      )}

      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="relative space-y-6">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Official Registration
            </div>
            <div className="mb-3 text-4xl">🛰️</div>
            <h1 className="text-2xl font-bold text-white orbit-heading">
              Interest Registration Form
            </h1>
            <p className="mt-2 text-sm leading-7 text-gray-500 body-copy">
              Share your background and preferences so we can guide you toward the right program with a more personalized experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="input-field" placeholder="Enter your full name" />
              {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Gender</label>
              <select title="Gender" value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className="input-field w-full appearance-none bg-gradient-to-br from-purple-600/80 via-violet-700/80 to-indigo-900/90 text-white border border-purple-400/40 rounded-xl px-4 py-3 text-sm shadow-[0_0_20px_rgba(123,47,247,0.18)] focus:outline-none focus:border-purple-300 transition-colors">
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON_BINARY">Non-binary</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date of Birth</label>
              <input title="Date of birth" type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className="input-field" />
              {errors.dateOfBirth && <p className="text-xs text-red-400 mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nationality</label>
              <input value={form.nationality} onChange={(e) => updateField("nationality", e.target.value)} className="input-field" placeholder="e.g. Indian" />
              {errors.nationality && <p className="text-xs text-red-400 mt-1">{errors.nationality}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="input-field" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mobile Number</label>
              <input value={form.mobileNumber} onChange={(e) => updateField("mobileNumber", e.target.value)} className="input-field" placeholder="+91 99999 99999" />
              {errors.mobileNumber && <p className="text-xs text-red-400 mt-1">{errors.mobileNumber}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Country</label>
              <input value={form.country} onChange={(e) => updateField("country", e.target.value)} className="input-field" placeholder="Country" />
              {errors.country && <p className="text-xs text-red-400 mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">State</label>
              <input value={form.state} onChange={(e) => updateField("state", e.target.value)} className="input-field" placeholder="State" />
              {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">City</label>
              <input value={form.city} onChange={(e) => updateField("city", e.target.value)} className="input-field" placeholder="City" />
              {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Highest Qualification</label>
              <input value={form.highestQualification} onChange={(e) => updateField("highestQualification", e.target.value)} className="input-field" placeholder="e.g. B.Tech / High School" />
              {errors.highestQualification && <p className="text-xs text-red-400 mt-1">{errors.highestQualification}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">School / College</label>
              <input value={form.schoolCollege} onChange={(e) => updateField("schoolCollege", e.target.value)} className="input-field" placeholder="Institution name" />
              {errors.schoolCollege && <p className="text-xs text-red-400 mt-1">{errors.schoolCollege}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Preferred Department</label>
              <select title="Preferred department" value={form.preferredDepartment} onChange={(e) => updateField("preferredDepartment", e.target.value)} className="input-field w-full appearance-none bg-gradient-to-br from-purple-600/80 via-violet-700/80 to-indigo-900/90 text-white border border-purple-400/40 rounded-xl px-4 py-3 text-sm shadow-[0_0_20px_rgba(123,47,247,0.18)] focus:outline-none focus:border-purple-300 transition-colors">
                <option value="">Choose a department</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.preferredDepartment && <p className="text-xs text-red-400 mt-1">{errors.preferredDepartment}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Preferred Course Level</label>
              <select title="Preferred course level" value={form.preferredCourseLevel} onChange={(e) => updateField("preferredCourseLevel", e.target.value)} className="input-field w-full appearance-none bg-gradient-to-br from-purple-600/80 via-violet-700/80 to-indigo-900/90 text-white border border-purple-400/40 rounded-xl px-4 py-3 text-sm shadow-[0_0_20px_rgba(123,47,247,0.18)] focus:outline-none focus:border-purple-300 transition-colors">
                <option value="">Choose a level</option>
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.preferredCourseLevel && <p className="text-xs text-red-400 mt-1">{errors.preferredCourseLevel}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Preferred Language</label>
              <input value={form.preferredLanguage} onChange={(e) => updateField("preferredLanguage", e.target.value)} className="input-field" placeholder="e.g. English" />
              {errors.preferredLanguage && <p className="text-xs text-red-400 mt-1">{errors.preferredLanguage}</p>}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-cyan-400/25 bg-slate-900/45 p-4 shadow-[0_0_25px_rgba(34,211,238,0.08)] backdrop-blur-xl">
            <label className="group flex cursor-pointer items-start gap-3" htmlFor="legal-consent">
              <motion.input
                id="legal-consent"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (e.target.checked) {
                    setConsentError("");
                  }
                }}
                className="mt-1 h-5 w-5 rounded border border-cyan-400/50 bg-slate-950/80 accent-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-all duration-200 group-hover:shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                aria-label="Accept Terms and Conditions and Privacy Policy"
              />
              <span className="text-sm leading-6 text-white">
                I have read and agree to the{' '}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-300 transition-colors duration-200 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-300 transition-colors duration-200 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Privacy Policy
                </a>{' '}
                of Nexus Orbit Academy.
              </span>
            </label>

            <AnimatePresence mode="wait">
              {consentError && (
                <motion.p
                  key="consent-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 text-sm text-amber-300"
                  aria-live="polite"
                >
                  {consentError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleCancel} className="btn-secondary px-6 py-3">
              Cancel
            </button>
            <button type="submit" disabled={loading || !acceptedTerms} className="btn-primary px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Submitting…" : "Register Now"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
