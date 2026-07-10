"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  studentName: string;
  registeredCourse: string;
  studentEmail: string;
  registrationId: string;
  registrationDate: string;
  onClose?: () => void;
  onDashboardClick?: () => void;
}

export function RegistrationSuccessModal({
  isOpen,
  studentName,
  registeredCourse,
  studentEmail,
  registrationId,
  registrationDate,
  onClose,
  onDashboardClick,
}: RegistrationSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti after a short delay
      const timer = setTimeout(() => setShowConfetti(true), 300);

      // Auto-hide confetti after 8 seconds
      const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowConfetti(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti Animation */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={220}
              gravity={0.45}
              colors={["#60A5FA", "#7C3AED", "#F8FAFC", "#38BDF8"]}
              tweenDuration={3000}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            {/* Glassmorphic Modal */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
            >
              {/* Header Gradient Background */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative p-8">
                {/* Success Animation - Green Check Circle */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative w-24 h-24">
                    {/* Outer circle animation */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400 border-r-green-400"
                    />

                    {/* Inner circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                          className="text-4xl text-white"
                        >
                          ✓
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  🎉 Registration Successful!
                </motion.h2>

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-8 rounded-2xl border border-cyan-400/20 bg-slate-900/40 p-4 text-center text-sm leading-7 text-gray-300 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                >
                  <p>Thank you for registering with Nexus Orbit Academy.</p>
                  <p>Our team has received your registration successfully.</p>
                  <p>A confirmation email with your Welcome Card will be sent shortly.</p>
                </motion.div>

                {/* Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 mb-8"
                >
                  {/* Detail Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Student Name */}
                    <DetailCard
                      label="Student Name"
                      value={studentName}
                      icon="👤"
                    />

                    {/* Email */}
                    <DetailCard
                      label="Email Address"
                      value={studentEmail}
                      icon="📧"
                    />

                    {/* Course */}
                    <DetailCard
                      label="Registered Course"
                      value={registeredCourse}
                      icon="📚"
                    />

                    {/* Registration ID */}
                    <DetailCard
                      label="Registration ID"
                      value={registrationId}
                      icon="🆔"
                    />
                  </div>

                  {/* Current Date - Full Width */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Registration Date</div>
                      <div className="text-sm font-semibold text-blue-300">{registrationDate}</div>
                    </div>
                    <span className="text-xl">📅</span>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-6" />

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-3"
                >
                  {/* Primary Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onDashboardClick?.();
                      handleClose();
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70"
                  >
                    Explore Courses →
                  </motion.button>

                  {/* Secondary Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-700 hover:to-slate-800 text-gray-200 font-semibold py-3 px-4 rounded-lg border border-purple-500/20 transition-all duration-300"
                  >
                    Close
                  </motion.button>
                </motion.div>

                {/* Info Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-gray-500 mt-4 italic"
                >
                  A welcome email with course details has been sent to {studentEmail}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Detail Card Component
 */
function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-3 cursor-default transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
            {label}
          </div>
          <div className="text-sm font-semibold text-gray-200 truncate" title={value}>
            {value}
          </div>
        </div>
        {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
      </div>
    </motion.div>
  );
}
