# Persistence Layer

## Overview

Element and reaction data is stored in a **SQLite** database (`better-sqlite3`). The data-access layer is abstracted behind a repository interface in `src/lib/repository.ts`, so routes and services do not depend directly on the storage implementation.

## Why SQLite

| Approach         | Pros                                      | Cons                                      |
|------------------|-------------------------------------------|-------------------------------------------|
| JSON file        | No dependency                             | No concurrency, no constraints, ephemeral in serverless |
| SQLite           | ACID transactions, UNIQUE constraints, file-based, no credentials, `better-sqlite3` ships with prebuilt binaries | Not shared across serverless instances |
| Managed PostgreSQL | Shared across instances, scales       | Requires credentials, external service, ORM |

**Decision:** SQLite is the supported deployment target for traditional VPS / self-hosted hosting. The repository interface (`src/lib/repository.ts`) makes it straightforward to swap in a PostgreSQL implementation for serverless (e.g., Vercel) deployments without changing routes or services.

## Architecture

```
app/api/**/route.ts  →  src/lib/db.ts  →  src/lib/sqliteRepository.ts  →  src/lib/sqlite.ts  →  better-sqlite3
                                                  ↑
                                              src/lib/repository.ts  (interfaces)
```

- **`src/lib/repository.ts`** — Repository interfaces (`ElementRepository`, `ReactionRepository`) and pure utilities (`isDuplicatePair`, `normalizePair`). No runtime dependencies.
- **`src/lib/sqlite.ts`** — Singleton `Database` connection. Creates schema and auto-seeds on first open.
- **`src/lib/sqliteRepository.ts`** — SQLite implementations of the repository interfaces. Maps between SQLite rows (snake_case) and TypeScript types (camelCase).
- **`src/lib/migrate.ts`** — Schema SQL, `createSchema()`, `seedDatabase()`, `runMigration()`.
- **`src/lib/db.ts`** — Backward-compatible shim that re-exports repository methods.
- **`src/data/mockReactions.ts`** — Mock fixtures (kept separate from persistence).

## Schema

### elements table

| Column         | Type    | Constraints          |
|----------------|---------|----------------------|
| `id`           | TEXT    | PRIMARY KEY          |
| `name`         | TEXT    | NOT NULL             |
| `icon`         | TEXT    |                      |
| `description`  | TEXT    | NOT NULL             |
| `type`         | TEXT    | NOT NULL             |
| `ph`           | REAL    |                      |
| `safety_level` | INTEGER |                      |
| `image_url`    | TEXT    |                      |
| `created_at`   | TEXT    |                      |
| `updated_at`   | TEXT    |                      |

### reactions table

| Column            | Type    | Constraints                         |
|-------------------|---------|-------------------------------------|
| `element1_id`     | TEXT    | NOT NULL, FK → elements(id)         |
| `element2_id`     | TEXT    | NOT NULL, FK → elements(id)         |
| `result_title`    | TEXT    | NOT NULL                            |
| `observation`     | TEXT    | NOT NULL                            |
| `explanation`     | TEXT    | NOT NULL                            |
| `effect_type`     | TEXT    | NOT NULL                            |
| `review_status`   | TEXT    | NOT NULL                            |
| `safety_guidance` | TEXT    | NOT NULL                            |
| `assumptions`     | TEXT    | NOT NULL, JSON array                |
| `references`      | TEXT    | NOT NULL, JSON array                |
| `created_at`      | TEXT    |                                     |
| `updated_at`      | TEXT    |                                     |
| `normalized_pair` | TEXT    | GENERATED, PRIMARY KEY              |

The `normalized_pair` column is a generated column that normalizes the element pair order:
```sql
CASE WHEN element1_id < element2_id
  THEN element1_id || '|' || element2_id
  ELSE element2_id || '|' || element1_id
END
```

This enforces **unique normalized reaction pairs** — inserting `(A, B)` and `(B, A)` both produce the same `normalized_pair`, so the PRIMARY KEY constraint rejects duplicates regardless of argument order.

## Configuration

| Variable         | Default                  | Description                        |
|------------------|--------------------------|------------------------------------|
| `DATABASE_PATH`  | `.data/app.db`           | Path to the SQLite database file   |
| `DATA_DIR`       | `.data`                  | Directory for runtime data files   |

## Local development

1. Install dependencies:

```bash
npm install
```

2. Run migrations and seed:

```bash
npm run migrate
```

3. Start the dev server (auto-creates schema if the database is missing):

```bash
npm run dev
```

## Production deployment

1. Run migrations **before** starting the server:

```bash
npm run migrate
```

2. Ensure the `.data/` directory is writable by the server process.
3. Back up `.data/app.db` regularly.

> **Serverless (Vercel, etc.):** SQLite cannot be used in serverless function environments because the filesystem is read-only and ephemeral. Instead, the `DATABASE_PATH` environment variable can point to a mounted volume, or swap the repository implementation to PostgreSQL.

## Backup

```bash
# Create a backup
cp .data/app.db .data/app.db.bak

# Or using SQLite's .backup command
sqlite3 .data/app.db ".backup .data/app.bak"
```

## Reset

```bash
# Stop the dev server, then remove the database
rm .data/app.db
npm run migrate
```

## Validation

```bash
npm run validate:persistence
```

This runs assertions for schema creation, CRUD operations, unique constraints, JSON storage, and persistence across restart.
