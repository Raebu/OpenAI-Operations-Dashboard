# Security and Governance

## Security principles

- Treat prompt and response previews as potentially sensitive.
- Store API keys only in secret managers.
- Rotate ingest keys regularly.
- Use TLS everywhere.
- Apply least-privilege database and deployment credentials.
- Restrict admin access through SSO, MFA, and RBAC.
- Keep audit logs append-only at the application layer.

## Data protection

The default schema stores short prompt and response previews. For stricter environments, disable previews or store redacted summaries only.

Recommended controls:

- PII redaction before ingestion.
- Configurable retention periods.
- Tenant-level encryption keys.
- Audit export to a SIEM or object store.
- Legal hold support for regulated investigations.

## Operational controls

- Enable database backups and point-in-time recovery.
- Set up alerting for safety spike, spend spike, latency spike, and ingestion failure.
- Review model pricing regularly.
- Validate all new telemetry sources before production ingestion.

## Threat model highlights

| Risk | Control |
| --- | --- |
| Stolen ingest key | Rotation, hashing, rate limiting, IP allow lists |
| Sensitive prompt leakage | Redaction, previews off, field-level encryption |
| Tampered audit log | Append-only writes, external SIEM export, signed snapshots |
| Cost runaway | Budgets, alerts, model usage caps |
| Unsafe model use | policy flags, review queue, escalation workflow |
