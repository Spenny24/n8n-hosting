# n8n-hosting

## ConeyTech Market Tracker workflow

Import `workflows/coneytech-market-tracker.json` into n8n to automate monthly research for UK mortgage tooling across BrokerTech, EA Tech, ConveyTech, LenderTech, and global ConeyTech. The workflow runs monthly, searches fresh news per category, extracts structured tool updates with OpenAI, de-dupes, and writes rows into a Notion database.

### Required environment variables
Set these in your n8n deployment (e.g., `.env`, Docker env, or credential expressions):

- `SERPER_API_KEY` – Serper.dev key for Google search.
- `OPENAI_API_KEY` – OpenAI API key (tested with `gpt-4o-mini`).
- `NOTION_DB_ID` – Target Notion database ID for the tracker table.

### Node overview
- **Monthly Trigger** – Fires on the 1st of each month at 08:00 Europe/London.
- **Set Config → Prepare Queries** – Defines categories/regions and builds search queries for the last month.
- **Serper Search** – Calls Serper.dev per category to fetch organic Google results.
- **Extract Organic Results → OpenAI Extract** – Feeds recent links into OpenAI to return JSON `{ tools: [{ name, category, region, summary, source_url, published_at }] }` per category.
- **Deduplicate Tools** – Removes duplicate tool names across categories.
- **Notion Upsert** – Creates database rows with Name, Category, Region, Summary, Source, Published, and Query fields.

### Notion schema expectations
Create a database with properties named exactly:
- `Name` (Title)
- `Category` (Select)
- `Region` (Select)
- `Summary` (Rich text)
- `Source` (URL)
- `Published` (Date)
- `Query` (Rich text)

### Optional value-adds
- Add a **Filter** node before Notion to drop items without `source_url` or `summary`.
- Attach a **Slack/Teams/Email** node after Notion to push a monthly digest of newly added tools.
- Swap Notion for a **Miro** or **Airtable** node if you prefer a different live table; only the final node changes.
- Use an **Airtable/PG dedupe** step keyed by `name + category` if you need cross-month suppression beyond the in-memory deduper.
- Add a **Webhook** trigger to run ad-hoc refreshes alongside the monthly schedule.
