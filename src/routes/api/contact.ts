import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Contact form endpoint.
 *
 * Required server secrets (never exposed to the browser):
 *   RESEND_API_KEY     – API key from https://resend.com/api-keys
 * Optional:
 *   CONTACT_TO_EMAIL   – recipient inbox (defaults to goursuryansh51@gmail.com)
 *   CONTACT_FROM_EMAIL – verified sender (defaults to onboarding@resend.dev)
 */

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional().default(""),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(4000),
  // honeypot – must stay empty
  website: z.string().max(0).optional().default(""),
});

const RATE_LIMIT = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (RATE_LIMIT.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  RATE_LIMIT.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";

        if (isRateLimited(ip)) {
          return Response.json(
            { error: "Too many messages. Please try again later." },
            { status: 429 },
          );
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }

        const parsed = ContactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Please check the form fields and try again." },
            { status: 400 },
          );
        }

        const { name, email, phone, subject, message } = parsed.data;
        const sentAt = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        });

        const apiKey = process.env["RESEND_API_KEY"];
        const to = process.env["CONTACT_TO_EMAIL"] ?? "goursuryansh51@gmail.com";
        const from = process.env["CONTACT_FROM_EMAIL"] ?? "Portfolio <onboarding@resend.dev>";

        if (!apiKey) {
          console.warn("[contact] RESEND_API_KEY not configured; message not delivered.");
          return Response.json(
            { error: "Email service is not configured yet." },
            { status: 503 },
          );
        }

        const html = `
          <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#0f172a">
            <h2 style="margin:0 0 16px;font-size:20px">New Portfolio Contact Message</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:6px 0;width:110px;color:#64748b">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding:6px 0;color:#64748b">Phone</td><td>${escapeHtml(phone || "—")}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b">Subject</td><td>${escapeHtml(subject)}</td></tr>
              <tr><td style="padding:6px 0;color:#64748b">Date</td><td>${escapeHtml(sentAt)}</td></tr>
            </table>
            <p style="margin:20px 0 6px;color:#64748b;font-size:13px">Message</p>
            <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;font-size:14px;line-height:1.6">${escapeHtml(message)}</div>
          </div>`;

        const text = `New Portfolio Contact Message\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nSubject: ${subject}\nMessage: ${message}\nDate: ${sentAt}`;

        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from,
              to: [to],
              reply_to: email,
              subject: `Portfolio: ${subject}`,
              html,
              text,
            }),
          });

          if (!res.ok) {
            const body = await res.text();
            console.error(`[contact] Resend failed [${res.status}]: ${body}`);
            return Response.json({ error: "Could not send message." }, { status: 502 });
          }

          return Response.json({ ok: true });
        } catch (error) {
          console.error("[contact] send error:", error);
          return Response.json({ error: "Could not send message." }, { status: 500 });
        }
      },
    },
  },
});
