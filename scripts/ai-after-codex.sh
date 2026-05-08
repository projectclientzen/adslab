#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-after-codex.sh TASK-008"
  exit 1
fi

mkdir -p tmp/ai-prompts

echo "== Git status =="
git status --short

echo ""
echo "== Changed files =="
git diff --name-only

echo ""
echo "== Diff stat =="
git diff --stat

REVIEW_PROMPT_FILE="tmp/ai-prompts/claude_review_${TASK_ID}.txt"
./scripts/ai-review.sh "$TASK_ID" > "$REVIEW_PROMPT_FILE"

echo ""
echo "✅ Prompt review Claude untuk ${TASK_ID} sudah dibuat:"
echo "$REVIEW_PROMPT_FILE"

echo ""
echo "Langkah berikutnya:"
echo "1. Review diff dulu:"
echo "   git diff"
echo ""
echo "2. Kalau perubahan sesuai, commit:"
echo "   git add ."
echo "   git commit -m \"Implement ${TASK_ID}\""
echo "   git push"
echo ""
echo "3. Paste prompt review ini ke Claude Code:"
echo "   cat $REVIEW_PROMPT_FILE"
