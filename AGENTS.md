## Temporary Codex-Only Mode

Claude Code review is temporarily disabled due to long-context/rate-limit issues.

Until Claude Code is available again:
- Codex must perform a strict self-review before finishing each task.
- Codex must update CODEX_IMPLEMENTATION_LOG.md with a "Self-review" section.
- Codex must update TEST_RESULTS.md with all commands run and outputs.
- Codex must not mark a task as complete if there is a major uncertainty.
- If a change has high architectural risk, Codex must write BLOCKED and stop.
- Commits should not say "pending Claude review" unless explicitly requested.
