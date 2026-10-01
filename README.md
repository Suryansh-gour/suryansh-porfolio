# Suryansh Gour — Developer Portfolio

Portfolio website built with React 19, TanStack Start, and Tailwind CSS. It includes the portfolio sections, project details, contact form, AI chat with optional voice controls, and resume links.

## Run locally

Requirements: Bun and Node.js.

```sh
bun install
cp .env.example .env
# Fill in the server-side values described below.
bun run dev
```

The development site runs at `http://localhost:3000` (Vite may report a different port if that one is occupied).

## Environment variables

Keep real values in local `.env` or the hosting provider's server-side secret settings. Never put private values in `VITE_*` variables or commit `.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `LOVABLE_API_KEY` | Yes for AI/TTS | Server-side access for the AI chat and fallback speech service. Lovable projects provision this key. |
| `GOOGLE_MAIL_API_KEY` | Yes for contact delivery | Server-side credential for the project's linked Gmail connection. |
| `CONTACT_TO_EMAIL` | Optional | Inbox receiving contact form messages; defaults to `goursuryansh51@gmail.com`. |
| `VOICE_PROVIDER` | Optional | Set to `elevenlabs` to use the configured custom voice. |
| `VOICE_ID` | Optional | Voice ID created in the owner's ElevenLabs account. |
| `VOICE_API_KEY` | Optional | ElevenLabs API key; keep it only in server-side secrets. |
| `VOICE_MODEL_ID` | Optional | ElevenLabs TTS model; defaults to `eleven_multilingual_v2`. |

### Contact form email

The form sends validated submissions directly to the configured Gmail inbox through the linked Gmail connection. The message includes the visitor's name, email, phone, subject, message, and server-recorded date/time; Reply-To is set to the visitor's email. The visitor also receives a best-effort confirmation.

In Lovable, link the Gmail connection to this project so `GOOGLE_MAIL_API_KEY` is available to server code. Set `CONTACT_TO_EMAIL` only if you want to change the recipient. For local development, add the Gmail connector credential and `LOVABLE_API_KEY` to `.env`; do not commit that file. Test using the Contact form with a valid submission, then confirm the notification, Reply-To, and confirmation email.

The form and API enforce required fields and valid email/phone formats, reject honeypot submissions, and rate-limit requests. The browser displays a success message only after the notification send succeeds.

### Personal voice (optional)

Voice cloning is managed in the portfolio owner's ElevenLabs account, not on a public portfolio page:

1. Create or sign in to the owner's ElevenLabs account and open **Voices / Voice Lab**.
2. Follow ElevenLabs' current consent and voice-sample requirements to create an Instant Voice Clone from Suryansh's authorized clean recording. The portfolio does not upload, retain, or train on the recording.
3. Copy the resulting Voice ID and create an API key with text-to-speech access in the ElevenLabs account.
4. Add `VOICE_PROVIDER=elevenlabs`, `VOICE_ID`, and `VOICE_API_KEY` as server-side secrets in Lovable (or local `.env` for local testing). Optionally set `VOICE_MODEL_ID` to a model supported by the account; `eleven_multilingual_v2` is the default.
5. Ask the portfolio assistant a question, enable Voice Mode, and confirm the spoken reply uses the custom voice. Replace the secret Voice ID to change voices; replace the server-side API key if it is rotated.

No owner-only setup screen is exposed to visitors. Until credentials are configured, the chatbot remains available and uses its TTS/browser speech fallback. Visitors always see the text reply, and assistant audio is presented as AI-generated speech—not as a personal statement spoken by Suryansh.

### Resume

Replace `public/resume/Suryansh_Gour_Resume.pdf` with the updated PDF using the same filename. The View and Download buttons will continue to work without code changes. The download filename is `Suryansh_Gour_Resume.pdf`.

## Project layout

- `src/components/` — portfolio sections, contact form, resume and chatbot UI.
- `src/hooks/` — voice assistant and responsive helpers.
- `src/lib/` — AI gateway helpers, portfolio knowledge, and shared utilities.
- `src/routes/` — portfolio page and server API endpoints (`/api/chat`, `/api/contact`, `/api/tts`).
- `public/` — static images, favicon, and resume PDF.
- `.env.example` — variable names and blank placeholders only.
