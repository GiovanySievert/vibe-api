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

This project is indexed by GitNexus as **vibe-api** (1012 symbols, 2614 relationships, 56 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## When Debugging

1. `gitnexus_query({query: "<error or symptom>"})` — find execution flows related to the issue
2. `gitnexus_context({name: "<suspect function>"})` — see all callers, callees, and process participation
3. `READ gitnexus://repo/vibe-api/process/{processName}` — trace the full execution flow step by step
4. For regressions: `gitnexus_detect_changes({scope: "compare", base_ref: "main"})` — see what your branch changed

## When Refactoring

- **Renaming**: MUST use `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` first. Review the preview — graph edits are safe, text_search edits need manual review. Then run with `dry_run: false`.
- **Extracting/Splitting**: MUST run `gitnexus_context({name: "target"})` to see all incoming/outgoing refs, then `gitnexus_impact({target: "target", direction: "upstream"})` to find all external callers before moving code.
- After any refactor: run `gitnexus_detect_changes({scope: "all"})` to verify only expected files changed.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Tools Quick Reference

| Tool | When to use | Command |
|------|-------------|---------|
| `query` | Find code by concept | `gitnexus_query({query: "auth validation"})` |
| `context` | 360-degree view of one symbol | `gitnexus_context({name: "validateUser"})` |
| `impact` | Blast radius before editing | `gitnexus_impact({target: "X", direction: "upstream"})` |
| `detect_changes` | Pre-commit scope check | `gitnexus_detect_changes({scope: "staged"})` |
| `rename` | Safe multi-file rename | `gitnexus_rename({symbol_name: "old", new_name: "new", dry_run: true})` |
| `cypher` | Custom graph queries | `gitnexus_cypher({query: "MATCH ..."})` |

## Impact Risk Levels

| Depth | Meaning | Action |
|-------|---------|--------|
| d=1 | WILL BREAK — direct callers/importers | MUST update these |
| d=2 | LIKELY AFFECTED — indirect deps | Should test |
| d=3 | MAY NEED TESTING — transitive | Test if critical path |

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/vibe-api/context` | Codebase overview, check index freshness |
| `gitnexus://repo/vibe-api/clusters` | All functional areas |
| `gitnexus://repo/vibe-api/processes` | All execution flows |
| `gitnexus://repo/vibe-api/process/{name}` | Step-by-step execution trace |

## Self-Check Before Finishing

Before completing any code modification task, verify:
1. `gitnexus_impact` was run for all modified symbols
2. No HIGH/CRITICAL risk warnings were ignored
3. `gitnexus_detect_changes()` confirms changes match expected scope
4. All d=1 (WILL BREAK) dependents were updated

## Keeping the Index Fresh

After committing code changes, the GitNexus index becomes stale. Re-run analyze to update it:

```bash
npx gitnexus analyze
```

If the index previously included embeddings, preserve them by adding `--embeddings`:

```bash
npx gitnexus analyze --embeddings
```

To check whether embeddings exist, inspect `.gitnexus/meta.json` — the `stats.embeddings` field shows the count (0 means no embeddings). **Running analyze without `--embeddings` will delete any previously generated embeddings.**

> Claude Code users: A PostToolUse hook handles this automatically after `git commit` and `git merge`.

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
