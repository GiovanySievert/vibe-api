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
