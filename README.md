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
| `file` | Binary Data | `data` (select the binary property from the picker) |
| `model` | Text | `whisper-1` |

> ⚠️ The `file` field must reference the binary property provided by the upstream **Download File** (or equivalent) node. If the property is named differently, update the **Binary Property** input to match. Selecting **Binary Data** avoids the "Field required" validation because n8n now uploads the binary stream instead of the string literal `={{$binary.data}}`.

> ✅ Upstream node requirement: the node that supplies the audio must emit binary data. For example, set **Response Format** to `File` on an HTTP download or use **Read Binary File** when sourcing from disk.

### 2. Required headers

```
Authorization: Bearer {{$env.OPENAI_API_KEY}}
```

> When **Send Binary Data** is enabled, n8n generates the multipart boundary automatically. Leave `Content-Type` unset so n8n can add the correct multipart boundary.

Configure this header via an **HTTP Header Auth** credential:

1. Go to *Credentials → HTTP Header Auth* and create a credential named `OPENAI_HEADER_AUTH`.
2. Set **Header Name** to `Authorization`.
3. Set **Header Value** to `Bearer <OPENAI_API_KEY>`.
4. Attach the credential to the Whisper HTTP Request node.

### 3. Example node JSON

```json
{
  "name": "Transcribe audio",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [520, 280],
  "parameters": {
    "method": "POST",
    "url": "https://api.openai.com/v1/audio/transcriptions",
    "authentication": "predefinedCredentialType",
    "sendBinaryData": true,
    "binaryProperty": "data",
    "contentType": "multipart-form-data",
    "formData": [
      {
        "name": "file",
        "type": "binaryData",
        "binaryPropertyName": "data"
      },
      {
        "name": "model",
        "type": "text",
        "value": "whisper-1"
      }
    ]
  },
  "credentials": {
    "httpHeaderAuth": {
      "id": "OPENAI_HEADER_AUTH"
    }
  }
}
```

Pair the node with a binary-producing step. The snippet below downloads a sample MP3 with **HTTP Request** (binary output arrives on the default `data` property) and then calls Whisper:

```json
{
  "name": "Whisper demo",
  "nodes": [
    {
      "id": "download",
      "name": "Download audio",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [300, 280],
      "parameters": {
        "method": "GET",
        "url": "https://file-examples.com/storage/fe9ac23e0c930fa532bc12f/2017/11/file_example_MP3_1MG.mp3",
        "responseFormat": "file",
        "options": {
          "fullResponse": false
        }
      },
      "continueOnFail": false
    },
    {
      "id": "whisper",
      "name": "Transcribe audio",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [520, 280],
      "parameters": {
        "method": "POST",
        "url": "https://api.openai.com/v1/audio/transcriptions",
        "authentication": "predefinedCredentialType",
        "sendBinaryData": true,
        "binaryProperty": "data",
        "contentType": "multipart-form-data",
        "formData": [
          {
            "name": "file",
            "type": "binaryData",
            "binaryPropertyName": "data"
          },
          {
            "name": "model",
            "type": "text",
            "value": "whisper-1"
          }
        ]
      },
      "credentials": {
        "httpHeaderAuth": {
          "id": "OPENAI_HEADER_AUTH"
        }
      }
    }
  ],
  "connections": {
    "Download audio": {
      "main": [
        [
          {
            "node": "Transcribe audio",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

Import the workflow JSON above into n8n to validate your configuration. Replace the demo download URL with your own audio source. In the `OPENAI_HEADER_AUTH` credential, set **Name** to `Authorization` and **Value** to `Bearer <OPENAI_API_KEY>`.
