# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0 - 2026-07-02

### Added

- Production-oriented OpenAI operations dashboard scaffold.
- AI event ingestion API with Zod validation.
- PostgreSQL persistence with Prisma schema and demo seed data.
- Token spend, model usage, latency, hallucination risk, safety, review queue, and audit log dashboard.
- Dockerfile and Docker Compose stack.
- CI, CodeQL, and dependency review workflows.
- Unit, validation, rate-limit, and smoke-flow tests.
- Security, deployment, architecture, API, contributing, and roadmap documentation.

### Known limitations

- Full enterprise SSO/RBAC is documented as a roadmap item.
- Long-term analytics warehouse integration is not yet implemented.
- Connector safety checks blocked some attempted package and route rewrites; see TODO notes in README and ROADMAP.
