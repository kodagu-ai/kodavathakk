// Site-wide constants. Edit these in one place.

export const site = {
  name: "Kodava Thakk",
  localName: "ಕೊಡವ ತಕ್ಕ್",
  domain: "kodavathakk.kodagu.ai",
  url: "https://kodavathakk.kodagu.ai",
  tagline: "Keep the language alive — in its own voice.",
  description:
    "Kodava Thakk is a community-owned AI language preservation initiative for Kodava Takk, the language of Kodagu. Record your voice, help build the corpus, and teach the machines our mother tongue.",
  parent: {
    name: "Kodagu.ai",
    url: "https://kodagu.ai",
    joinUrl: "https://kodagu.ai/join",
    communityUrl: "https://kodagu.ai/community",
    projectUrl: "https://kodagu.ai/projects/kodava-thakk",
  },
  githubUrl: "https://github.com/kodagu-ai/kodavathakk",
  contactEmail: "poonacha@cyberhuman.ai",
};

// ── Level 0 form vocabulary (must match the DB check constraints) ────────────

export const DIALECTS = [
  { key: "mendele", label: "Mendele (north & central Kodagu)" },
  { key: "kiggat", label: "Kiggat (south Kodagu)" },
  { key: "diaspora", label: "Diaspora (outside Kodagu)" },
  { key: "unsure", label: "Not sure" },
] as const;

export const AGE_BANDS = ["<18", "18-30", "31-50", "51-70", "70+"] as const;

export const FLUENCY = [
  { key: "native", label: "Native speaker" },
  { key: "fluent", label: "Fluent" },
  { key: "learning", label: "Learning" },
] as const;

export const CONTENT_TYPES = [
  { key: "story", label: "A story or memory" },
  { key: "song", label: "A song (Palame or any Thakk song)" },
  { key: "proverb", label: "A proverb or saying" },
  { key: "blessing", label: "A blessing or ritual speech" },
  { key: "conversation", label: "Everyday conversation" },
  { key: "prompt", label: "Answering one of the prompts" },
  { key: "other", label: "Something else" },
] as const;

// Speaking prompts for contributors who don't know what to say (Common Voice
// style "extempore" prompts, from the blueprint).
export const PROMPTS = [
  "Introduce yourself: your name, your okka, and your village.",
  "Describe your morning, from waking up to your first coffee.",
  "Give directions from the main road to your ainmane.",
  "Describe how your family celebrates Puthari.",
  "Tell us about the monsoon in your village.",
  "What did your grandmother's kitchen smell like? Describe it.",
  "Explain how to make a good cup of coffee.",
  "Describe your favourite place in Kodagu, as if to someone who has never seen it.",
  "Say a blessing you have heard at a wedding.",
  "Tell the story of how your village got its name.",
] as const;

// Corpus targets per roadmap phase (hours of raw audio).
export const PHASE_TARGETS = {
  level0: 100, // Phase 0 — the first 100 hours
  phase1: 400,
  phase2: 700,
  phase3: 1000,
} as const;

// ── Contributor badges (brand motifs: paddy, gejje thande, thook bolcha,
// peechekathi). Earned by clips contributed OR minutes recorded — whichever
// comes first. Order matters: highest tier first.
export type BadgeTier = {
  key: string;
  label: string;
  motif: string; // emoji stand-in for the brand motif icon
  minClips: number;
  minSeconds: number;
  color: string; // chip accent (brand palette)
  meaning: string;
};

export const BADGES: BadgeTier[] = [
  {
    key: "guardian",
    label: "Guardian of Thakk",
    motif: "🛡️",
    minClips: 25,
    minSeconds: 3 * 3600,
    color: "#6E1E2A",
    meaning: "Peechekathi — 25 recordings or 3 hours given",
  },
  {
    key: "keeper",
    label: "Keeper of the Flame",
    motif: "🪔",
    minClips: 12,
    minSeconds: 3600,
    color: "#C9A227",
    meaning: "Thook bolcha — 12 recordings or 1 hour given",
  },
  {
    key: "storyteller",
    label: "Storyteller",
    motif: "🔔",
    minClips: 5,
    minSeconds: 15 * 60,
    color: "#2E5E6E",
    meaning: "Gejje thande — 5 recordings or 15 minutes given",
  },
  {
    key: "first_voice",
    label: "First Voice",
    motif: "🌾",
    minClips: 1,
    minSeconds: 1,
    color: "#1F3D2B",
    meaning: "Paddy sheaf — the first recording given",
  },
];

export function badgeFor(clips: number, seconds: number): BadgeTier {
  return (
    BADGES.find((b) => clips >= b.minClips || seconds >= b.minSeconds) ??
    BADGES[BADGES.length - 1]
  );
}

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // storage bucket cap
export const MAX_DURATION_SECONDS = 7200;

export const ALLOWED_AUDIO_MIME = [
  "audio/webm",
  "audio/ogg",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "video/webm", // some browsers label MediaRecorder audio this way
  "video/mp4", // Safari MediaRecorder
];
