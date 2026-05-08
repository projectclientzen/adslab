#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-next.sh TASK-008"
  exit 1
fi

mkdir -p tmp/ai-prompts

if [ -n "$(git status --porcelain)" ]; then
  echo "Repo belum clean. Commit/stash perubahan dulu sebelum mulai ${TASK_ID}."
  echo ""
  git status --short
  exit 1
fi

PROMPT_FILE="tmp/ai-prompts/codex_${TASK_ID}.txt"

./scripts/ai-task.sh "$TASK_ID" > "$PROMPT_FILE"

echo "✅ Prompt Codex untuk ${TASK_ID} sudah dibuat:"
echo "$PROMPT_FILE"
echo ""
echo "Langkah berikutnya:"
echo "1. Buka Codex:"
echo "   cd \"/Volumes/Daily Project/adslab\""
echo "   export OPENAI_API_KEY='API_KEY_9ROUTER_KAMU'"
echo "   codex"
echo ""
echo "2. Paste isi prompt ini ke Codex:"
echo "   cat $PROMPT_FILE"
echo ""
echo "3. Setelah Codex selesai, jalankan:"
echo "   ./scripts/ai-after-codex.sh ${TASK_ID}"
