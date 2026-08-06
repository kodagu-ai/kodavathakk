-- ─────────────────────────────────────────────────────────────────────────────
--  Kodava Thakk — Level 0 voice contributions.
--
--  One table: every voice clip contributed through kodavathakk.kodagu.ai,
--  with the speaker metadata and consent tiers the corpus pipeline needs.
--  RLS is ON with NO policies — all reads and writes go through the
--  service-role API routes (app/api/*), so the anon key can touch nothing.
--
--  Storage: a private 'thakk-voice' bucket. Clients upload directly via
--  short-lived signed upload URLs minted by /api/contribute, so audio never
--  passes through the serverless function body limit.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.thakk_contributions (
  id               uuid primary key default gen_random_uuid(),

  -- Who is speaking (self-reported; elders may be recorded by a facilitator)
  name             text not null,
  phone            text,               -- phone / WhatsApp (optional)
  email            text,
  place            text not null,      -- village / town (or diaspora city)
  okka             text,               -- family / clan name (optional)
  age_band         text
                     check (age_band in ('<18','18-30','31-50','51-70','70+') or age_band is null),
  dialect          text not null default 'unsure'
                     check (dialect in ('mendele','kiggat','diaspora','unsure')),
  fluency          text
                     check (fluency in ('native','fluent','learning') or fluency is null),

  -- What was recorded
  content_type     text not null default 'other'
                     check (content_type in
                       ('story','song','proverb','conversation','prompt','blessing','other')),
  prompt_label     text,               -- which prompt they answered, if any
  notes            text,

  -- Consent tiers (guardianship model — archive consent is required to submit)
  consent          jsonb not null default '{"archive":true,"research":false,"training":false,"public":false}'::jsonb,

  -- The audio object
  duration_seconds integer check (duration_seconds between 0 and 7200),
  file_name        text,
  storage_path     text,               -- path inside the thakk-voice bucket
  mime_type        text,
  size_bytes       bigint,

  -- Pipeline state. 'uploading' rows never count in public stats.
  status           text not null default 'uploading'
                     check (status in ('uploading','received','reviewed','rejected')),

  -- Dedup key for the contributor counter: phone > email > name+place.
  contributor_key  text not null,

  -- Room for the AI layer: ASR drafts, quality scores, dialect detection…
  analysis         jsonb,

  created_at       timestamptz not null default now()
);
alter table public.thakk_contributions enable row level security;

create index if not exists thakk_contrib_status_idx  on public.thakk_contributions (status);
create index if not exists thakk_contrib_created_idx on public.thakk_contributions (created_at desc);
create index if not exists thakk_contrib_key_idx     on public.thakk_contributions (contributor_key);

-- Private storage bucket for the raw audio (50 MB per object cap).
insert into storage.buckets (id, name, public, file_size_limit)
values ('thakk-voice', 'thakk-voice', false, 52428800)
on conflict (id) do nothing;
