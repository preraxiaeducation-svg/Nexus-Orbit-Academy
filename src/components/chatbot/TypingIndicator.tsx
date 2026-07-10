"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center gap-1.5"
      variants={containerVariants}
      animate="animate"
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "rgba(0, 217, 255, 0.6)" }}
        variants={dotVariants}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "rgba(0, 217, 255, 0.6)" }}
        variants={dotVariants}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "rgba(0, 217, 255, 0.6)" }}
        variants={dotVariants}
      />
    </motion.div>
  );
}
