-- ─────────────────────────────────────────────────────────────────────────────
--  v0.2 — The Validation Loop.
--
--  thakk_validations: community listen-and-verify votes. Only clips whose
--  speaker granted PUBLIC-LISTENING consent enter the open validation queue.
--  One vote per browser ballot per clip. A clip counts as "validated" when
--  it has ≥2 positive votes (audible AND is-Thakk) and more positives than
--  negatives — computed at read time, never stored.
--
--  thakk_sentences: the read-aloud sentence bank for prompt drives. Ships
--  EMPTY and inactive-by-default: sentences are added in the admin panel from
--  Academy / Pattole Palame material and activated only after review, so no
--  unverified Kodava text ever reaches contributors.
--
--  thakk_drives: festival recording drives (Puthari, the Padayatra…) — a
--  window, a target, and a banner on the live site while active.
--
--  RLS ON with no policies everywhere — service-role API routes only.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.thakk_validations (
  id               uuid primary key default gen_random_uuid(),
  contribution_id  uuid not null references public.thakk_contributions (id) on delete cascade,
  ballot_id        text not null,      -- random id from the validator's browser
  audible          boolean not null,   -- can you hear it clearly?
  is_thakk         boolean not null,   -- is it Kodava Takk?
  dialect_guess    text
                     check (dialect_guess in ('mendele','kiggat','unsure') or dialect_guess is null),
  quality          smallint check (quality between 1 and 5),
  created_at       timestamptz not null default now(),
  unique (contribution_id, ballot_id)
);
alter table public.thakk_validations enable row level security;
create index if not exists thakk_valid_contrib_idx on public.thakk_validations (contribution_id);

create table if not exists public.thakk_sentences (
  id             uuid primary key default gen_random_uuid(),
  text           text not null,        -- the sentence, Kannada-script Kodava
  translit       text,                 -- optional romanization
  translation_en text,                 -- optional English gloss
  source         text,                 -- where it came from (book, Academy…)
  active         boolean not null default false,
  created_at     timestamptz not null default now()
);
alter table public.thakk_sentences enable row level security;

create table if not exists public.thakk_drives (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,          -- e.g. 'Voices of the Walk — Padayatra'
  name_kn      text,
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  target_hours numeric not null default 10,
  active       boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table public.thakk_drives enable row level security;

-- Duplicate detection: content hash of the uploaded audio.
alter table public.thakk_contributions add column if not exists sha256 text;
create index if not exists thakk_contrib_sha_idx on public.thakk_contributions (sha256);
