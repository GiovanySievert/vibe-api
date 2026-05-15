# vibe-api

Main vibes API — Elysia + Bun + TypeScript.

## Stack

- **Runtime**: Bun.
- **HTTP**: Elysia 1.4 (native OpenAPI/Swagger).
- **Validation**: inline Zod in routes.
- **DB**: PostgreSQL + Drizzle ORM (Drizzle Kit for migrations).
- **Auth**: `better-auth` (existing middleware — do not reinvent).
- **Messaging**: RabbitMQ.
- **Logging**: Winston + Loki.
- **Tests**: native `bun test`, no external deps.

## Modular structure (DDD)

```
src/modules/<feature>/
├── domain/                       # entities, value objects, repo interfaces
├── application/
│   └── use-cases/                # 1-per-action classes (e.g. CreateFollower)
├── infrastructure/
│   ├── http/
│   │   ├── controllers/          # orchestrate use-cases, map req/res
│   │   └── routes/               # Elysia routes (group, Zod, tags, security)
│   └── persistence/              # DrizzleXRepository implements the domain interface
├── <feature>.module.ts           # wiring: instantiate repos → services → controllers
└── __tests__/                    # bun test
```

**Full reference**: [`src/modules/follow/`](src/modules/follow/) (follows the pattern 100%).

## Patterns

- **Wiring**: `<feature>.module.ts` is the ONLY place where concrete repositories are instantiated and injected into use-cases.
- **Use cases**: 1 class per action, receives deps via constructor, exposes `execute()` or a named method.
- **Elysia routes**: `group()`, inline Zod schema, `tags` for OpenAPI, `security` when auth is required (better-auth middleware).
- **Controllers**: do NOT call Drizzle directly — always via a use-case.
- **Repositories**: interface in `domain/`, `Drizzle*Repository` implementation in `infrastructure/persistence/`.
- **Events**: use `applicationEventBus` (`@src/shared/application/events`) — do not invent emitters.
- **Naming**: avoid generic collection names like `rows`, `items`, `item`, and `data` when the domain is known; prefer names that describe the business object, such as `badgeRecords`, `profileBadgeSelections`, or `badgeSummaries`.
- **Migrations**: `bun db:generate` → `bun db:migrate`. NEVER hand-edit generated SQL. Always run the migration reviewer before merging.
- **Tests**: `__tests__/` folder next to the module. For routes, use `app.handle(new Request(...))` (don't spin up a real server). DB with transaction/rollback or repo mock.

## Useful scripts

```bash
bun dev                    # watch
bun test                   # tests
bun test:watch
bun test:coverage
bun db:generate            # Drizzle: generate migration from schema
bun db:migrate             # apply migrations
bun db:seed
docker:dev / docker:up
```

## Before committing

1. `bun test` green.
2. If you touched a Drizzle schema: `bun db:generate` + review the migration.
3. If you added a route: confirm OpenAPI/Swagger renders the correct `tag`.

---

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **vibe-api** (2902 symbols, 6576 relationships, 192 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/vibe-api/context` | Codebase overview, check index freshness |
| `gitnexus://repo/vibe-api/clusters` | All functional areas |
| `gitnexus://repo/vibe-api/processes` | All execution flows |
| `gitnexus://repo/vibe-api/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
