"use client";

import { motion } from "framer-motion";
import { QuickAction } from "@/types/nova";

interface NovaQuickActionsProps {
  onActionClick: (prompt: string) => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "aerospace",
    label: "Aerospace",
    emoji: "🚀",
    prompt: "Tell me about aerospace courses",
    color: "blue",
  },
  {
    id: "ai",
    label: "AI Courses",
    emoji: "🤖",
    prompt: "What AI courses do you offer?",
    color: "purple",
  },
  {
    id: "space",
    label: "Space Science",
    emoji: "🌌",
    prompt: "Tell me about space science",
    color: "cyan",
  },
  {
    id: "fees",
    label: "Course Fees",
    emoji: "💰",
    prompt: "What are the course prices?",
    color: "blue",
  },
];

const colorGradients: Record<string, string> = {
  blue: "from-blue-600 to-blue-400",
  purple: "from-purple-600 to-purple-400",
  cyan: "from-cyan-600 to-cyan-400",
};

export function NovaQuickActions({ onActionClick }: NovaQuickActionsProps) {
  return (
    <div className="p-2.5 border-t" style={{ borderColor: "rgba(107, 99, 255, 0.2)" }}>
      <p className="text-[10px] text-gray-400 mb-2 font-semibold px-1">Quick Actions</p>
      <div className="grid grid-cols-2 gap-1.5">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.button
            key={action.id}
            onClick={() => onActionClick(action.prompt)}
            className={`relative px-2 py-1.5 rounded-lg text-[10px] font-medium text-white overflow-hidden group transition-all bg-gradient-to-r ${colorGradients[action.color]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(107, 99, 255, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative flex items-center justify-center gap-1">
              <span>{action.emoji}</span>
              <span className="hidden sm:inline">{action.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
