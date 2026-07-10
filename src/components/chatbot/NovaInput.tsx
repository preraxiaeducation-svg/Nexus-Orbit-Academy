"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface NovaInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function NovaInput({ onSend, isLoading }: NovaInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    await onSend(input);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      await handleSend();
    }
  };

  return (
    <motion.div
      className="p-2.5 border-t flex gap-1.5"
      style={{ borderColor: "rgba(107, 99, 255, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex-1 relative">
        <motion.input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Nova..."
          className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none"
          style={{
            background: "rgba(15, 20, 40, 0.8)",
            border: "1px solid rgba(107, 99, 255, 0.3)",
            backdropFilter: "blur(15px)",
            height: "36px",
          }}
          whileFocus={{
            boxShadow: "0 0 15px rgba(107, 99, 255, 0.4)",
            borderColor: "rgba(107, 99, 255, 0.6)",
          }}
          disabled={isLoading}
        />
      </div>

      <motion.button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="p-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #6C63FF 0%, #7B2FFF 100%)",
          height: "36px",
          width: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        whileHover={{ scale: input.trim() && !isLoading ? 1.08 : 1 }}
        whileTap={{ scale: input.trim() && !isLoading ? 0.92 : 1 }}
        animate={isLoading ? { opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0 }}
      >
        <Send size={14} />
      </motion.button>
    </motion.div>
  );
}
