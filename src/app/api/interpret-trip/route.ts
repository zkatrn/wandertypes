import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { TripInterpretation } from "@/types/interpretation";
import { normalizeTripInterpretation } from "@/lib/normalizeInterpretation";
import {
  aiTripInterpretationResponseSchema,
  extractJsonObjectFromAssistantText,
} from "@/lib/tripInterpretationAiSchema";
import { buildInterpretTripUserPrompt } from "@/lib/interpretTripPrompt";
import { enrichAllCardsAirportDistances } from "@/lib/googleMapsAirportEnrichment";
import { extractTextFromAnthropicMessageContent } from "@/lib/anthropicMessageText";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** `claude-3-5-sonnet-20241022` and older IDs return 404; override via ANTHROPIC_MODEL if needed. */
const ANTHROPIC_MESSAGES_MODEL =
  process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-6";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { surveyAnswers, userId: _userId } = body;

    if (!surveyAnswers || typeof surveyAnswers !== "object") {
      return NextResponse.json(
        { error: "surveyAnswers object is required" },
        { status: 400 }
      );
    }

    const userPrompt = buildInterpretTripUserPrompt(surveyAnswers);

    const message = await anthropic.messages.create({
      model: ANTHROPIC_MESSAGES_MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: userPrompt }],
    });

    const assistantText = extractTextFromAnthropicMessageContent(message.content);

    const jsonText = extractJsonObjectFromAssistantText(assistantText);
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonText);
    } catch {
      console.error("Invalid JSON from model:", jsonText.slice(0, 2000));
      return NextResponse.json(
        { error: "Model did not return valid JSON" },
        { status: 502 }
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
        { status: 422 }
      );
    }

    let interpretation = normalizeTripInterpretation({
      ...(validated.data as unknown as Partial<TripInterpretation>),
    });

    const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (googleMapsKey) {
      try {
        const enriched = await enrichAllCardsAirportDistances(
          interpretation.comparisonCards,
          googleMapsKey
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
