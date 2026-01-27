# AI Agent Factory Workflow

This workflow polls Airtable for new agent ideas, coordinates MCP-based code generation, versions the output in GitHub, and ships a ready-to-run Docker container. Import the JSON into n8n and wire your credentials to start generating bespoke agents.

## Airtable Schema

| Field | Type | Notes |
| --- | --- | --- |
| `Name` | Single line text | Human-friendly title |
| `Problem` | Long text | Pain point description |
| `Persona` | Single select | Decision maker |
| `Value` | Currency | Estimated contract value |
| `Success Criteria` | Multiple select | Quantified outcomes |
| `Stack` | Multiple select | Systems to integrate |
| `Channels` | Multiple select | Interfaces to expose |
| `Status` | Single select | `New`, `In Progress`, `Complete` |
| `Spec URL` | URL | Filled after GitHub PR | 
| `Repo` | URL | Optional pointer to target repo |
| `Notes` | Long text | Misc context |

Create a view filtered to `Status = New` and expose it through a personal access token credential named **"Airtable PAT (Agent Factory)"**.

## Required n8n Credentials

| Credential | Node(s) | Notes |
| --- | --- | --- |
| `Airtable PAT (Agent Factory)` | Airtable | Personal Access Token with `data.records:read` + `data.records:write` |
| `OpenAI (Agent Factory)` | OpenAI Chat node | `gpt-4.1` access recommended |
| `GitHub Agent Factory` | GitHub node | Repo scope for commits + PRs |
| `Docker Registry` | HTTP Request (deploy) | Optional if pushing images |

## Workflow Highlights

1. **Schedule Trigger**: Runs every hour and can be manually invoked.
2. **Airtable - Fetch Ideas**: Pulls `New` ideas and enriches them with metadata.
3. **OpenAI - Reasoning Chain**: Converts idea fields into a technical plan with steps + risk register.
4. **MCP Generate**: Sends the plan to the MCP service for structured boilerplate.
5. **GitHub Commit & PR**: Creates a feature branch, commits generated files, and opens a PR referencing the Airtable record.
6. **Docker Build Dispatch**: Triggers a GitHub Actions workflow (optional) to build and push a Docker image.
7. **Airtable Update**: Writes the PR URL + status back to Airtable for traceability.

## Environment Variables

Set these in your n8n container:

```
AIRTABLE_BASE_ID_AGENT_FACTORY=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_ID_AGENT_FACTORY=tblXXXXXXXXXXXXXX
AIRTABLE_VIEW_ID_AGENT_FACTORY=viwXXXXXXXXXXXXXX
MCP_BASE_URL=http://host.docker.internal:3000
GITHUB_AGENT_FACTORY_REPO=org/agent-factory
GITHUB_AGENT_FACTORY_MAIN=main
GITHUB_AGENT_FACTORY_RUN_WORKFLOW=true
GITHUB_AGENT_FACTORY_WORKFLOW=build-agent.yml
```

- `MCP_BASE_URL` defaults to `http://host.docker.internal:3000`, which lets a Dockerised n8n instance reach a service running on the host. On Linux, set it to `http://172.17.0.1:3000` or your host's LAN IP.

## Deployment Notes

- The MCP service lives in `services/agent-factory-mcp`. Copy `.env.example` to `.env` and supply your OpenAI key before starting it.
- When you run n8n inside Docker but keep the MCP service on the host, expose the service on `0.0.0.0` and leave `MCP_BASE_URL` at `http://host.docker.internal:3000` so the container can reach it.
- Linux Docker engines do not wire `host.docker.internal` automatically. Either add `--add-host=host.docker.internal:host-gateway` to your n8n container or point `MCP_BASE_URL` to `http://172.17.0.1:3000` (Docker bridge).
- You can still rely on Docker Compose (see override below) if you prefer to co-locate everything.

### Local MCP Service (no Compose)

```bash
cd services/agent-factory-mcp
cp .env.example .env
# edit .env with your OpenAI key
npm install
npm run build
node dist/index.js
```

The server listens on `http://127.0.0.1:3000` by default. Update `PORT` in `.env` to avoid clashes. Pair it with your Cloudflare tunnel or local firewall rules as needed.

### Docker Compose Override (optional)

Create `docker-compose/withPostgres/agent-factory.override.yml` with:

```yaml
services:
  agent-factory-mcp:
    build:
      context: ../../services/agent-factory-mcp
    env_file:
      - ../../services/agent-factory-mcp/.env
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      OPENAI_MODEL: ${OPENAI_MODEL-gpt-4.1-mini}
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Then run:

```bash
docker compose -f docker-compose.yml -f agent-factory.override.yml up -d agent-factory-mcp
```

- If you are already running n8n via `docker run`, launch the MCP container separately: `docker run --env-file services/agent-factory-mcp/.env -p 3000:3000 ghcr.io/your-tag` after building the image locally.

## Pitfalls

- Airtable field names must match exactly; rename inside the node if needed.
- GitHub branch collisions: the workflow creates `idea/<airtable-id>`; ensure automation cleans up closed branches.
- The MCP service can emit large payloads. Increase n8n`s `N8N_PAYLOAD_SIZE_MAX` if files exceed 16 MB.
- Store secrets (OpenAI, GitHub) in n8n credentials or Docker secrets—never hard-code inside Function nodes.

