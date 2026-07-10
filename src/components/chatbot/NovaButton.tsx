"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

interface NovaButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function NovaButton({ onClick, isOpen }: NovaButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Heartbeat animation pattern
  const heartbeatVariants: Variants = {
    animate: {
      scale: [1, 1.15, 1, 1, 1.1, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    static: {
      scale: 1,
    },
  };

  // Glow ring animation
  const glowRingVariants: Variants = {
    animate: {
      opacity: [0.8, 0.2, 0.8],
      boxShadow: [
        "0 0 0 0px rgba(107, 99, 255, 0.8)",
        "0 0 0 30px rgba(107, 99, 255, 0)",
        "0 0 0 0px rgba(107, 99, 255, 0.8)",
      ],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    static: {
      opacity: 0,
      boxShadow: "0 0 0 0px rgba(107, 99, 255, 0)",
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 focus:outline-none"
      whileHover={{ scale: 1.08 }}
      whileTap={{
        scale: 0.95,
      }}
    >
      {/* Outer Glow Circle - Heartbeat Effect */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: 80,
            height: 80,
            top: -12,
            left: -12,
          }}
          variants={glowRingVariants}
          animate={!isOpen ? "animate" : "static"}
        />
      )}

      {/* Orbit Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "2px solid rgba(107, 99, 255, 0.3)",
          width: 64,
          height: 64,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Button Container with Heartbeat */}
      <motion.div
        variants={heartbeatVariants}
        animate={!isOpen ? "animate" : "static"}
        className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(20, 25, 50, 0.95), rgba(15, 20, 40, 0.95))",
          border: "2px solid rgba(107, 99, 255, 0.7)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(107, 99, 255, 0.4), inset 0 0 20px rgba(107, 99, 255, 0.15)",
        }}
      >
        {/* Logo SVG */}
        <motion.div
          className="relative w-10 h-10"
          animate={!isOpen ? { rotateZ: [0, 2, -2, 0] } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-lg"
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
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Ring */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="url(#blueGradient)"
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Left Wing */}
            <path
              d="M 50 80 Q 30 60 20 40 Q 25 50 35 65 Q 40 75 50 80"
              fill="url(#goldGradient)"
              filter="url(#glow)"
            />
            <path
              d="M 45 90 Q 20 70 10 45 Q 18 60 32 78 Q 40 88 45 90"
              fill="url(#goldGradient)"
              opacity="0.8"
              filter="url(#glow)"
            />

            {/* Right Wing */}
            <path
              d="M 150 80 Q 170 60 180 40 Q 175 50 165 65 Q 160 75 150 80"
              fill="url(#goldGradient)"
              filter="url(#glow)"
            />
            <path
              d="M 155 90 Q 180 70 190 45 Q 182 60 168 78 Q 160 88 155 90"
              fill="url(#goldGradient)"
              opacity="0.8"
              filter="url(#glow)"
            />

            {/* Center Circle */}
            <circle cx="100" cy="100" r="60" fill="url(#blueGradient)" filter="url(#glow)" />

            {/* Inner Star */}
            <circle
              cx="100"
              cy="100"
              r="50"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
              opacity="0.5"
            />

            {/* Letter A */}
            <g filter="url(#glow)">
              {/* Left Diagonal */}
              <line
                x1="70"
                y1="140"
                x2="90"
                y2="60"
                stroke="url(#goldGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Right Diagonal */}
              <line
                x1="110"
                y1="60"
                x2="130"
                y2="140"
                stroke="url(#goldGradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Horizontal Bar */}
              <line
                x1="75"
                y1="110"
                x2="125"
                y2="110"
                stroke="url(#goldGradient)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>

            {/* Center Top Star */}
            <g transform="translate(100, 50)" opacity="0.9">
              <polygon
                points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
                fill="url(#goldGradient)"
              />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* Inner Glow Effect */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: 64,
            height: 64,
            background: "radial-gradient(circle, rgba(107, 99, 255, 0.3) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}
