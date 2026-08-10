# Contact form email delivery

Your contact form already posts to a server endpoint with validation, spam honeypot, and rate limiting. What's missing is the actual email delivery credential and a confirmation email back to the sender.

## What you'll get

- Messages from the Contact form land in **goursuryansh51@gmail.com** within seconds.
- The email arrives formatted (name, email, phone, subject, date, message) with **Reply-To** set to the sender, so replying from Gmail goes straight to them.
- The sender gets an automatic "thanks, I got your message" confirmation email.
- Clear feedback in the UI: success message + confetti, an error message on failure, and a distinct "too many messages" message when rate-limited.

## How email is sent

Use **Resend through the Lovable connector**, so no API key is pasted into code — you approve a connection once and the credentials stay server-side.

Note on delivery: emails must come from a domain you own and verify in Resend (e.g. `contact@yourdomain.com`). Until a domain is verified, Resend's test sender only delivers to your own Resend account email, so the notification to your Gmail works only if that Gmail is the Resend account address; the auto-reply to visitors will not send.

## Technical changes

1. Link the Resend connection to this project via the connector flow (adds `RESEND_API_KEY` as a server env var).
2. `src/routes/api/contact.ts`:
   - Send through the connector gateway (`https://connector-gateway.lovable.dev/resend/emails`) with `Authorization: Bearer LOVABLE_API_KEY` and `X-Connection-Api-Key: RESEND_API_KEY`.
   - Keep the existing Zod validation, honeypot, and rate limit; surface the exact provider status/body in server logs on failure.
   - Add a second send: plain, branded confirmation email to the visitor (failure here does not fail the request).
   - Keep `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` overrides with defaults for your Gmail.
3. `src/components/Contact.tsx`: read the JSON error from the response and show a specific message for HTTP 429 vs generic failure. No design changes.

## Out of scope

No changes to layout, styling, other sections, or the chatbot.
