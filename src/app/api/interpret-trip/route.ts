import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { TripInterpretation } from "@/types/interpretation";
import { normalizeTripInterpretation } from "@/lib/normalizeInterpretation";
import {
  aiTripInterpretationResponseSchema,
  extractJsonObjectFromAssistantText,
} from "@/lib/tripInterpretationAiSchema";
import { buildInterpretTripUserPrompt } from "@/lib/interpretTripPrompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from Anthropic");
    }

    const jsonText = extractJsonObjectFromAssistantText(content.text);
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

    const interpretation = normalizeTripInterpretation({
      ...(validated.data as unknown as Partial<TripInterpretation>),
    });

    return NextResponse.json({ interpretation });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error in interpret-trip:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
