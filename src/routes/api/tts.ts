import { createFileRoute } from "@tanstack/react-router";

/**
 * Text-to-speech endpoint.
 *
 * Voice provider resolution (all server-side, never exposed to the browser):
 *   1. ElevenLabs custom / cloned voice  -> needs VOICE_API_KEY + VOICE_ID
 *      (VOICE_PROVIDER=elevenlabs, optional VOICE_MODEL_ID)
 *   2. Lovable AI fallback voice         -> needs LOVABLE_API_KEY (already set)
 *   3. 501 -> the browser falls back to native speechSynthesis.
 */

const MAX_CHARS = 1200;

const RATE_LIMIT = new Map<string, number[]>();
function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (RATE_LIMIT.get(ip) ?? []).filter((t) => now - t < 60_000);
  hits.push(now);
  RATE_LIMIT.set(ip, hits);
  return hits.length > 20;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        if (isRateLimited(ip)) {
          return Response.json({ error: "rate_limited" }, { status: 429 });
        }

        let text = "";
        try {
          const body = (await request.json()) as { text?: unknown };
          text = typeof body.text === "string" ? body.text.trim().slice(0, MAX_CHARS) : "";
        } catch {
          return Response.json({ error: "invalid_body" }, { status: 400 });
        }
        if (!text) return Response.json({ error: "empty_text" }, { status: 400 });

        const voiceKey = process.env["VOICE_API_KEY"] ?? process.env["ELEVENLABS_API_KEY"];
        const voiceId = process.env["VOICE_ID"] ?? process.env["ELEVENLABS_VOICE_ID"];
        const provider = (process.env["VOICE_PROVIDER"] ?? "elevenlabs").toLowerCase();

        // 1) Custom (cloned) voice via ElevenLabs
        if (provider === "elevenlabs" && voiceKey && voiceId) {
          try {
            const res = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
              {
                method: "POST",
                headers: { "xi-api-key": voiceKey, "Content-Type": "application/json" },
                body: JSON.stringify({
                  text,
                  model_id: process.env["VOICE_MODEL_ID"] ?? "eleven_multilingual_v2",
                  voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.35,
                    use_speaker_boost: true,
                    speed: 1.0,
                  },
                }),
              },
            );
            if (res.ok && res.body) {
              return new Response(res.body, {
                headers: { "Content-Type": "audio/mpeg", "X-Voice-Source": "custom" },
              });
            }
            console.error("[tts] elevenlabs failed:", res.status, await res.text());
          } catch (error) {
            console.error("[tts] elevenlabs error:", error);
          }
        }

        // 2) Fallback: Lovable AI gateway TTS
        const lovableKey = process.env["LOVABLE_API_KEY"];
        if (lovableKey) {
          try {
            const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${lovableKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openai/gpt-4o-mini-tts",
                input: text,
                voice: "alloy",
                response_format: "mp3",
                instructions:
                  "Speak in a warm, natural, professional conversational tone with clear pronunciation and natural pauses.",
              }),
            });
            if (res.ok && res.body) {
              return new Response(res.body, {
                headers: { "Content-Type": "audio/mpeg", "X-Voice-Source": "fallback" },
              });
            }
            console.error("[tts] gateway failed:", res.status, await res.text());
          } catch (error) {
            console.error("[tts] gateway error:", error);
          }
        }

        // 3) Let the browser speak it natively.
        return Response.json({ error: "tts_unavailable" }, { status: 501 });
      },
    },
  },
});
