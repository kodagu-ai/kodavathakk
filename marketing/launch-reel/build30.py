#!/usr/bin/env python3
"""Build the 30s Kodava Thakk launch reel in English and Kannada.

film-raw.mp4 (15s) + film2-raw.mp4 (15s) are joined into one continuous
30s journey (clip 2 was generated from clip 1's real last frame, so the
seam is a true continuation, not a cut). Brand type and the end card are
composited from rendered HTML — never generated — so the lettering and the
Speaking Flame seal stay crisp. Voiceover is Poonacha's own cloned voice.
"""
import pathlib
import re
import subprocess
import sys

import imageio_ffmpeg

HERE = pathlib.Path(__file__).parent.resolve()
FF = imageio_ffmpeg.get_ffmpeg_exe()


def run(args):
    p = subprocess.run([FF, "-y", "-loglevel", "error", *args],
                       capture_output=True, text=True)
    if p.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{p.stderr[-2000:]}")


def duration(path):
    p = subprocess.run([FF, "-i", str(path)], capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr)
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


# ── 1. Join the two film segments ────────────────────────────────────────────
concat_list = HERE / "concat.txt"
concat_list.write_text(f"file '{HERE}/film-raw.mp4'\nfile '{HERE}/film2-raw.mp4'\n")
film = HERE / "film30.mp4"
run(["-f", "concat", "-safe", "0", "-i", str(concat_list),
     "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p",
     "-r", "24", str(film)])
film_len = duration(film)
print(f"joined film: {film_len:.2f}s")

# ── 2. Per-language edit ─────────────────────────────────────────────────────
# caption windows as fractions of the spoken track, from sentence word counts
EDITS = {
    "en": {
        "vo": "vo-en-trim.wav",
        "total": 30.0,
        "cards": [("en1", 0.3, 4.6), ("en2", 4.9, 10.9), ("en3", 11.2, 15.4),
                  ("en4", 15.7, 21.9), ("en5", 22.2, 27.2)],
        "end": ("endEn", 27.5),
        "out": "kodavathakk-launch-reel-30s-english.mp4",
    },
    "kn": {
        # Kannada needs more syllables for the same meaning, so this cut runs
        # slightly longer rather than rushing the read.
        "vo": "vo-kn-trim.wav",
        "total": 33.0,
        "cards": [("kn1", 0.3, 4.7), ("kn2", 5.0, 10.6), ("kn3", 10.9, 16.0),
                  ("kn4", 16.3, 23.1), ("kn5", 23.4, 29.8)],
        "end": ("endKn", 30.0),
        "out": "kodavathakk-launch-reel-30s-kannada.mp4",
    },
}

for lang, cfg in EDITS.items():
    total = cfg["total"]
    vo = HERE / cfg["vo"]
    vo_len = duration(vo)
    tempo = max(0.9, min(1.25, vo_len / total))  # keep the read natural
    print(f"[{lang}] voice {vo_len:.2f}s → {total:.1f}s (atempo {tempo:.3f})")

    inputs = ["-i", str(film)]
    for cid, _, _ in cfg["cards"]:
        inputs += ["-loop", "1", "-t", str(total), "-i", str(HERE / f"ov30-{cid}.png")]
    inputs += ["-loop", "1", "-t", str(total), "-i", str(HERE / f"ov30-{cfg['end'][0]}.png")]
    inputs += ["-i", str(vo)]
    vo_idx = 1 + len(cfg["cards"]) + 1

    parts = []
    # hold the final frame if the cut runs past the generated film
    if total > film_len:
        parts.append(f"[0:v]tpad=stop_mode=clone:stop_duration={total - film_len + 0.4:.2f}[base];")
        last = "base"
    else:
        last = "0:v"

    for i, (cid, start, end) in enumerate(cfg["cards"], start=1):
        parts.append(
            f"[{i}:v]format=rgba,fade=t=in:st={start}:d=0.5:alpha=1,"
            f"fade=t=out:st={end - 0.5:.2f}:d=0.5:alpha=1[o{i}];")
    end_idx = len(cfg["cards"]) + 1
    parts.append(f"[{end_idx}:v]format=rgba,fade=t=in:st={cfg['end'][1]}:d=0.7:alpha=1[oend];")

    for i, (cid, start, end) in enumerate(cfg["cards"], start=1):
        parts.append(
            f"[{last}][o{i}]overlay=0:0:enable='between(t,{start - 0.1:.2f},{end + 0.1:.2f})'[v{i}];")
        last = f"v{i}"
    parts.append(
        f"[{last}][oend]overlay=0:0:enable='between(t,{cfg['end'][1] - 0.1:.2f},{total})',"
        f"format=yuv420p,trim=duration={total}[vout];")
    parts.append(
        f"[{vo_idx}:a]atempo={tempo:.4f},aresample=48000,"
        f"apad,atrim=duration={total},afade=t=out:st={total - 0.4:.2f}:d=0.4[aout]")

    run([*inputs, "-filter_complex", "".join(parts),
         "-map", "[vout]", "-map", "[aout]",
         "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "19",
         "-pix_fmt", "yuv420p", "-r", "24", "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "192k",
         str(HERE / cfg["out"])])
    out = HERE / cfg["out"]
    print(f"[{lang}] built {out.name} — {duration(out):.2f}s, "
          f"{out.stat().st_size / 1e6:.1f} MB")
