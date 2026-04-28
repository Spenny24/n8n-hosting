# Codex / Claude Branch Inventory

**Repo**: `Spenny24/n8n-hosting` (canonical clone: `~/Documents/GitHub/n8n-hosting`)
**Created**: 2026-04-28
**Purpose**: Preserve visibility of all unmerged Codex/Claude branches before cleanup decisions.

Three already-merged branches were deleted on 2026-04-28:
- `codex/find-and-fix-important-bug` — merged via PR #1
- `claude/ai-operating-model-audit-9gMfd` — merged into main
- `cursor/launch-local-server-on-port-5678-9e76` — 0 unique commits

---

## Branches with Unique Work

### 1. `codex/build-ai-agent-factory`
**Commits**: 1 — `c2ceedf Improve local MCP setup guidance`
**Files changed**: 13 files, 6,214 insertions
**Contents**:
- `services/agent-factory-mcp/` — Full TypeScript MCP service (`src/index.ts`, `tsconfig.json`, Docker config)
- `workflows/ai-agent-factory/workflow.json` — n8n agent factory workflow (397 lines)
- `workflows/ai-agent-factory/README.md` — Setup guide (112 lines)

**Assessment**: Prototype — substantial but not production-ready. Agent factory pattern with MCP is a real architectural direction.
**Recommended action**: Keep — extract to `ai-platform-lab` or merge when agent infrastructure is prioritised.

---

### 2. `codex/create-json-file-for-n8n-nodes`
**Commits**: 1 — `3f6a548 Add lead mining workflow JSON for n8n pipeline`
**Files changed**: 1 file, 684 insertions
**Contents**:
- `workflows/lead-mining-outreach.json` — Full lead mining + outreach pipeline workflow

**Assessment**: Prototype. Related to GTM/lead gen work in `workflow-intelligence-engine`.
**Recommended action**: Extract — move to `workflow-intelligence-engine` alongside the GTM engine work, or into `coneytech-tracker` if property-specific.

---

### 3. `codex/create-json-n8n-nodes-for-video-automation`
**Commits**: 1 — `86f6767 Add n8n workflows for viral content automations`
**Files changed**: 7 files, 3,098 insertions
**Contents**:
- `workflows/tiktok_viral_scraper.json`
- `workflows/viral_ai_videos_to_tiktok.json`
- `workflows/viral_content_ai.json`
- `workflows/viral_instagram_reels.json`
- Plus additional workflow files

**Assessment**: Prototype. Experimental content automation workflows — viral video, TikTok, Instagram.
**Recommended action**: Keep — useful content automation library. Merge later when a content automation project is started.

---

### 4. `codex/create-n8n-automation-for-coneytech-tracker`
**Commits**: 1 — `f89d821 Add ConeyTech tracking workflow for n8n`
**Files changed**: 2 files, 309 insertions
**Contents**:
- `workflows/coneytech-market-tracker.json` — ConeyTech property market tracker workflow
- `README.md` additions — Setup notes

**Assessment**: Prototype. Duplicates intent of `coneytech-tracker` repo workflows.
**Recommended action**: Extract — move `coneytech-market-tracker.json` to `~/coneytech-tracker/workflows/` and delete this branch.

---

### 5. `codex/create-n8n-json-workflow-for-youtube-shorts`
**Commits**: 1 — `4d6849a Add zero-cost shorts factory n8n workflow`
**Files changed**: 2 files, 383 insertions
**Contents**:
- `workflows/youtube-shorts-factory.json` — YouTube Shorts automation (zero-cost approach)
- `README.md` additions

**Assessment**: Prototype. Standalone content automation workflow.
**Recommended action**: Keep — merge later into a content automation project.

---

### 6. `codex/find-url-to-connect-n8n-to-telegram`
**Commits**: 1 — `9f639bc Add documentation for Telegram bot webhook URL`
**Files changed**: 1 file, 17 insertions
**Contents**:
- `docs/telegram-bot-webhook.md` — 17-line doc on Telegram bot webhook URL format

