# Authentication and Authorization

## Overview

Element and reaction **mutation endpoints** (POST, PUT, DELETE under `app/api/**`) are protected by a server-side maintainer-token check. Hiding the admin UI alone is not considered authorization.

**Read endpoints** (GET) remain public and only expose non-sensitive catalog data (elements and reactions).

## How it works

A shared guard in `src/lib/auth.ts` (`checkAuth`) runs at the top of every mutation handler:

1. Read `MAINTAINER_TOKEN` from `process.env`.
2. If the variable is unset, **all mutations are denied** (fail-safe).
3. Otherwise, require an `Authorization: Bearer <token>` header and compare it with a timing-safe comparison.

```
┌─────────────┐     ┌──────────────────────┐     ┌──────────┐
│  Admin UI   │────▶│  fetcher (adds BSG)  │────▶│  API     │
│  (token in   │     │  Authorization hdr   │     │  (checks │
│  localStorage)│     │                      │     │  token)  │
└─────────────┘     └──────────────────────┘     └──────────┘
```

## Local development

1. Create a `.env.local` file with a maintainer token:

```bash
MAINTAINER_TOKEN=dev-maintainer-token-123
```

2. Start the dev server:

```bash
npm run dev
```

3. Open `/admin` in the browser and enter the token in the "Maintainer access" form.
   The token is stored in `localStorage` for the current browser session.

4. The `fetcher` automatically attaches the `Authorization: Bearer <token>` header to
   all API requests when a token is present.

## Production deployment

- Set `MAINTAINER_TOKEN` as a platform secret (Vercel Environment Variable, etc.).
- If the variable is missing, all mutation endpoints return `401 Unauthorized` —
  this is intentional and prevents accidental data modification.
- The token should be long and random. Keep it secret; treat it like a password.

## Endpoints requiring authorization

| Method   | Route                  | Auth required |
|----------|------------------------|---------------|
| POST     | `/api/elements`        | Yes           |
| PUT      | `/api/elements/[id]`   | Yes           |
| DELETE   | `/api/elements/[id]`   | Yes           |
| POST     | `/api/reactions`       | Yes           |
| DELETE   | `/api/reactions`       | Yes           |

Read-only endpoints (GET) do not require authorization.

## Response codes

| Status | Meaning                          |
|--------|----------------------------------|
| 200    | Success                          |
| 201    | Created                          |
| 400    | Malformed payload or validation error |
| 401    | Unauthorized (no/wrong token)    |
| 404    | Resource or referenced element not found |
| 409    | Conflict (duplicate element/reaction pair, or element still referenced by reactions) |
| 500    | Internal error (message does not leak internals) |

`DELETE /api/elements/[id]` returns `409` if the element is still referenced by one or more
reactions (enforced by a foreign-key constraint in SQLite). This prevents silent orphaning
of reaction rows. No partial data change occurs on any non-2xx response.
