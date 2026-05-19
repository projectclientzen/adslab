#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: ./scripts/ai-autopilot-codex.sh TASK-012 TASK-013 TASK-014"
  exit 1
fi

mkdir -p tmp/ai-prompts tmp/ai-autopilot

for TASK_ID in "$@"; do
  echo ""
  echo "========================================"
  echo "Starting ${TASK_ID}"
  echo "========================================"

  if [ -n "$(git status --porcelain)" ]; then
    echo "Repo belum clean. Berhenti sebelum ${TASK_ID}."
    git status --short
    exit 1
  fi

  PROMPT_FILE="tmp/ai-prompts/codex_${TASK_ID}_autopilot.txt"

  cat > "$PROMPT_FILE" <<EOF
Kamu adalah operator implementasi untuk project ini.

Baca:
- AGENTS.md
- PRD.md jika ada
- ADS_LAB_PRD_v2 2.md jika ada
- ACCEPTANCE_CRITERIA.md
- TASKS.md
- CODEX_IMPLEMENTATION_LOG.md
- TEST_RESULTS.md

Kerjakan hanya ${TASK_ID}.

Aturan wajib:
1. Jangan mengerjakan task lain selain ${TASK_ID}.
2. Jangan mengubah scope.
3. Jangan mengubah file yang tidak relevan.
4. Ikuti Definition of Done di TASKS.md.
5. Jalankan test/lint/build/check yang relevan.
6. Update CODEX_IMPLEMENTATION_LOG.md.
7. Update TEST_RESULTS.md.
8. Jangan commit.
9. Jangan push.

KPI wajib sebelum selesai:
- KPI: PASS hanya jika implementasi sesuai ${TASK_ID}.
- KPI: PASS hanya jika tidak ada scope creep.
- KPI: PASS hanya jika test/check relevan sudah dijalankan.
- KPI: PASS hanya jika risiko besar tidak ada.
- Jika ada risiko besar, tulis BLOCKED dan jangan lanjut.

Self-review wajib:
Di akhir CODEX_IMPLEMENTATION_LOG.md, tambahkan section:

## Self-review ${TASK_ID}

Status: SELF-REVIEW: PASS atau SELF-REVIEW: FAIL
KPI: PASS atau KPI: FAIL

Checklist:
- Scope sesuai task: yes/no
- Tidak ada scope creep: yes/no
- Test/check dijalankan: yes/no
- Risiko besar: none/list
- File yang diubah: list
- Catatan untuk human reviewer: ringkas

Jika semua aman, tulis:
SELF-REVIEW: PASS
KPI: PASS

Jika tidak aman, tulis:
SELF-REVIEW: FAIL
KPI: FAIL
BLOCKED

Sekarang implementasikan ${TASK_ID}.
EOF

  echo ""
  echo "Prompt dibuat:"
  echo "$PROMPT_FILE"
  echo ""
  echo "Copy prompt berikut ke Codex:"
  echo "----------------------------------------"
  cat "$PROMPT_FILE"
  echo "----------------------------------------"
  echo ""
  read -r -p "Setelah Codex selesai ${TASK_ID}, tekan Enter di sini..."

  echo ""
  echo "== Git status setelah Codex =="
  git status --short

  if [ -z "$(git status --porcelain)" ]; then
    echo "Tidak ada perubahan untuk ${TASK_ID}. Berhenti."
    exit 1
  fi

  echo ""
  echo "== Validasi KPI/self-review =="
  if ! grep -q "Self-review ${TASK_ID}" CODEX_IMPLEMENTATION_LOG.md; then
    echo "Gagal: CODEX_IMPLEMENTATION_LOG.md tidak punya section Self-review ${TASK_ID}."
    exit 1
  fi

  if ! grep -q "SELF-REVIEW: PASS" CODEX_IMPLEMENTATION_LOG.md; then
    echo "Gagal: SELF-REVIEW: PASS tidak ditemukan."
    exit 1
  fi

  if ! grep -q "KPI: PASS" CODEX_IMPLEMENTATION_LOG.md; then
    echo "Gagal: KPI: PASS tidak ditemukan."
    exit 1
  fi

  if grep -q "BLOCKED" CODEX_IMPLEMENTATION_LOG.md; then
    echo "Gagal: Codex menandai BLOCKED."
    exit 1
  fi

  echo "KPI/self-review PASS."

  echo ""
  echo "== Diff stat =="
  git diff --stat

  echo ""
  read -r -p "Auto commit dan push ${TASK_ID}? Ketik y lalu Enter: " CONFIRM

  if [ "$CONFIRM" != "y" ]; then
    echo "Commit dibatalkan untuk ${TASK_ID}."
    exit 1
  fi

  git add .
  git commit -m "Implement ${TASK_ID}"
  git push

  echo ""
  echo "✅ ${TASK_ID} selesai, commit, dan push."
done

echo ""
echo "✅ Semua task selesai."
