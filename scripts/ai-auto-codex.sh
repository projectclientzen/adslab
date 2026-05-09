codex exec \
  --sandbox workspace-write \
  "$(cat "$PROMPT_FILE")" | tee "$LOG_FILE"#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-auto-codex.sh TASK-009"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Repo belum clean. Commit/stash dulu."
  git status --short
  exit 1
fi

mkdir -p tmp/ai-prompts tmp/ai-logs

PROMPT_FILE="tmp/ai-prompts/codex_${TASK_ID}.txt"
LOG_FILE="tmp/ai-logs/codex_${TASK_ID}.log"

./scripts/ai-task.sh "$TASK_ID" > "$PROMPT_FILE"

echo "== Running Codex non-interactive for ${TASK_ID} =="
echo "Prompt: $PROMPT_FILE"
echo "Log:    $LOG_FILE"

codex exec \
  --sandbox workspace-write \
  --ask-for-approval never \
  "$(cat "$PROMPT_FILE")" | tee "$LOG_FILE"

echo ""
echo "== Git status after Codex =="
git status --short

if [ -z "$(git status --porcelain)" ]; then
  echo "Codex selesai, tapi tidak ada perubahan file."
  exit 1
fi

echo ""
echo "== Diff stat =="
git diff --stat

echo ""
read -r -p "Commit dan push implementasi ${TASK_ID}? Ketik y lalu Enter: " OK

if [ "$OK" != "y" ]; then
  echo "Commit dibatalkan. Cek manual dengan git diff."
  exit 1
fi

git add .
git commit -m "Implement ${TASK_ID}"
git push

./scripts/ai-review.sh "$TASK_ID" > "tmp/ai-prompts/claude_review_${TASK_ID}.txt"

echo ""
echo "✅ Implementasi ${TASK_ID} sudah commit dan push."
echo ""
echo "Prompt review Claude sudah dibuat:"
echo "tmp/ai-prompts/claude_review_${TASK_ID}.txt"
echo ""
echo "Untuk review sekarang:"
echo "cat tmp/ai-prompts/claude_review_${TASK_ID}.txt"
