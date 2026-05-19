#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-codex-task.sh TASK-010"
  exit 1
fi

./scripts/ai-task.sh "$TASK_ID"

cat <<EOF

Tambahan mode Codex-only:
- Claude Code sedang tidak dipakai karena long-context/rate-limit.
- Lakukan self-review ketat sebelum selesai.
- Update CODEX_IMPLEMENTATION_LOG.md dengan section "Self-review ${TASK_ID}".
- Update TEST_RESULTS.md dengan semua command validasi.
- Jika ada risiko besar, tulis BLOCKED dan jangan lanjut.
- Jangan mengerjakan task lain selain ${TASK_ID}.
- Jangan commit dan jangan push.
EOF