**Assessment**: Discard candidate. Trivial doc, likely superseded by n8n or Telegram official docs.
**Recommended action**: Delete later — no unique workflow code, no production value.

---

### 7. `codex/fix-missing-file-field-error`
**Commits**: 3 — Whisper HTTP Request node docs (3 iterations)
**Files changed**: 1 file, 179 insertions (README only)
**Contents**:
- `README.md` — Whisper HTTP Request configuration guide, binary property selection docs

**Assessment**: Useful reference documentation for Whisper + n8n integration.
**Recommended action**: Merge later — low-risk README-only change, useful for anyone running Whisper in n8n.

---

### 8. `codex/fix-workflow-issues-in-n8n`
**Commits**: 1 — `42623af Add corrected AI operating model audit workflow`
**Files changed**: 1 file, 1,344 insertions
**Contents**:
- `workflows/ai-operating-model-audit.json` — Corrected version of AI Operating Model audit workflow

**Assessment**: Prototype. Potentially superseded by later versions in main (`b7fef7d feat: implement P1 enhancements`). Needs comparison against current main workflow.
**Recommended action**: Review — compare against current `workflows/` in main to determine if this contains fixes not already incorporated. Merge or delete after review.

---

### 9. `codex/recreate-n8n-workflow-from-screenshot`
**Commits**: 1 — `b88a044 Add AI operations automation workflows`
**Files changed**: 8 files, 3,179 insertions
**Contents**:
- `workflows/ai-operations-assistant.json`
- `workflows/google-calendar-mcp-tools.json`
- `workflows/google-drive-mcp-tools.json`
- `workflows/google-mail-mcp-tools.json`
- `workflows/linkedin-mcp-tools.json`
- `workflows/twitter-mcp-tools.json`
- `workflows/utility-mcp-tools.json`
- `workflows/README.md`

**Assessment**: Valuable MCP tool workflow library — 7 integrations (Google Cal, Drive, Mail, LinkedIn, Twitter, utility). Aligns with AI ops platform direction.
**Recommended action**: Keep — merge when MCP integration layer is prioritised. High-value workflow set.

---

### 10. `codex/add-.env.example-for-each-folder`
**Commits**: 1 — `997f52b Add .env.example files and update README instructions`
**Files changed**: 8 files, 60 insertions, 3 deletions
**Contents**:
- `.env.example` files for `docker-caddy/`, `docker-compose/subfolderWithSSL/`, `docker-compose/withPostgres/`, `docker-compose/withPostgresAndWorker/`
- Corresponding README updates

**Assessment**: Production-ready. Safe, low-risk improvement to the repo's setup UX.
**Recommended action**: Merge soon — no risk, improves onboarding for new environments.

---

### 11. `claude/review-changes-mjvvrdwfz3llig4v-RIfgY`
**Commits**: 1 — `e26e67d Implement comprehensive CI validation workflow`
**Files changed**: 1 file, 129 insertions
**Contents**:
- `.github/workflows/blank.yml` — Expanded CI workflow with comprehensive validation steps

**Assessment**: Production-ready. Extends existing CI baseline.
**Recommended action**: Merge when CI is being actively maintained.

---

### 12. `claude/adapt-workflow-google-microsoft-AYrsk` *(appeared 2026-04-28)*
**Commits**: 2 — Google→Microsoft migration + Companies House API integration
**Files changed**: 4 files, 964 insertions, 166 deletions
**Contents**:
- `workflows/WPP AI Operating Model - Complete Edition (2).json` — Migrated to Microsoft Suite
- `workflows/MIGRATION_REPORT.txt` — Full migration report (331 lines)
- `workflows/migration_report.json` and `migration_report_structured.json` — Structured migration data

**Assessment**: Production-ready variant. Complete edition of the AI Operating Model audit workflow migrated from Google to Microsoft 365. Significant divergence from the Google Sheets edition.
**Recommended action**: Keep — merge when a Microsoft/SharePoint deployment is needed. Do not delete.

---

