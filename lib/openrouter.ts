import {
  Lesson,
  normalizeLesson,
  type LessonType,
} from "@/lib/schemas/lesson";
import { buildLessonPrompt } from "@/lib/prompts/lesson";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(raw);
}

async function callOpenRouter(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const model =
    process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4";

  const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS ?? 1200);

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      "X-Title": "MicroLearn",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 402) {
      throw new Error(
        "OpenRouter credits too low for this model. Add credits at openrouter.ai/settings/credits, or set OPENROUTER_MODEL to a cheaper model (e.g. google/gemini-2.0-flash-001).",
      );
    }
    throw new Error(`OpenRouter API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned empty response");
  return content;
}

export async function generateLesson(
  depth: string,
  category: string,
  pastTopics: string[],
): Promise<LessonType> {
  const systemPrompt = buildLessonPrompt(depth, category, pastTopics);
  let lastError = "";

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const userMessage =
        attempt === 0
          ? `Generate a lesson for category "${category}" at ${depth} depth.`
          : `Your previous response failed validation: ${lastError}. Fix the JSON and respond with ONLY valid JSON.`;

      const raw = await callOpenRouter(systemPrompt, userMessage);
      const parsed = extractJson(raw);

      const strict = Lesson.safeParse(parsed);
      if (strict.success) return strict.data;

      return normalizeLesson(parsed);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt === 2) throw new Error(`Lesson generation failed: ${lastError}`);
    }
  }

  throw new Error("Lesson generation failed");
}
