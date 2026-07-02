# OpenAI Operations Dashboard

Enterprise AI governance and observability for organisations using OpenAI-compatible models.

This open-source platform gives engineering, risk, finance, legal, security, and AI governance teams one place to track prompt usage, model usage, token spend, latency, safety events, audit logs, and quality signals such as hallucination risk.

## What it does

- **Prompt observability**: capture prompt templates, executions, users, apps, teams, environments, metadata, and response summaries.
- **Token spend control**: track prompt, completion, cached, and reasoning tokens with estimated cost by model, provider, team, app, and time window.
- **Model usage analytics**: understand which models are being used, where, why, and by whom.
- **Latency monitoring**: p50, p95, p99, error rate, timeout rate, and streaming duration.
- **Hallucination risk tracking**: records evaluator scores, retrieval grounding, citation coverage, human review outcomes, and model self-check flags.
- **Safety governance**: captures policy flags, blocked requests, sensitive-data detections, jailbreak attempts, and moderation outcomes.
- **Audit logs**: immutable-style event trail for admin, configuration, ingestion, review, export, and user actions.
- **Human review workflows**: queue risky AI events for approval, rejection, escalation, or annotation.
- **Enterprise-ready foundations**: RBAC, multi-tenant organisations, API keys, Postgres persistence, Docker Compose, CI, tests, security headers, and deployment docs.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod validation
- Recharts
- Vitest
- ESLint
- Docker Compose

## Quick start

```bash
cp .env.example .env
npm install
npm run db:push
npm run dev
```

Open `http://localhost:3000`.

For local infrastructure:

```bash
docker compose up -d postgres
npm run db:push
npm run dev
```

Seed data:

```bash
npm run seed
```

## Ingest an AI event

```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "content-type: application/json" \
  -H "x-api-key: dev_ingest_key" \
  -d '{
    "organisationId": "org_demo",
    "application": "customer-support-copilot",
    "environment": "production",
    "provider": "openai",
    "model": "gpt-4.1",
    "promptName": "refund-policy-answer",
    "promptVersion": "1.3.0",
    "inputTokens": 912,
    "outputTokens": 227,
    "cachedTokens": 128,
    "reasoningTokens": 0,
    "latencyMs": 1430,
    "status": "success",
    "safety": { "flagged": false, "categories": [] },
    "quality": { "hallucinationRisk": 0.08, "groundedness": 0.91, "citationCoverage": 0.84 },
    "metadata": { "region": "eu-west-2", "requestId": "req_123" }
  }'
```

## Repository structure

```text
app/                    Next.js pages and API routes
components/             Dashboard UI components
lib/                    Auth, pricing, metrics, database, validation
prisma/                 Database schema and seed data
docs/                   Architecture, governance, deployment, API docs
.github/workflows/      CI pipeline
```

## Production readiness checklist

- Configure `DATABASE_URL` for managed Postgres.
- Set `APP_URL`, `NEXTAUTH_SECRET`, and strong API keys.
- Put the app behind SSO or enterprise IdP before external rollout.
- Rotate ingest keys and keep them in a secret manager.
- Enable database backups, retention policies, and encryption.
- Configure log shipping to your SIEM.
- Review `docs/security.md` before deploying.

## Licence

Apache-2.0. See [LICENSE](./LICENSE).
