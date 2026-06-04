import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { buildFallbackCoachSummary } from "@/lib/coach-fallback";
import type { ExerciseMetric, GoalId } from "@/types";

export async function POST(req: NextRequest) {
  let body: {
    goalTitle?: string;
    goalId?: GoalId;
    overallFormScore?: number;
    exercises?: ExerciseMetric[];
    streak?: number;
    difficulty?: number;
  } = {};

  try {
    body = await req.json();
    const {
      goalTitle,
      goalId,
      overallFormScore,
      exercises,
      streak,
      difficulty,
    } = body as {
      goalTitle: string;
      goalId: GoalId;
      overallFormScore: number;
      exercises: ExerciseMetric[];
      streak: number;
      difficulty: number;
    };

    const fallback = buildFallbackCoachSummary(
      goalTitle,
      goalId,
      overallFormScore,
      exercises,
      streak
    );

    const apiKey =
      req.headers.get("x-user-gemini-key")?.trim() ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(fallback);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a warm, encouraging physiotherapy coach for home rehab patients and older adults.
Write a short session summary (3-4 sentences), one specific improvement tip (1 sentence), and a difficulty note (1 sentence) based on this session data.
Never diagnose. Never use em dashes. Plain language only.

Goal: ${goalTitle}
Overall form score: ${overallFormScore}%
Streak days: ${streak}
Current difficulty level: ${difficulty}
Exercises: ${JSON.stringify(exercises)}

Respond as JSON only: {"summary":"...","tip":"...","difficultyNote":"..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as {
        summary?: string;
        tip?: string;
        difficultyNote?: string;
      };
      return NextResponse.json({
        summary: parsed.summary ?? fallback.summary,
        tip: parsed.tip ?? fallback.tip,
        difficultyNote: parsed.difficultyNote ?? fallback.difficultyNote,
      });
    }

    return NextResponse.json(fallback);
  } catch {
    const fallback = buildFallbackCoachSummary(
      body.goalTitle ?? "Recovery",
      body.goalId ?? "knee-rehab",
      body.overallFormScore ?? 70,
      body.exercises ?? [],
      body.streak ?? 1
    );
    return NextResponse.json(fallback);
  }
}
