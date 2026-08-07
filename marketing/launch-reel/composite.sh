#!/bin/bash
# Composite the brand type + end card over the Seedance film.
# Type is rendered HTML (real brand fonts + the actual seal SVG), never
# generated — AI-rendered lettering garbles.
set -euo pipefail
cd "$(dirname "$0")"

FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")

# Overlay windows, matched to the footage beats:
#   0.4– 3.0  hills in blue mist      → "Our language has no script."
#   3.4– 6.0  descent to the ainmane  → "It lives in the voice."
#   6.4– 9.0  the lamp, flame steady  → "Every elder is a living archive."
#   9.4–12.2  rings pulse from flame  → "Today, we begin recording — together."
#  12.2–13.0  clean dawn reveal (no type)
#  13.0–15.0  end card dissolves in

"$FF" -y -loglevel error \
  -i film-raw.mp4 \
  -loop 1 -t 15 -i overlay-t1.png \
  -loop 1 -t 15 -i overlay-t2.png \
  -loop 1 -t 15 -i overlay-t3.png \
  -loop 1 -t 15 -i overlay-t4.png \
  -loop 1 -t 15 -i overlay-end.png \
  -f lavfi -t 15 -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -filter_complex "\
[1:v]format=rgba,fade=t=in:st=0.4:d=0.5:alpha=1,fade=t=out:st=2.5:d=0.5:alpha=1[o1];\
[2:v]format=rgba,fade=t=in:st=3.4:d=0.5:alpha=1,fade=t=out:st=5.5:d=0.5:alpha=1[o2];\
[3:v]format=rgba,fade=t=in:st=6.4:d=0.5:alpha=1,fade=t=out:st=8.5:d=0.5:alpha=1[o3];\
[4:v]format=rgba,fade=t=in:st=9.4:d=0.5:alpha=1,fade=t=out:st=11.7:d=0.5:alpha=1[o4];\
[5:v]format=rgba,fade=t=in:st=13.0:d=0.6:alpha=1[o5];\
[0:v][o1]overlay=0:0:enable='between(t,0.3,3.1)'[v1];\
[v1][o2]overlay=0:0:enable='between(t,3.3,6.1)'[v2];\
[v2][o3]overlay=0:0:enable='between(t,6.3,9.1)'[v3];\
[v3][o4]overlay=0:0:enable='between(t,9.3,12.3)'[v4];\
[v4][o5]overlay=0:0:enable='between(t,12.9,15)',format=yuv420p[vout]" \
  -map "[vout]" -map 6:a \
  -c:v libx264 -profile:v high -preset slow -crf 19 -pix_fmt yuv420p \
  -r 24 -movflags +faststart \
  -c:a aac -b:a 128k -shortest \
  kodavathakk-launch-reel.mp4

echo "built kodavathakk-launch-reel.mp4"
"$FF" -i kodavathakk-launch-reel.mp4 2>&1 | grep -E "Duration|Stream"
