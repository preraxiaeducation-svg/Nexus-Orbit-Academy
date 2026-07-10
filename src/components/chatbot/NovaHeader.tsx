"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface NovaHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
}

export function NovaHeader({ onClose, onMinimize }: NovaHeaderProps) {
  return (
    <motion.div
      className="flex items-center justify-between p-3 border-b"
      style={{
        borderColor: "rgba(107, 99, 255, 0.2)",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 flex-1">
        {/* Logo with Glow */}
        <motion.div
          className="relative w-9 h-9 rounded-full flex-shrink-0"
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(107, 99, 255, 0.6)",
              "0 0 0 4px rgba(107, 99, 255, 0)",
              "0 0 0 0px rgba(107, 99, 255, 0.6)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#001fff", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#0066ff", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ffd700", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#ffed4e", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="60" fill="url(#blueGradient)" />
            <path d="M 70 140 L 90 60 M 110 60 L 130 140 M 75 110 L 125 110" stroke="url(#goldGradient)" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-bold text-xs leading-tight">Nova AI</h3>
          <p className="text-gray-400 text-[10px] leading-tight">Your AI Assistant</p>
        </div>

        {/* Online Status */}
        <div className="flex items-center gap-1 ml-auto">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#00D9FF" }}
            animate={{
              opacity: [0.4, 1, 0.4],
              boxShadow: ["0 0 0 0 rgba(0, 217, 255, 0.7)", "0 0 0 4px rgba(0, 217, 255, 0)"],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Close Button */}
      <motion.button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2 flex-shrink-0"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X size={14} className="text-gray-400" />
      </motion.button>
    </motion.div>
  );
}
