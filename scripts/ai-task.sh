#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-task.sh TASK-002"
  exit 1
fi

cat <<EOF
Kamu adalah operator implementasi untuk project ini.

Baca:
- AGENTS.md
- PRD.md jika ada
- ADS_LAB_PRD_v2 2.md jika ada
- ACCEPTANCE_CRITERIA.md
- TASKS.md

Kerjakan hanya ${TASK_ID}.

Aturan wajib:
1. Jangan mengerjakan task lain selain ${TASK_ID}.
2. Jangan mengubah scope.
3. Jangan mengubah file yang tidak relevan.
4. Ikuti Definition of Done di TASKS.md.
5. Jika perlu membuat atau mengubah struktur project, lakukan hanya yang dibutuhkan ${TASK_ID}.
6. Setelah selesai, update CODEX_IMPLEMENTATION_LOG.md.
7. Jalankan test/lint/build/check yang relevan.
8. Simpan hasil command ke TEST_RESULTS.md.
9. Berikan ringkasan file yang diubah dan risiko tersisa.
10. Jangan push ke GitHub.
11. Jangan commit sendiri kecuali saya minta.

Sebelum mulai, ringkas dulu:
- objective ${TASK_ID}
- file yang kemungkinan berubah
- check command yang akan dijalankan

Lalu implementasikan ${TASK_ID}.
EOF
