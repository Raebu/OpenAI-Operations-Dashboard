# Roadmap

## Now

- Stabilise core dashboard build, tests, Docker image, and documentation.
- Maintain a clean open-source baseline suitable for evaluation and contribution.
- Keep the product focused on enterprise AI governance and OpenAI operations visibility.

## Next

- Add persistent API-key management UI and hashed key rotation workflow.
- Add full SSO/RBAC with organisation roles and least-privilege permissions.
- Add configurable review rules for safety, hallucination, latency, cost, and data-protection thresholds.
- Add ingestion SDK examples for Node.js and Python.
- Add export pipelines for SIEM, object storage, and BI tools.
- Add Playwright browser-level E2E tests once a stable deployed preview exists.

## Later

- Add ClickHouse, BigQuery, or warehouse integration for very high-volume analytics.
- Add signed audit log snapshots.
- Add tenant-level retention and redaction controls.
- Add policy-pack templates for GDPR, EU AI Act, ISO 42001, ISO 27001, and internal AI governance controls.
- Add model-provider adapters beyond OpenAI-compatible telemetry.

## Known hardening TODOs

- Pin every dependency exactly in `package.json`. An attempted full rewrite was blocked by GitHub connector safety checks, so this should be completed locally with a focused manual edit or retried later.
- Add real production SSO/RBAC before exposing the dashboard to multiple enterprise teams.
- Replace in-memory rate limiting with Redis or an edge gateway for multi-instance production deployments.
- Add a true browser E2E test with Playwright once the app has a deployed preview URL or stable local runtime in CI.
