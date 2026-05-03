/**
 * Newer Claude models may return multiple content blocks (e.g. thinking, then text).
 * Never assume `message.content[0]` is the JSON-bearing text block.
 */
export function extractTextFromAnthropicMessageContent(
  content: unknown
): string {
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error("Anthropic returned empty message content");
  }
  for (const block of content) {
    if (
      block &&
      typeof block === "object" &&
      "type" in block &&
      (block as { type: string }).type === "text" &&
      "text" in block &&
      typeof (block as { text: unknown }).text === "string"
    ) {
      return (block as { text: string }).text;
    }
  }
  throw new Error("Anthropic returned no text content block");
}
