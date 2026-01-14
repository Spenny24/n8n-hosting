# Agent Factory MCP Service

This service exposes a minimal MCP-style orchestrator that turns an AI agent idea into a versioned repository skeleton. It is designed to be called by the accompanying n8n workflow.

## Features

- Validates inbound payloads describing the agent brief and reasoning chain
- Calls the OpenAI Responses API with a JSON schema contract to coerce structured boilerplate
- Returns a repository manifest (file paths + contents), environment variable hints, and follow-up tasks
- Emits deterministic file fingerprints to simplify GitHub commits inside n8n

## Configuration

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Token with access to the chosen model |
| `OPENAI_MODEL` | Optional. Defaults to `gpt-4.1-mini` |
| `PORT` | Optional. Defaults to `3000` |
| `ALLOW_ORIGIN` | Optional. CORS allowlist. Defaults to `*` |

Create a `.env` file when running locally:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
ALLOW_ORIGIN=http://localhost:5678
```

## Endpoints

### `POST /generate`

Request body:

```json
{
  "idea": {
    "id": "rec123",
    "title": "AI support triage",
    "problem": "Support queue backlog",
    "persona": "Support director",
    "successCriteria": ["CSAT > 4.5", "Reduce manual tickets by 60%"],
    "stack": ["Slack", "Zendesk"],
    "channels": ["email", "slack"]
  },
  "context": {
    "priorArtifacts": ["https://github.com/org/template"],
    "notes": "Bias toward SOC2 compliant vendors"
  },
  "plan": {
    "summary": "LLM-backed triage agent",
    "implementationSteps": ["spec", "scaffold", "deploy"],
    "governance": "Weekly review"
  }
}
```

Successful response:

```json
{
  "projectName": "ai-support-triage",
  "summary": "Bootstrap a triage assistant...",
  "files": [
    {
      "path": "README.md",
      "contents": "# AI Support Triage...",
      "hash": "..."
    }
  ],
  "env": {
    "OPENAI_API_KEY": "Set via n8n credential",
    "ZENDESK_API_KEY": "Vault"
  },
  "nextActions": ["Provision Slack app", "Create Zendesk API token"]
}
```

## Local Development

```bash
npm install
npm run dev
# or compile once and start from dist
npm run build
npm start
```

### Running alongside a locally hosted n8n (no Compose)

1. Copy `.env.example` to `.env` and populate it with your OpenAI key. Leave `PORT=3000` unless it clashes.
2. Start the service with `npm run dev` during development or `npm start` from the build output.
3. Ensure it listens on `0.0.0.0` (default for Express) so Dockerised n8n can reach it. If you restrict the interface, map the port with `ssh -L` or your reverse proxy.
4. Inside the n8n container, set `MCP_BASE_URL` to `http://host.docker.internal:3000` (macOS/Windows) or `http://172.17.0.1:3000` (Linux) so the workflow hits the host service.
5. When exposing through Cloudflare Tunnels, add the tunnel URL to `ALLOW_ORIGIN` and tighten any IP ACLs.

## Docker

```bash
npm install
npm run build
docker build -t agent-factory-mcp .
docker run --env-file .env -p 3000:3000 agent-factory-mcp
```

## Health Check

`GET /healthz` returns `{ "status": "ok" }` when the service is ready.

