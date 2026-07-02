# Contributing

Thank you for contributing to OpenAI Operations Dashboard.

## Development workflow

1. Fork or branch from `main`.
2. Copy `.env.example` to `.env`.
3. Install dependencies with `npm install`.
4. Start Postgres with `docker compose up -d postgres`.
5. Run `npm run db:push` and `npm run seed`.
6. Make focused changes with tests.
7. Run the full local check set before opening a pull request.

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
docker build -t openai-operations-dashboard:local .
```

## Pull request expectations

- Keep product direction aligned with enterprise AI governance and observability.
- Do not commit secrets, API keys, prompt logs containing sensitive data, or real customer telemetry.
- Add or update tests for meaningful behaviour changes.
- Update README or docs when changing setup, deployment, security, or API behaviour.
- Prefer small, reviewable pull requests.

## Security-sensitive changes

Changes touching authentication, API-key handling, audit logging, retention, prompt storage, review routing, or model-risk scoring should include a short risk note in the pull request description.
