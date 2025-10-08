# n8n-hosting

## OpenAI Whisper transcription via HTTP Request node

This project is often deployed with workflows that call OpenAI Whisper using the **HTTP Request** node. The error below indicates that the `file` field was missing from the multipart form body sent to OpenAI:

```
Bad request - please check your parameters
[{'type': 'missing', 'loc': ('body', 'file'), 'msg': 'Field required', 'input': None}]
```

To resolve this, configure the HTTP Request node exactly as follows.

### 1. Node parameters

| Setting | Value |
| --- | --- |
| HTTP Method | `POST` |
| URL | `https://api.openai.com/v1/audio/transcriptions` |
| Authentication | `Header Auth` (Bearer token) |
| Send Binary Data | `true` |
| Binary Property | `data` (or the property name from the upstream node) |
| Body Content Type | `Form-Data` |

Add the following form-data fields:

| Name | Type | Value |
| --- | --- | --- |
| `file` | File | `={{$binary.data}}` (choose the binary property from the dropdown) |
| `model` | Text | `whisper-1` |

> ⚠️ The `file` field must reference the binary property provided by the upstream **Download File** (or equivalent) node. If the property is named differently, update the **Binary Property** input to match.

### 2. Required headers

```
Authorization: Bearer {{$env.OPENAI_API_KEY}}
```

> When **Send Binary Data** is enabled, n8n generates the multipart boundary automatically. Leave `Content-Type` unset so n8n can add the correct multipart boundary.

### 3. Example node JSON

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.openai.com/v1/audio/transcriptions",
    "authentication": "predefinedCredentialType",
    "sendBinaryData": true,
    "binaryProperty": "data",
    "contentType": "multipart-form-data",
    "options": {},
    "formData": [
      {
        "name": "file",
        "type": "file",
        "value": "={{$binary.data}}"
      },
      {
        "name": "model",
        "type": "text",
        "value": "whisper-1"
      }
    ]
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [0, 0],
  "credentials": {
    "httpHeaderAuth": {
      "id": "OPENAI_HEADER_AUTH"
    }
  }
}
```

This configuration ensures the `file` field is transmitted and removes the `Field required` error returned by OpenAI.
