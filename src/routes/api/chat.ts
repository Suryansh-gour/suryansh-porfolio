import { createFileRoute } from "@tanstack/react-router";
import { streamText, type UIMessage } from "ai";
import {
  createLovableAiGatewayOpenAIProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

type ChatRequestBody = {
  messages?: UIMessage[];
};

function uiMessageToText(message: UIMessage): { role: "user" | "assistant"; content: string } {
  const text = message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
  return { role: message.role as "user" | "assistant", content: text };
}


const SYSTEM_PROMPT = `You are a helpful general assistant embedded in the personal portfolio of Suryansh Gour. Use the context below to answer questions about Suryansh when they come up, and otherwise answer general questions helpfully and concisely.

About Suryansh Gour:
- He is a BCA student specializing in Artificial Intelligence & Data Science at SAGE University, Bhopal (Aug 2024 – May 2027).
- He is a full-stack web developer, AI enthusiast, and AWS User Group Campus Ambassador.
- Tech stack: React, Next.js, Vite, TypeScript, Tailwind CSS, Node.js, SQL/NoSQL databases, OpenCV, Streamlit, GitHub Copilot.
- Certifications: AWS Cloud Practitioner Essentials, Neo4j Certified Professional, Infosys certifications.
- Experience: internships at a SaaS startup and a government-approved web development firm; national hackathon participant; freelancer.
- Projects: several deployed full-stack projects (details are visible in the Projects section of the portfolio).
- Social links: GitHub (https://github.com/Suryansh-gour), LinkedIn (https://linkedin.com/in/suryansh-gour).
- Contact: use the Contact section on the portfolio to reach out.

Keep replies friendly, concise, and useful. If you do not know something about Suryansh that is not in the context, say you do not know rather than inventing details.`;

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
