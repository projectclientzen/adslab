#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-fix.sh TASK-002"
  exit 1
fi

cat <<EOF
Claude Code meminta revisi untuk ${TASK_ID}.

Baca:
- CLAUDE_REVIEW.md
- TASKS.md
- ACCEPTANCE_CRITERIA.md
- CODEX_IMPLEMENTATION_LOG.md
- TEST_RESULTS.md
- file yang disebut di CLAUDE_REVIEW.md

Kerjakan hanya revisi untuk ${TASK_ID}.
Jangan mengerjakan task lain.
Jangan mengubah scope di luar review Claude.

Setelah selesai:
1. Update CODEX_IMPLEMENTATION_LOG.md.
2. Update TEST_RESULTS.md.
3. Jalankan ulang check command yang diminta Claude.
4. Berikan ringkasan perubahan revisi.

Jangan push ke GitHub.
Jangan commit sendiri kecuali saya minta.
EOF

