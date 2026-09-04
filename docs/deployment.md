# Deployment

## Required production services

1. Managed PostgreSQL with backups and point-in-time recovery.
2. An identity-aware reverse proxy or SSO gateway that authenticates users before requests reach the dashboard.
3. A shared/distributed rate limiter implementation or gateway-level rate limit for multi-instance deployments.
4. A secret manager for database, ingest-key and auth-gateway secrets.

## Required environment variables

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `INGEST_API_KEYS`
- `APP_URL`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_PROXY_SHARED_SECRET`

Optional privacy control:

- `TELEMETRY_PREVIEWS_ENABLED=true` enables redacted prompt/response previews. Leave unset to discard previews entirely.

Development/tests may set `ALLOW_IN_MEMORY_RATE_LIMIT=true`; never set it in multi-instance production.

## SSO gateway contract

The production middleware fails closed unless the trusted upstream identity gateway supplies all of:

- `x-auth-proxy-secret`: exact shared secret matching `AUTH_PROXY_SHARED_SECRET`.
- `x-auth-subject`: stable authenticated user identifier.
- `x-auth-organisation`: tenant/organisation identifier.
- `x-auth-role`: one of `viewer`, `analyst`, `reviewer`, `admin`.

The shared-secret header is stripped before forwarding. Configure the public edge so clients cannot bypass the identity gateway or inject trusted headers.

## Release procedure

```bash
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm run test
npm run build
docker build -t openai-operations-dashboard:release .
npx prisma migrate deploy
```

Then verify `/api/health`, an authenticated dashboard request, an unauthenticated 401, API-key ingestion, rate-limit failure behaviour and database persistence.

## Production hardening

- Replace every development ingest key and rotate it through the secret manager.
- Keep telemetry previews disabled unless there is an approved business need; when enabled, built-in redaction remains active.
- Enable database backups and exercise restore/rollback before broad rollout.
- Export platform logs/audit records to the organisation's immutable or access-controlled logging/SIEM destination.
- Define organisation-specific retention periods for telemetry, review and audit records.
- Enable GitHub Dependency Graph/Dependency Review for this repository.
- Run an independent security/privacy review before broad enterprise deployment.
