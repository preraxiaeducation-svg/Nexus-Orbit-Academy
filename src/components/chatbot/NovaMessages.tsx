"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Message } from "@/types/nova";
import { TypingIndicator } from "./TypingIndicator";

interface NovaMessagesProps {
  messages: Message[];
}

export function NovaMessages({ messages }: NovaMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-4 text-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative w-14 h-14 mb-3"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.5,
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

        <h4 className="text-white font-bold text-sm mb-1">Nova AI Assistant</h4>
        <p className="text-gray-400 text-xs mb-4">Ask me anything!</p>

        <div className="text-left w-full text-xs">
          <p className="text-gray-400 mb-2 font-semibold">I can help with:</p>
          <div className="space-y-1 text-gray-400">
            {[
              "🚀 Aerospace",
              "🤖 AI/ML",
              "🌌 Space Tech",
              "💰 Pricing",
            ].map((item, i) => (
              <motion.p
                key={i}
                className="text-[11px]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {message.type === "assistant" && (
            <div className="flex items-end gap-2 max-w-xs">
              <div className="relative w-7 h-7 flex-shrink-0">
                <Image
                  src="/logos/nova/nova-ai-logo.svg"
                  alt="Nova AI"
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              </div>
              <motion.div
                className="px-4 py-3 rounded-2xl rounded-bl-none"
                style={{
                  background: "rgba(12, 18, 35, 0.88)",
                  border: "1px solid rgba(107, 99, 255, 0.3)",
                  backdropFilter: "blur(20px)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {message.isTyping ? (
                  <TypingIndicator />
                ) : (
                  <p className="text-gray-200 text-sm leading-relaxed">{message.content}</p>
                )}
              </motion.div>
            </div>
          )}

          {message.type === "user" && (
            <motion.div
              className="px-4 py-3 rounded-2xl rounded-br-none max-w-xs"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-sm leading-relaxed">{message.content}</p>
            </motion.div>
          )}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
