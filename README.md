# Kodava Thakk · ಕೊಡವ ತಕ್ಕ್

**Voice of the Hills** — a community-owned AI language preservation initiative
for Kodava Takk, the language of Kodagu. A [Kodagu.ai](https://kodagu.ai)
community project (a Nada Kodagu initiative).

Live at **https://kodavathakk.kodagu.ai**

Kodava Takk has no script in daily use — it lives in the voice. This site is
the project's headquarters: the manifesto, the 36-month roadmap, the public
corpus tracker, and **Level 0** — browser voice recording that grows a
community-governed speech corpus for AI (speech recognition → speech synthesis
→ a speech-to-speech companion).

## Stack

- **Next.js 14 (App Router)** on **Vercel** — same family as the other
  Kodagu.ai projects (Aane Alert, Nela, Manabala).
- **Supabase** (project `kodavathakk`): Postgres for the contribution tracker,
  private Storage bucket `thakk-voice` for audio. RLS is ON with no policies —
  every read/write goes through service-role API routes.
- Brand per `brand/Kodava_Thakk_Brand_Guidelines_v2.html` (v2.0, Aug 2026):
  Kupya Maroon `#6E1E2A` · Mandethira Gold `#C9A227` · Ainmane Ivory `#F7F1E5`;
  Cormorant Garamond + Manrope, with Noto Serif/Sans Kannada as equal
  companions. Logo: the Speaking Flame seal (5 variants in `public/brand/`).

## How the voice pipeline works

1. `POST /api/contribute` — metadata only (speaker, dialect, consent tiers,
   duration). Creates a DB row in `uploading` state and mints a signed
   Supabase Storage upload URL.
2. The browser uploads the audio **directly to storage** with that URL (no
   serverless body limits).
3. `POST /api/contribute/complete` — verifies the object exists, flips the row
   to `received`. Only then does it count.
4. `GET /api/stats` — public counters for the home-page dial, ticker, and
   `/tracker` (contributors, hours, dialect balance, recent credits).
5. `/admin` — the backend tracker: listen, mark `reviewed`/`rejected`.
   Auth is a single bearer key (`ADMIN_KEY`).

## Environment

| Var | What |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (also used by the browser for direct upload) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (upload-to-signed-URL only; RLS blocks everything else) |
| `SUPABASE_URL` | same URL, for server routes |
| `SUPABASE_SERVICE_ROLE_KEY` | service-role key — server only |
| `ADMIN_KEY` | bearer key for `/admin` and `/api/admin/*` |

## Run it locally

```bash
npm install
npm run dev
```

Database schema lives in `supabase/migrations/` (`supabase db push` to apply).

## Consent & guardianship

Every recording carries tiered consent (archive / research / model training /
public listening), enforced in the pipeline. The corpus is community-owned
under a Kodava data guardianship licence: it is never sold, and commercial use
requires language-council approval. Speakers, okkas, and villages are
credited, never "users".

## The blueprint

The full project blueprint (governance, corpus engine, model plan, funding,
90-day kickoff) is in
`docs/Kodava_Thakk_AI_Language_Preservation_Blueprint.docx`.
