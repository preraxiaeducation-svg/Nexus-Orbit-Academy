import { useState, useCallback } from "react";
import { Message } from "@/types/nova";

const MOCK_RESPONSES: Record<string, string> = {
  aerospace: "🚀 Our Aerospace Engineering courses cover spacecraft design, propulsion systems, orbital mechanics, and launch vehicle development. We offer beginner through advanced levels. Would you like to know more about a specific aerospace topic?",
  ai: "🤖 Our AI/ML courses teach machine learning fundamentals, deep learning, neural networks, and real-world AI applications. Perfect for beginners wanting to enter the AI field or professionals expanding their skills.",
  space: "🌌 Explore space science including astronomy, astrophysics, planetary science, and cosmic phenomena. Our courses are designed by space experts with international standards.",
  fees: "💰 Course pricing varies by level and duration. Our Space Systems Engineering course is ₹499, while others range from free to premium tiers. Would you like specific pricing information?",
  certs: "🎓 Upon successful course completion, you'll receive a verified Nexus Orbit Academy certificate. Certificates showcase your expertise and are recognized internationally.",
  register: "📝 Registering is simple! Just create an account, choose your course, and start learning. Would you like step-by-step registration guidance?",
  roadmap: "📚 We provide personalized learning roadmaps based on your goals. From beginner fundamentals to advanced specializations, we guide you through your learning journey.",
  support: "📞 Our support team is here to help! You can reach us through the contact form, email, or this chat. What can I help you with today?",
  general: "Hello! I'm Nova AI, your personal learning assistant at Nexus Orbit Academy. How can I help you today? Feel free to ask about courses, fees, registrations, or any learning questions!",
};

export function useNovaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    if (lower.includes("aerospace") || lower.includes("space systems") || lower.includes("spacecraft"))
      return MOCK_RESPONSES.aerospace;
    if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("ml"))
      return MOCK_RESPONSES.ai;
    if (lower.includes("space") || lower.includes("astronomy") || lower.includes("cosmic"))
      return MOCK_RESPONSES.space;
    if (lower.includes("price") || lower.includes("cost") || lower.includes("fee") || lower.includes("₹"))
      return MOCK_RESPONSES.fees;
    if (lower.includes("certificate") || lower.includes("cert") || lower.includes("verified"))
      return MOCK_RESPONSES.certs;
    if (lower.includes("register") || lower.includes("sign up") || lower.includes("enroll"))
      return MOCK_RESPONSES.register;
    if (lower.includes("roadmap") || lower.includes("learning path") || lower.includes("curriculum"))
      return MOCK_RESPONSES.roadmap;
    if (lower.includes("contact") || lower.includes("support") || lower.includes("help"))
      return MOCK_RESPONSES.support;

    return MOCK_RESPONSES.general;
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      addMessage({
        type: "user",
        content: content.trim(),
        isTyping: false,
      });

      setIsLoading(true);

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add typing indicator
      const typingId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: typingId,
          type: "assistant",
          content: "typing",
          timestamp: new Date(),
          isTyping: true,
        },
      ]);

      // Simulate more thinking time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get AI response
      const aiResponse = getAIResponse(content);

      // Remove typing indicator and add response
      setMessages((prev) => prev.filter((msg) => msg.id !== typingId));

      addMessage({
        type: "assistant",
        content: aiResponse,
        isTyping: false,
      });

      setIsLoading(false);
    },
    [addMessage]
  );

  return {
    messages,
    isLoading,
    isOpen,
    addMessage,
    sendMessage,
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),
    minimizeChat: () => setIsOpen(false),
  };
}
