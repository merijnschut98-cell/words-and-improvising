#!/usr/bin/env bash
# Voice A/B (2026-11-09): render every variant N times and measure them.
#   bash films/_kit/voice-ab/run-all.sh <voices dir> <work dir> <whisper model> [N]
# Piper (VITS) samples noise, so each render differs a little: the table
# reports the mean over N renders. Render 1 is the listening sample.
set -euo pipefail
cd "$(dirname "$0")/../../.."
V=$1; W=$2; M=$3; N=${4:-3}
K=films/_kit/voice-ab
mkdir -p "$W"
node $K/plan.mjs > "$W/plan.json"
for i in $(seq 1 "$N"); do
  python3 -I $K/synth.py "$W/plan.json" A "$V/nl_NL-ronnie-medium.onnx" 0.82 "$W/A-$i.wav"
  python3 -I $K/synth.py "$W/plan.json" B "$V/nl_NL-ronnie-medium.onnx" 0.82 "$W/B-$i.wav" --trim
  python3 -I $K/synth.py "$W/plan.json" C "$V/nl_NL-ronnie-medium.onnx" 0.82 "$W/C-$i.wav" --trim --lex $K/lexicon-small.json
  python3 -I $K/synth.py "$W/plan.json" D "$V/nl_NL-ronnie-medium.onnx" 0.82 "$W/D-$i.wav"
  python3 -I $K/synth.py "$W/plan.json" C "$V/nl_NL-alex-medium.onnx" 1.15 "$W/E-alex-$i.wav" --trim --lex $K/lexicon-small.json
  python3 -I $K/synth.py "$W/plan.json" C "$V/nl_NL-pim-medium.onnx" 0.82 "$W/E-pim-$i.wav" --trim --lex $K/lexicon-small.json
done
HF_HUB_OFFLINE=1 python3 -I $K/measure.py "$W/plan.json" "$W"/*-[0-9].wav --model "$M" > "$W/measure.jsonl"
