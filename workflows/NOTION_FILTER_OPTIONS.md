# Notion Filter Options for "Check if Tool Exists"

Your Notion database appears to have:
1. **Page Title** (default "Name" property) = tool_name
2. **Domain** property (Text field) = tool_name

The workflow can check for existing tools using either property.

---

## Option 1: Filter by Page Title (RECOMMENDED)
**Currently configured in the updated workflow**

```json
{
  "key": "Name",
  "condition": "equals",
  "titleValue": "={{ $json.tool_name }}",
  "returnAll": false,
  "limit": 1
}
```

**Pros:**
- Every Notion database has a title property
- Fastest query
- Most reliable

**Use this if:** Your database uses the page title to store the tool name (which it does based on the "Create New Tool" configuration)

---

## Option 2: Filter by Domain Property
**The original approach (now with corrected syntax)**

```json
{
  "key": "Domain",
  "condition": "equals",
  "richTextValue": "={{ $json.tool_name }}",
  "returnAll": false,
  "limit": 1
}
```

**Use this if:**
- Filtering by page title doesn't work
- Your database uses a separate "Domain" property for lookups
- You want to match on a field other than the title

---

## How to Change the Filter in n8n

1. Open your workflow in n8n
2. Click on the "Check if Tool Exists" node
3. Scroll to the **Filters** section
4. Under **Conditions**, you'll see the filter configuration
5. Change the property name and value type as needed:

**For Page Title:**
- Property: `Name`
- Condition: `equals`
- Title Value: `{{ $json.tool_name }}`

**For Domain Property:**
- Property: `Domain`
- Condition: `equals`  
- Rich Text Value: `{{ $json.tool_name }}`

---

## If Neither Works

The issue might be:

### 1. Database Connection
- Check if the Notion credential is working
- Try clicking "Test Step" on the node
- Look for authentication errors

### 2. Property Name is Different
Open your Notion database and check the exact property names. They might be:
- "Tool Name"
- "Tool"
- "Company"
- Or something else

### 3. Empty tool_name
Add a debug node before "Check if Tool Exists":

```javascript
console.log('tool_name:', $json.tool_name);
console.log('Full data:', JSON.stringify($json, null, 2));
return [{ json: $json }];
```

---

## Current Workflow Configuration

The updated workflow now uses **Option 1** (Page Title filter) because:
1. It's the most reliable approach
2. The "Create New Tool" node sets the page title to `tool_name`
3. Title properties are indexed better in Notion for fast lookups

If you see that tools are being created but the lookup still fails, switch to **Option 2** (Domain property filter).

---

## Still Not Working?

If the workflow still stops at this node:

1. **Check the execution log** - Is there an error message?
2. **Verify credential** - Is the Notion integration authorized?
3. **Test manually** - Can you query the database in Notion directly?
4. **Check database ID** - Is `2c95784d-e310-80e8-b1de-fa4b054b0175` correct?
5. **Try without filter** - Temporarily remove the filter to see if the node executes at all

Let me know what you see and I can provide more specific fixes!

