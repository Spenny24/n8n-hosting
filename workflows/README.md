# AI Operations Assistant Workflows

This directory contains the n8n workflows used to recreate the "AI Employee" automation shown in the reference screenshots.

## Files

- `ai-operations-assistant.json` – master orchestrator that runs daily, plans tasks with OpenAI, dispatches to MCP toolkits, and composes the daily executive update.
- `google-calendar-mcp-tools.json` – Google Calendar actions (create/update/delete events, availability lookup).
- `google-drive-mcp-tools.json` – Google Drive automation (upload files, create folders, manage permissions, mirror templates).
- `google-mail-mcp-tools.json` – Gmail tooling (summaries, replies, drafts, label management).
- `linkedin-mcp-tools.json` – LinkedIn utilities powered by Apify or custom webhooks (inbox scrape, DM send, post publishing, profile sync).
- `twitter-mcp-tools.json` – Twitter/X toolkit (post, DM, search mentions, refresh metrics).
- `utility-mcp-tools.json` – General purpose helpers (OpenAI summarization, Clearbit enrichment, Airtable sync, Slack notifications).

## Usage

1. Import the six MCP tool workflows first so that their names are available to the main orchestrator.
2. Import `ai-operations-assistant.json` and update the credential references (OpenAI, Google, Slack, Clearbit, Airtable, Apify, LinkedIn automation).
3. Set environment variables used in expressions:
   - `AI_EMPLOYEE_REPORT_RECIPIENT`
   - `GCAL_PRIMARY`
   - `GDRIVE_DEALS_FOLDER`
   - `APIFY_LINKEDIN_INBOX_TASK`
   - `APIFY_TOKEN`
   - `LINKEDIN_AUTOMATION_URL`
   - `LINKEDIN_AUTOMATION_TOKEN`
   - `TWITTER_HANDLE`
   - `AIRTABLE_APP_ID`
   - `AIRTABLE_PIPELINE_TABLE`
   - `SLACK_ALERT_CHANNEL`
4. Enable the workflows and test the daily execution via the `Daily Kickoff` node.

Each workflow uses workflow static data to persist context (persona, objectives, reporting recipient, task map, results) so parallel executions remain isolated.
