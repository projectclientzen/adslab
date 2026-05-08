#!/usr/bin/env bash
set -euo pipefail

echo "== Current branch =="
git branch --show-current

echo ""
echo "== Git status =="
git status --short

echo ""
echo "== Recent commits =="
git log --oneline -5

echo ""
echo "== Changed files =="
git diff --name-only

echo ""
echo "== Staged files =="
git diff --cached --name-only

