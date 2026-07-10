"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNovaChat } from "@/hooks/useNovaChat";
import { NovaButton } from "./NovaButton";
import { NovaHeader } from "./NovaHeader";
import { NovaMessages } from "./NovaMessages";
import { NovaInput } from "./NovaInput";
import { NovaQuickActions } from "./NovaQuickActions";

export function NovaAI() {
  const { messages, isLoading, isOpen, sendMessage, openChat, closeChat } = useNovaChat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      closeChat();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Chat Button */}
      <NovaButton onClick={openChat} isOpen={isOpen} />

      {/* Chat Window - Compact Floating Assistant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50"
            style={{
              width: 340,
              height: 420,
              bottom: 90,
              right: 24,
            }}
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
              y: 30,
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 380,
              duration: 0.3,
            }}
          >
            <motion.div
              className="rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(15, 20, 40, 0.95), rgba(12, 18, 35, 0.92))",
                border: "1.5px solid rgba(107, 99, 255, 0.5)",
                backdropFilter: "blur(30px)",
                boxShadow: "0 8px 32px rgba(107, 99, 255, 0.3), inset 0 0 20px rgba(107, 99, 255, 0.1)",
              }}
              layoutId="nova-chat-window"
            >
              {/* Header */}
              <NovaHeader onClose={closeChat} onMinimize={closeChat} />

              {/* Messages - Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <NovaMessages messages={messages} />
              </div>

              {/* Quick Actions */}
              {messages.length === 0 && (
                <NovaQuickActions onActionClick={async (prompt) => {
                  await sendMessage(prompt);
                }} />
              )}

              {/* Input */}
              <NovaInput onSend={sendMessage} isLoading={isLoading} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 99, 255, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 99, 255, 0.5);
        }
      `}</style>
    </>
  );
}
