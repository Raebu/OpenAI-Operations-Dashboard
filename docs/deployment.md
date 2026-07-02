# Deployment

## Vercel

1. Create a managed PostgreSQL database.
2. Set environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `INGEST_API_KEYS`
   - `APP_URL`
3. Deploy the repository.
4. Run `npx prisma migrate deploy` or `npx prisma db push` during release.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Production hardening

- Replace `dev_ingest_key`.
- Use a secret manager.
- Put the app behind SSO or VPN until RBAC/SSO is configured.
- Enable database backups.
- Configure retention and redaction rules.
- Add external logging and alerting.
- Add rate limiting at the edge or gateway.

## Suggested managed services

- Database: Supabase, Neon, AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL.
- Hosting: Vercel, Fly.io, Render, Railway, ECS, Cloud Run, Azure Container Apps.
- SIEM/logging: Datadog, Grafana Cloud, Elastic, Splunk, CloudWatch.
