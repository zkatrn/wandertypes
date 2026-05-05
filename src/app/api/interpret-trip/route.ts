import { NextRequest, NextResponse } from "next/server";
import type { TripInterpretation } from "@/types/interpretation";
import type { SurveyAnswers } from "@/types/survey";
import { normalizeTripInterpretation } from "@/lib/normalizeInterpretation";
import {
  aiTripInterpretationResponseSchema,
  extractJsonObjectFromAssistantText,
} from "@/lib/tripInterpretationAiSchema";
import { buildInterpretTripUserPrompt } from "@/lib/interpretTripPrompt";
import { enrichAllCardsAirportDistances } from "@/lib/googleMapsAirportEnrichment";
import { applyComparisonCardPolicy } from "@/lib/comparisonCardPolicy";
import { completeInterpretTripPrompt, isOllama } from "@/lib/aiClient";

/** Allows long local Ollama runs; Vercel still enforces plan limits. */
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    if (!isOllama && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 503 },
      );
    }

    const raw = await request.text();
    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 },
      );
    }
    let body: { surveyAnswers?: unknown; userId?: unknown };
    try {
      body = JSON.parse(raw) as typeof body;
    } catch {
      return NextResponse.json(
        { error: "Request body is not valid JSON" },
        { status: 400 },
      );
    }
    const { surveyAnswers, userId: _userId } = body;

    if (!surveyAnswers || typeof surveyAnswers !== "object") {
      return NextResponse.json(
        { error: "surveyAnswers object is required" },
        { status: 400 },
      );
    }

    const userPrompt = buildInterpretTripUserPrompt(surveyAnswers);

    const assistantText = await completeInterpretTripPrompt(userPrompt);

    const jsonText = extractJsonObjectFromAssistantText(assistantText);
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      console.error("Invalid JSON from model:", jsonText.slice(0, 2000));
      return NextResponse.json(
        { error: "Model did not return valid JSON" },
        { status: 502 },
      );
    }

    const validated = aiTripInterpretationResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error("Zod validation failed:", validated.error.flatten());
      return NextResponse.json(
        {
          error: "Model JSON failed schema validation",
          details: validated.error.flatten(),
        },
        { status: 422 },
      );
    }

    let interpretation = normalizeTripInterpretation({
      ...(validated.data as unknown as Partial<TripInterpretation>),
    });

    interpretation = applyComparisonCardPolicy(
      interpretation,
      surveyAnswers as SurveyAnswers,
    );

    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (googleMapsKey) {
      try {
        const enriched = await enrichAllCardsAirportDistances(
          interpretation.comparisonCards,
          googleMapsKey,
        );
        interpretation = { ...interpretation, comparisonCards: enriched };
      } catch (geoErr) {
        console.error("Google Maps airport enrichment skipped:", geoErr);
      }
    }

    return NextResponse.json({ interpretation });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error in interpret-trip:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
