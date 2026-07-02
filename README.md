# OpenAI Operations Dashboard

[![CI](https://github.com/Raebu/OpenAI-Operations-Dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/Raebu/OpenAI-Operations-Dashboard/actions/workflows/ci.yml) [![CodeQL](https://github.com/Raebu/OpenAI-Operations-Dashboard/actions/workflows/codeql.yml/badge.svg)](https://github.com/Raebu/OpenAI-Operations-Dashboard/actions/workflows/codeql.yml) [![Licence](https://img.shields.io/badge/licence-Apache--2.0-blue.svg)](./LICENSE)

## One-line positioning statement

Enterprise AI governance and observability for organisations using OpenAI-compatible models.

## Short product description

OpenAI Operations Dashboard gives engineering, risk, finance, legal, security, and AI governance teams a single operational view of prompts, token spend, model usage, hallucination risk, latency, safety events, human review queues, and audit logs.

It is designed as an open-source, commercially credible module for companies that need to operate AI systems safely, transparently, and cost-effectively.

## Part of the RaeburnAI Platform

This project is part of the **RaeburnAI Platform**: a modular enterprise AI ecosystem for governance, knowledge, automation, executive decision support, and operational control.

The platform is designed around clear separation of concerns:

- Governance modules define policy, risk, compliance, review, and audit controls.
- Knowledge modules organise business, regulatory, and operational intelligence.
- Automation modules execute workflows with approval gates and audit trails.
- Executive modules turn operational data into board-level insight.
- Integration modules connect AI systems to repositories, tools, data sources, and business systems.

### Ecosystem map

| Module | Purpose |
| --- | --- |
| [RaeburnAI Compliance Engine](https://github.com/Raebu/RaeburnAI-Compliance-Engine) | AI governance, regulatory mapping, GDPR, ISO 42001, ISO 27001, and EU AI Act controls. |
| [Universal AI Knowledge Graph](https://github.com/Raebu/Universal-AI-Knowledge-Graph) | Shared knowledge layer for enterprise context, entities, relationships, and retrieval. |
| [RaeburnAI Business Twin](https://github.com/Raebu/RaeburnAI-Business-Twin) | Operational business simulation, decision intelligence, and scenario modelling. |
| [RaeburnAI Executive Briefing](https://github.com/Raebu/RaeburnAI-Executive-Briefing) | Board-ready summaries, strategic updates, and executive intelligence. |
| [RaeburnAI Proposal Generator](https://github.com/Raebu/RaeburnAI-Proposal-Generator) | Consultant proposal generation, roadmaps, pricing, timelines, and ROI modelling. |
| [OpenAI Operations Dashboard](https://github.com/Raebu/OpenAI-Operations-Dashboard) | AI operations observability, token spend, model usage, safety, latency, and audit logs. |
| [RaeburnAI-Chain](https://github.com/Raebu/RaeburnAI-Chain) | LangChain-style orchestration across RaeburnAI modules and business workflows. |

## Core features

- Prompt observability for AI apps, agents, workflows, and OpenAI-compatible telemetry.
- Token spend tracking by model, application, organisation, and time window.
- Model usage analytics across production AI systems.
- Latency monitoring with p50, p95, and p99 dashboard metrics.
- Hallucination-risk tracking using grounding, citation coverage, evaluator scores, and review outcomes.
- Safety governance for blocked requests, moderation flags, sensitive-data categories, and jailbreak attempts.
- Human review queue for risky or policy-sensitive AI events.
- Audit logs for ingestion and governance activity.
- PostgreSQL persistence with Prisma schema and demo seed data.
- CI, CodeQL, dependency review, Docker, Docker Compose, and deployment documentation.

## Architecture

```text
AI apps / agents / gateways
        │
        ▼
/api/v1/events ingestion API
        │
        ▼
Validation + pricing + risk routing
        │
        ▼
PostgreSQL via Prisma
        │
        ├── dashboard metrics
        ├── human review queue
        ├── audit logs
        └── exports / SIEM integration roadmap
```

Repository layout:

```text
app/                    Next.js pages and API routes
components/             Dashboard UI components
lib/                    Auth, pricing, metrics, logging, database, validation
prisma/                 Database schema and seed data
docs/                   Architecture, API, deployment, security, and UI preview docs
tests/                  Unit, validation, rate-limit, and smoke-flow tests
.github/workflows/      CI, CodeQL, and dependency review workflows
```

## Quick start

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:push
npm run seed
npm run dev
```

Open `http://localhost:3000`.

Health check:

```bash
curl http://localhost:3000/api/health
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string used by Prisma. |
| `NEXTAUTH_SECRET` | yes | Long random secret for auth/session support. |
| `INGEST_API_KEYS` | yes | Comma-separated ingest API keys. Use a secret manager in production. |
| `APP_URL` | recommended | Public app URL used by deployment and auth configuration. |
| `VERCEL_ANALYTICS_ID` | optional | Optional analytics integration. |

Never commit real API keys, real prompt logs, customer data, or production telemetry.

## Usage examples

Ingest an AI event:

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

Run local checks:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
docker build -t openai-operations-dashboard:local .
```

## Security model

Current controls:

- API-key protected ingestion endpoint.
- Zod input validation for telemetry payloads.
- Human review creation for high-risk events.
- Audit log records for ingestion activity.
- Security headers in Next.js config.
- Docker container runs as a non-root user.
- CodeQL and dependency review workflows.
- Health check endpoint for runtime monitoring.

Production requirements before enterprise rollout:

- Add real SSO/RBAC and least-privilege role enforcement.
- Replace in-memory rate limiting with Redis, WAF, or API gateway enforcement.
- Store ingest keys in a secret manager and rotate them regularly.
- Configure prompt and response preview redaction or disable previews.
- Export audit logs to SIEM or immutable object storage.
- Define retention rules for telemetry and review records.

## Production readiness

This repository is significantly hardened but should not be described as fully enterprise production-ready until the remaining blockers below are completed.

Implemented:

- Next.js dashboard UI.
- PostgreSQL persistence.
- Ingestion API.
- Demo data.
- Health endpoint.
- Dockerfile and Compose setup.
- CI, CodeQL, dependency review.
- Unit, validation, rate-limit, and smoke-flow tests.
- Security, contributing, deployment, architecture, API, changelog, and roadmap docs.

Known TODOs:

- Pin every dependency exactly in `package.json`. A full package rewrite was blocked by connector safety checks; complete locally or retry as a smaller manual patch.
- Add production SSO/RBAC before exposing to multiple teams.
- Add Redis-backed or gateway-backed rate limiting for multi-instance deployments.
- Add a true browser E2E test with Playwright once CI can run a stable local server or preview deployment.
- Verify all commands in a real local or CI runtime after dependency installation.

## Roadmap

- Persistent API-key management and rotation UI.
- Full SSO/RBAC with organisation roles.
- Configurable risk thresholds and review policies.
- Node.js and Python ingestion SDK examples.
- SIEM, warehouse, and object-storage export adapters.
- Signed audit log snapshots.
- Tenant-level retention and redaction controls.
- Policy-pack integration with RaeburnAI Compliance Engine.

See [ROADMAP.md](./ROADMAP.md).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

Security-sensitive changes should include a short risk note covering API keys, prompt storage, audit logs, review workflows, tenant isolation, and deployment secrets.

## Licence

Apache-2.0. See [LICENSE](./LICENSE).
