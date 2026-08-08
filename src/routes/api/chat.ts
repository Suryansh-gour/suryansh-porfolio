import { createFileRoute } from "@tanstack/react-router";
import { streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayOpenAIProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/portfolio-knowledge";

type ChatRequestBody = {
  messages?: UIMessage[];
};

function uiMessageToText(message: UIMessage): { role: "user" | "assistant"; content: string } {
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
  return { role: message.role as "user" | "assistant", content: text };
}

const SYSTEM_PROMPT = ASSISTANT_SYSTEM_PROMPT;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as ChatRequestBody;
          if (!Array.isArray(messages)) {
            return new Response("Messages are required", { status: 400 });
          }

          const key = process.env["LOVABLE_API_KEY"];
          if (!key) {
            return new Response("Missing LOVABLE_API_KEY", { status: 500 });
          }

          const initialRunId = getLovableAiGatewayRunId(request);
          const gateway = createLovableAiGatewayOpenAIProvider(key, initialRunId);
          const model = gateway("openai/gpt-5.6-sol");

          const userMessages = messages.map(uiMessageToText);
          const messagesForModel: { role: "user" | "assistant"; content: string }[] = userMessages.map((m, i) =>
            i === userMessages.length - 1
              ? { role: m.role as "user" | "assistant", content: `${SYSTEM_PROMPT}\n\n${m.content}` }
              : m
          );

          const result = streamText({
            model,
            messages: messagesForModel,
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: false,
            headers: getLovableAiGatewayResponseHeaders(undefined, {
              ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
          });

        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          console.error("Chat error:", error);
          return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});
