import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Contact form endpoint.
 *
 * Delivery runs through the Lovable connector gateway using the linked Gmail
 * connection, so messages land directly in the owner's inbox.
 *
 * Server env (never exposed to the browser):
 *   LOVABLE_API_KEY      – auto-provisioned by Lovable
 *   GOOGLE_MAIL_API_KEY  – provided by the linked Gmail connection
 * Optional:
 *   CONTACT_TO_EMAIL     – recipient inbox (defaults to goursuryansh51@gmail.com)
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const OWNER_NAME = "Suryansh Gour";
const DEFAULT_TO = "goursuryansh51@gmail.com";

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

/** Strip CR/LF so user input can never inject extra mail headers. */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function encodeHeaderValue(value: string) {
  const safe = headerSafe(value);
  // eslint-disable-next-line no-control-regex
  if (/^[\x20-\x7E]*$/.test(safe)) return safe;
  return `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(safe)))}?=`;
}

function base64Url(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildRawEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const headers = [
    `To: ${headerSafe(opts.to)}`,
    `Subject: ${encodeHeaderValue(opts.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
  ];
  if (opts.replyTo) headers.push(`Reply-To: ${headerSafe(opts.replyTo)}`);
  return base64Url(`${headers.join("\r\n")}\r\n\r\n${opts.html}`);
}

async function sendGmail(
  raw: string,
  keys: { lovableApiKey: string; connectionKey: string },
) {
  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keys.lovableApiKey}`,
      "X-Connection-Api-Key": keys.connectionKey,
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gmail send failed [${res.status}]: ${body}`);
  }
  return res.json();
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
            { error: "Too many messages. Please try again in a few minutes." },
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

        const lovableApiKey = process.env["LOVABLE_API_KEY"];
        const connectionKey = process.env["GOOGLE_MAIL_API_KEY"];
        const to = process.env["CONTACT_TO_EMAIL"] ?? DEFAULT_TO;

        if (!lovableApiKey || !connectionKey) {
          console.warn("[contact] Email connection is not configured; message not delivered.");
          return Response.json(
            { error: "Email service is not configured yet." },
            { status: 503 },
          );
        }

        const notificationHtml = `
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

        try {
          await sendGmail(
            buildRawEmail({
              to,
              subject: `Portfolio: ${subject}`,
              html: notificationHtml,
              replyTo: email,
            }),
            { lovableApiKey, connectionKey },
          );
        } catch (error) {
          console.error("[contact] notification send error:", error);
          return Response.json({ error: "Could not send message." }, { status: 502 });
        }

        // Confirmation to the visitor — best effort, never fails the request.
        const confirmationHtml = `
          <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#0f172a">
            <h2 style="margin:0 0 12px;font-size:20px">Thanks for reaching out, ${escapeHtml(name)}!</h2>
            <p style="font-size:14px;line-height:1.6;color:#334155">
              I've received your message and will get back to you as soon as possible — usually within 1–2 days.
            </p>
            <p style="margin:20px 0 6px;color:#64748b;font-size:13px">Your message</p>
            <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;font-size:14px;line-height:1.6">${escapeHtml(message)}</div>
            <p style="margin-top:24px;font-size:14px;color:#334155">Best regards,<br/><strong>${OWNER_NAME}</strong></p>
          </div>`;

        try {
          await sendGmail(
            buildRawEmail({
              to: email,
              subject: `Thanks for contacting ${OWNER_NAME}`,
              html: confirmationHtml,
            }),
            { lovableApiKey, connectionKey },
          );
        } catch (error) {
          console.error("[contact] confirmation send error:", error);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
