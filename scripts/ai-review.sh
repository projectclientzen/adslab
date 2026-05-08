#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/ai-review.sh TASK-002"
  exit 1
fi

cat <<EOF
Review implementasi terakhir Codex untuk ${TASK_ID}.

Gunakan:
- git diff HEAD~1..HEAD jika sudah commit
- git diff jika belum commit
- AGENTS.md
- PRD.md jika ada
- ADS_LAB_PRD_v2 2.md jika ada
- ACCEPTANCE_CRITERIA.md
- TASKS.md
- CODEX_IMPLEMENTATION_LOG.md
- TEST_RESULTS.md

Cek:
1. Apakah implementasi sesuai PRD?
2. Apakah sesuai ${TASK_ID}?
3. Apakah ada scope creep?
4. Apakah perubahan file relevan?
5. Apakah test/lint/build/check cukup?
6. Apakah ada risiko security?
7. Apakah ada risiko maintainability?
8. Apakah ada risiko data integrity?
9. Apakah ada risiko UX/performance bila relevan?

Update CLAUDE_REVIEW.md.

Output akhir wajib:
- APPROVED
atau
- REQUEST CHANGES

Jika REQUEST CHANGES, tulis instruksi revisi spesifik untuk Codex dengan format:
- masalah
- file terkait
- perubahan yang diminta
- check command yang harus dijalankan ulang
EOF
