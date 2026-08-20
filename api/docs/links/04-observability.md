# 04 — Observability

Same philosophy as auth, users, and collections: **log what you would search for later** — failures and lifecycle milestones. In addition, every request is now recorded by a global access-log middleware so traffic volume is always known.

## Log map

Module-level logs come from `LinksService` (scoped logger `LinksService`).

| Level | Event | Where | Example |
| --- | --- | --- | --- |
| `LOG` | Link created | `LinksService.create` | `Created link 8f2b1c3e-... for user ece2c162-...` |
| `LOG` | Link updated | `LinksService.update` | `Updated link 8f2b1c3e-... for user ece2c162-...` |
| `LOG` | Link marked favourite | `LinksService.markFavourite` | `Marked link 8f2b1c3e-... favourite=true for user ece2c162-...` |
| `LOG` | Link deleted | `LinksService.delete` | `Deleted link 8f2b1c3e-... for user ece2c162-...` |
| `WARN` | Update on missing / other user's link | `LinksService.update` | `Link update blocked: link not found (id: 8f2b1c3e-...)` |
| `WARN` | Update with no fields (`400`) | `LinksService.update` | `No values to update for link 8f2b1c3e-...` |
| `WARN` | Favourite toggle on missing link | `LinksService.markFavourite` | `Link 8f2b1c3e-... not found for user ece2c162-...` |
| `WARN` | Delete on missing / other user's link | `LinksService.delete` | `Link 8f2b1c3e-... not found for user ece2c162-...` |

## Global request log

Since the links work, **every** request to the API is logged by `RequestLoggingMiddleware` (scoped logger `HTTP`, registered globally in `AppModule`). One line per request, written when the response finishes:

```
LOG  GET /links?page=1&limit=10 200 12ms user=ece2c162-...
LOG  POST /auth/login 201 143ms user=anonymous
LOG  GET /links/8f2b1c3e-... 404 2ms user=ece2c162-...
```

Fields: `METHOD path statusCode durationMs user=<sub|anonymous>`.

- **`user`** is filled in from the request after `AuthGuard` runs, so protected routes log the caller's id and public routes log `anonymous`.
- This line is how you answer "**how many requests are we getting**" — count `HTTP` lines by route and status over any time window. It complements (does not replace) the failure logs below.

## Why these and not others

- **Success logs only after the DB confirms the change** — the delete/favourite success log comes after the not-found check, so a `LOG` never appears for a request that actually returned `404`.
- **PII discipline**: link **ids** are logged on the module level; user ids only appear in the module logs for mutations. The global access log logs the user id from the token — never email, names, titles, or URLs.
- **`404` "not found" is worth a `WARN`**: because the query filters by owner too, a `404` can mean "deleted" or "someone else's link". Probing another user's link ids shows up here.
- **No extra module logging for**: successful reads (`GET /links`, `GET /links/:id`), validation rejections (`400`), guard rejections (`401` — already logged by `AuthGuard` as `Access denied on ...`). Every request still leaves an `HTTP` access-log line via the middleware.

## Reading the logs in practice

**Scenario: "how much traffic are we getting?"**

```
LOG  GET /links 200 12ms user=ece2c162-...
LOG  GET /links?isFavourite=true 200 8ms user=ece2c162-...
LOG  GET /collections 200 6ms user=ece2c162-...
```

→ Grep the `HTTP` logger for the route and window you care about; the count of lines is the request count. `4xx` / `5xx` statuses stand out immediately.

**Scenario: repeated `Link ... not found` warnings for one id**

```
WARN  Link 8f2b1c3e-... not found for user ece2c162-...   × 5
```

→ Either a stale client is trying to edit/delete a removed link, or someone is probing ids that aren't theirs (the response is the same `404` either way).

## Conventions for future code

1. Use scoped loggers: `new Logger(ClassName.name)` — enables filtering by class.
2. `WARN` = a security event or a failure worth investigating; `LOG` = lifecycle milestone; `DEBUG` = low-noise events useful when tracing.
3. Never log raw tokens, password hashes, or full request bodies.
4. Keep ids, not titles/urls/emails, in logs. The global middleware logs the user id from the token on every request.
5. Every request is already covered by the `HTTP` access log — module logs only need to add what is worth **searching for** later.