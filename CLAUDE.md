# CLAUDE.md — n8n-hosting

This file guides Claude Code when working in this repository.

---

## Role

n8n deployment infrastructure and AI workflow library.

- `docker-compose/` — deployment profiles (basic, Postgres, Postgres+Worker, Caddy SSL)
- `kubernetes/` — K8s manifests
- `workflows/` — AI Operating Model audit workflows, SharePoint integration, MCP tool workflows
- `services/` — supporting services (agent-factory-mcp, etc.)

---

## Canonical Clone

**This is the canonical clone.** Path: `/Users/Apple/Documents/GitHub/n8n-hosting`

Two stale duplicate clones exist and must NOT be edited:
- `/Users/Apple/Desktop/n8n-hosting`
- `/Users/Apple/ai-platform-lab/n8n-hosting`

If you find yourself in one of those paths, stop and switch to this canonical clone.

---

## Branches

| Branch | Status | Action |
|--------|--------|--------|
| `main` | Stable | Canonical branch |
| `claude/review-repository-CD8g2` | **URGENT** | Removes committed `.env` files with live credentials. Merge ASAP. |
| `codex/add-.env.example-for-each-folder` | Ready | Low-risk — adds `.env.example` files. Merge soon. |
| `claude/improve-vs-studio-setup-7tpeQ` | Ready | Low-risk — VS Code config. Merge soon. |
| `codex/validate-n8n-json-structure` | Ready | Bug fix on SharePoint LIVE v1 workflow. Merge soon. |
| *(others)* | See inventory | `docs/archive/codex-branch-inventory.md` |

Do NOT delete any branch in the inventory unless it is marked "Discard" AND the user has explicitly approved deletion.

---

## Security Rules

- `.env` files must NEVER be committed. `.env.example` only.
- Exposed credentials were previously committed and have been removed by `claude/review-repository-CD8g2`. Rotate all affected credentials.
- Before any commit, run:

```bash
find . -name ".env" | grep -v ".env.example"
grep -R "POSTGRES_PASSWORD\|N8N_ENCRYPTION_KEY\|API_KEY" . --exclude-dir=.git --include="*.env" --include="*.yml"
```

---

## Branch Safety

Before deleting any branch:

```bash
git log main..BRANCH --oneline
git branch --contains BRANCH
git status
git remote -v
```

If `git log` returns any commits — stop. Document and ask the user.

---

## Current Priorities

1. Merge `claude/review-repository-CD8g2` — removes exposed credentials.
2. Merge `codex/add-.env.example-for-each-folder` — improves setup UX.
3. Merge `claude/improve-vs-studio-setup-7tpeQ` — VS Code config.
4. Merge `codex/validate-n8n-json-structure` — SharePoint workflow bug fix.
5. Review `codex/recreate-n8n-workflow-from-screenshot` — 7 MCP tool workflows worth keeping.
6. Review `codex/build-ai-agent-factory` — agent factory scaffold, consider extracting to `ai-platform-lab`.