### 13. `claude/improve-vs-studio-setup-7tpeQ` *(appeared 2026-04-28)*
**Commits**: 1 — `3b70780 feat: Add comprehensive VS Code workspace configuration`
**Files changed**: 5 files, 519 insertions
**Contents**:
- `.vscode/settings.json` — Editor and workspace settings (131 lines)
- `.vscode/extensions.json` — Recommended extensions (49 lines)
- `.vscode/launch.json` — Debug configs (36 lines)
- `.vscode/tasks.json` — Build/run tasks (250 lines)

**Assessment**: Production-ready. No logic risk — pure IDE config.
**Recommended action**: Merge soon — improves developer experience with no downside risk.

---

### 14. `claude/review-repository-CD8g2` *(appeared 2026-04-28)*
**Commits**: 3 — Security fixes, repo reorganisation, credential removal
**Files changed**: 32 files, 1,829 insertions, 3,386 deletions
**Contents**:
- **Removes exposed `.env` files** from `docker-caddy/`, `docker-compose/subfolderWithSSL/`, `docker-compose/withPostgres/`, `docker-compose/withPostgresAndWorker/`
- Removes large workflow JSON files committed to root
- Adds `workflows/README.md` (540 lines)
- Reorganises repo structure

**Assessment**: SECURITY CRITICAL. Live `.env` files with credentials are currently committed to the repository. This branch removes them.
**Recommended action**: Merge ASAP — review the 3,386 deletions to confirm no valuable content is lost, then merge. Credentials in `.env` files should be rotated after merge.

---

### 15. `codex/validate-n8n-json-structure` *(appeared 2026-04-28)*
**Commits**: 3 — SharePoint LIVE v1 workflow validation and URL fixes
**Files changed**: 1 file, 1,002 insertions
**Contents**:
- `workflows/WPP AI Operating Model Audit - SharePoint LIVE v1.json` — Validated SharePoint version with hardened URL path encoding

**Assessment**: Production-ready fix. 3 iterative commits hardening the SharePoint report URL generation.
**Recommended action**: Merge — this is a bug fix on a production workflow variant. Low risk.

---

## Summary Table

| Branch | Type | Files | Lines | Readiness | Action |
|--------|------|-------|-------|-----------|--------|
| `codex/build-ai-agent-factory` | Feature | 13 | +6,214 | Prototype | Keep, extract to ai-platform-lab |
| `codex/create-json-file-for-n8n-nodes` | Workflow | 1 | +684 | Prototype | Extract to workflow-intelligence-engine |
| `codex/create-json-n8n-nodes-for-video-automation` | Workflow | 7 | +3,098 | Prototype | Keep, merge with content project |
| `codex/create-n8n-automation-for-coneytech-tracker` | Workflow | 2 | +309 | Prototype | Extract to coneytech-tracker |
| `codex/create-n8n-json-workflow-for-youtube-shorts` | Workflow | 2 | +383 | Prototype | Keep, merge with content project |
| `codex/find-url-to-connect-n8n-to-telegram` | Docs | 1 | +17 | Discard | Delete later |
| `codex/fix-missing-file-field-error` | Docs | 1 | +179 | Ready | Merge later |
| `codex/fix-workflow-issues-in-n8n` | Workflow | 1 | +1,344 | Review needed | Compare vs main, then merge or delete |
| `codex/recreate-n8n-workflow-from-screenshot` | Workflow | 8 | +3,179 | Prototype | Keep, merge with MCP project |
| `codex/add-.env.example-for-each-folder` | Config | 8 | +60 | Ready | Merge soon |
| `claude/review-changes-mjvvrdwfz3llig4v-RIfgY` | CI/CD | 1 | +129 | Ready | Merge when CI active |
| `claude/adapt-workflow-google-microsoft-AYrsk` | Workflow | 4 | +964 | Ready | Keep for Microsoft deployment |
| `claude/improve-vs-studio-setup-7tpeQ` | Config | 5 | +519 | Ready | Merge soon |
| `claude/review-repository-CD8g2` | Security | 32 | -1,557 net | **URGENT** | **Merge ASAP — removes exposed credentials** |
| `codex/validate-n8n-json-structure` | Bug fix | 1 | +1,002 | Ready | Merge soon |
