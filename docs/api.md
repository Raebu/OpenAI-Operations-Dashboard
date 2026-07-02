# API

## POST `/api/v1/events`

Ingest a single AI operation event.

### Headers

| Header | Required | Description |
| --- | --- | --- |
| `content-type: application/json` | yes | JSON payload |
| `x-api-key` | yes | Ingest API key configured in `INGEST_API_KEYS` |

### Payload

```json
{
  "organisationId": "org_demo",
  "application": "customer-support-copilot",
  "environment": "production",
  "provider": "openai",
  "model": "gpt-4.1",
  "promptName": "refund-policy-answer",
  "promptVersion": "1.3.0",
  "userId": "user_123",
  "requestId": "req_123",
  "inputTokens": 912,
  "outputTokens": 227,
  "cachedTokens": 128,
  "reasoningTokens": 0,
  "latencyMs": 1430,
  "status": "success",
  "safety": { "flagged": false, "categories": [] },
  "quality": {
    "hallucinationRisk": 0.08,
    "groundedness": 0.91,
    "citationCoverage": 0.84
  },
  "promptPreview": "Optional redacted prompt preview",
  "responsePreview": "Optional redacted response preview",
  "metadata": { "region": "eu-west-2" }
}
```

### Response

```json
{
  "id": "clx...",
  "estimatedCostUsd": 0.004321
}
```

### Status values

- `success`
- `error`
- `blocked`
- `timeout`
- `reviewed`

### Review routing

An event is automatically added to the human review queue when:

- `safety.flagged` is true
- `quality.hallucinationRisk >= 0.6`
- `status` is `blocked`
