# Architecture

## Overview

OpenAI Operations Dashboard is designed as a multi-tenant governance and observability platform for AI operations.

```text
AI apps / agents / gateways
        │
        ▼
/api/v1/events ingestion endpoint
        │
        ▼
Validation + pricing + review routing
        │
        ▼
PostgreSQL via Prisma
        │
        ├── dashboard metrics
        ├── human review queue
        ├── audit logs
        └── exports / SIEM forwarding
```

## Data model

- `Organisation`: tenant boundary.
- `Application`: AI product, internal app, agent, or workflow source.
- `AiEvent`: telemetry record for a single prompt/model execution.
- `HumanReview`: review workflow record for risky events.
- `AuditLog`: governance trail for ingestion, review, admin, and configuration changes.
- `ApiKey`: future persistent key registry. The current version supports env-configured ingest keys.

## Event ingestion

AI apps send telemetry to `/api/v1/events` using an `x-api-key` header. The API validates payloads with Zod, estimates token cost, persists the event, creates a review item if the event is risky, and writes an audit log.

## Risk model

The platform supports multiple risk signals:

- `safety.flagged`
- `safety.categories`
- `quality.hallucinationRisk`
- `quality.groundedness`
- `quality.citationCoverage`
- blocked/error/timeout status

The default review-routing rule creates a human review item when a safety flag exists, hallucination risk is `>= 0.6`, or the event is blocked.

## Deployment model

The app can run on Vercel, container platforms, Kubernetes, Fly.io, Render, Railway, AWS ECS, Azure Container Apps, or Google Cloud Run. Use managed PostgreSQL for production.

## Scaling

Recommended next production scaling additions:

- Queue ingestion through Kafka, SQS, Pub/Sub, or Redis Streams for high-throughput environments.
- Partition `AiEvent` by month for large enterprise tenants.
- Add ClickHouse or BigQuery for long-term analytics.
- Add SSO and SCIM for enterprise identity.
- Add signed immutable audit exports for regulated clients.
