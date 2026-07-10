import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const RATE_LIMIT_FREE = 5; // messages/day for free courses
const MOCK_RESPONSES = [
  "Great question! Based on the lesson content, this concept relates to the fundamental principles we discussed. Could you tell me more specifically which part you'd like me to clarify?",
  "Excellent thinking! The key insight here is understanding how these principles interconnect. In the context of this lesson, think about how the core variables interact with each other.",
  "That's a fascinating point to explore! This topic builds on what we covered earlier in the chapter. The main thing to remember is the relationship between cause and effect in this system.",
  "Good question! Let me break this down step by step based on what we've covered: First, consider the fundamental definition. Then think about how it applies to the specific scenario in this lesson.",
];

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const { lessonId, message, language = "english" } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    // Get lesson context
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    // Rate limiting: check message count today for free courses
    if (lesson.course.price === 0) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayCount = await prisma.chatMessage.count({
        where: {
          userId: session.userId,
          lessonId,
          role: "user",
          createdAt: { gte: todayStart },
        },
      });

      if (todayCount >= RATE_LIMIT_FREE) {
        return NextResponse.json({
          error: `Daily limit of ${RATE_LIMIT_FREE} messages reached for free courses. Upgrade to a paid course for unlimited AI tutoring.`,
          rateLimited: true,
        }, { status: 429 });
      }
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { userId: session.userId, lessonId, role: "user", content: message },
    });

    // Build context from lesson
    const lessonContext = `
Lesson: "${lesson.title}" (Chapter: "${lesson.chapterTitle}")
Course: "${lesson.course.title}"
${lesson.notes ? `Lesson Notes Summary:\n${lesson.notes.slice(0, 1500)}` : ""}
    `.trim();

    const systemPrompt = `You are an expert AI tutor for Nexus Orbit Academy, a premium online platform specializing in Aerospace Engineering, AI & Machine Learning, Space Technology, Astronomy, Astrophysics, and Cosmology.

Current lesson context:
${lessonContext}

Instructions:
- Answer ONLY in the context of this specific lesson and course. Do not drift to unrelated topics.
- Be concise, precise, and educational. Use analogies where helpful.
- If the user asks to explain in simple language, use everyday analogies.
${language === "hindi" ? "- Respond in Hindi (Devanagari script). Use technical terms in English where necessary." : "- Respond in English."}
- Format your response clearly. Use bullet points or numbered steps where helpful.
- If the question is beyond the lesson scope, say so and redirect to the relevant lesson material.`;

    let aiResponse = "";

    // Try Gemini API first
    if (process.env.GEMINI_API_KEY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: message }], role: "user" }],
              generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch {
        // Fall through to next provider
      }
    }

    // Try Anthropic Claude as fallback
    if (!aiResponse && process.env.ANTHROPIC_API_KEY) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 600,
            system: systemPrompt,
            messages: [{ role: "user", content: message }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          aiResponse = data.content?.[0]?.text || "";
        }
      } catch {
        // Fall through to mock
      }
    }

    // Mock response fallback
    if (!aiResponse) {
      const mockBase = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      aiResponse = `[Demo Mode — No AI API key configured]\n\n${mockBase}\n\nTo enable real AI tutoring, add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env file.`;
    }

    // Save assistant response
    await prisma.chatMessage.create({
      data: { userId: session.userId, lessonId, role: "assistant", content: aiResponse },
    });

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "AI tutor is unavailable. Please try again." }, { status: 500 });
  }
}

// GET: fetch chat history for a lesson
export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ messages: [] }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");
  if (!lessonId) return NextResponse.json({ messages: [] });

  const messages = await prisma.chatMessage.findMany({
    where: { userId: session.userId, lessonId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json({ messages });
}
