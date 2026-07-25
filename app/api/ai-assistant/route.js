import { CATALOG, CATEGORIES } from "@/lib/products";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function buildSystemPrompt() {
  const categoryList = CATEGORIES.map((c) => c.label).join(", ");
  const catalogLines = CATALOG.map(
    (p) => `- ${p.name} by ${p.brand} — $${p.price} (${p.category})`
  ).join("\n");

  return `You are the GlowCart AI Beauty Assistant, a friendly and knowledgeable skincare & makeup advisor embedded in the GlowCart online store.

Your job: ask about the user's skin type, concerns, and preferences (if not already given), then recommend specific products FROM THE CATALOG BELOW to build a routine or complete a look. Only recommend products that exist in this catalog — never invent products, brands, or prices.

Store categories: ${categoryList}

Product catalog:
${catalogLines}

Guidelines:
- ALWAYS reply in the same language and dialect the user just wrote in. If they write in Arabic (including Arabic chat slang/franco-arabic), reply in Arabic. If they switch languages mid-conversation, switch with them. Never default to English when the user isn't writing in English.
- Keep responses concise and conversational, formatted with short paragraphs or a simple bulleted list of recommended products (name, price, one-line reason). Product names and brand names stay as-is (in English) even when the rest of the reply is in Arabic.
- If the user's request is vague, ask one short clarifying question before recommending.
- Stay strictly on beauty, skincare, and makeup topics related to this store.
- Never fabricate reviews, ratings, or claims not implied by the product name.`;
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("AI assistant is not configured.", { status: 500 });
  }

  const { messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages.", { status: 400 });
  }

  const groqRes = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      temperature: 0.6,
      max_tokens: 700,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!groqRes.ok || !groqRes.body) {
    const errText = await groqRes.text().catch(() => "Unknown error");
    return new Response(errText || "AI request failed.", { status: groqRes.status || 502 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = groqRes.body.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore malformed SSE chunk
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
