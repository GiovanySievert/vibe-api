# Vibe API

REST API built with Elysia, Bun, Drizzle ORM and PostgreSQL.

## Prerequisites

- [Bun](https://bun.sh) v1.2.21+
- [Docker](https://www.docker.com/) and Docker Compose

## How to Run

1. **Clone and install:**
```bash
git clone <repository-url>
cd vibe-api
bun install
```

2. **Set up environment:**
```bash
cp .env.example .env
```

Edit `.env` and add your `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`)

3. **Start with Docker:**
```bash
bun run docker:dev
```

The API will be available at `http://localhost:3000`

**Swagger documentation:** `http://localhost:3000/swagger`

## Useful Commands

```bash
bun run docker:dev
bun run docker:dev:logs
bun run docker:dev:down
bun run dev
bun run db:generate
bun run db:migrate
```

## Ports

- **API:** 3000
- **PostgreSQL:** 5423
- **RabbitMQ:** 5672 (AMQP), 15672 (Management UI)

## CI/CD

The repository now ships with GitHub Actions workflows in `.github/workflows/`:

- `ci.yml`: installs dependencies, runs `bun test`, and validates the Docker build.
- `deploy.yml`: on `main`, builds an ARM64 image, pushes it to GHCR, and deploys it to Oracle via SSH.

Configure these GitHub Actions secrets before enabling deploy:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`

Optional repository variables used by deploy:

- `DEPLOY_PATH` default `/opt/vibes`
- `DEPLOY_COMPOSE_FILE` default `/opt/vibes/infra/compose/docker-compose.prod.yml`
- `DEPLOY_MIGRATION_COMMAND` default `docker compose -f "$COMPOSE_FILE" run --rm vibe-api bun db:migrate`
- `HEALTHCHECK_URL` optional smoke-test URL
