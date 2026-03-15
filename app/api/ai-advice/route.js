import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_STORE_KEY = "__finnytrackAiRateLimitStore";
const rateLimitStore =
  globalThis[RATE_LIMIT_STORE_KEY] || new Map();
if (!globalThis[RATE_LIMIT_STORE_KEY]) {
  globalThis[RATE_LIMIT_STORE_KEY] = rateLimitStore;
}

const getRateLimitEntry = (userId) => {
  const now = Date.now();
  const existing = rateLimitStore.get(userId);
  if (!existing || existing.resetAt <= now) {
    const entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(userId, entry);
    return entry;
  }
  return existing;
};

const consumeRateLimit = (userId) => {
  const entry = getRateLimitEntry(userId);
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  return { allowed: true, remaining, resetAt: entry.resetAt };
};

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized", remaining: null },
        { status: 401 },
      );
    }

    if (!apiKey) {
      console.error("No Gemini API key found in environment variables");
      return NextResponse.json(
        {
          message: "AI advice is disabled. Set GEMINI_API_KEY to enable it.",
          remaining: null,
        },
        { status: 503 },
      );
    }

    const rateLimit = consumeRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message: "Rate limit exceeded. Please try again later.",
          remaining: rateLimit.remaining,
        },
        { status: 429 },
      );
    }

    const { totalBudget, totalIncome, totalSpend } = await request.json();

    const userPrompt = `
Based on the following financial data:
- Total Budget: ${totalBudget} USD
- Expenses: ${totalSpend} USD
- Incomes: ${totalIncome} USD
Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `.trim();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
    });

    const advice = response?.text?.trim() || "No advice generated.";

    return NextResponse.json({ advice, remaining: rateLimit.remaining });
  } catch (error) {
    console.error("AI advice error:", error);
    const message =
      process.env.NODE_ENV === "production"
        ? "Sorry, I couldn't fetch the financial advice at this moment. Please try again later."
        : error?.message ||
          "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
    return NextResponse.json({ message, remaining: null }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ remaining: null }, { status: 401 });
    }

    const entry = getRateLimitEntry(userId);
    const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
    return NextResponse.json({ remaining });
  } catch (error) {
    console.error("AI advice rate limit check error:", error);
    return NextResponse.json({ remaining: null }, { status: 500 });
  }
}
