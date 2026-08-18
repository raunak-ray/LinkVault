# 04 — Observability

Same philosophy as auth and users: **log what you would search for later** — failures and lifecycle milestones. No per-request noise.

## Log map

All logs come from `CollectionsService` (scoped logger `CollectionsService`).

| Level | Event | Where | Example |
| --- | --- | --- | --- |
| `LOG` | Collection created | `CollectionsService.create` | `Collection created (id: 3f2a9c1e-...)` |
| `LOG` | Collection updated | `CollectionsService.update` | `Collection updated (id: 3f2a9c1e-...)` |
| `LOG` | Collection deleted | `CollectionsService.delete` | `Collection deleted (id: 3f2a9c1e-...)` |
| `WARN` | Update on missing / other user's collection | `CollectionsService.update` | `Collection update blocked: collection not found (id: 3f2a9c1e-...)` |
| `WARN` | Delete on missing / other user's collection | `CollectionsService.delete` | `Collection delete blocked: collection not found (id: 3f2a9c1e-...)` |

## Why these and not others

- **Success logs only after the DB confirms the change** — the `DELETE` success log was deliberately moved after the not-found check, so a `LOG` never appears for a request that actually returned `404`.
- **PII discipline**: only collection **ids** are logged, never names or the user id. A name could be personal data; the id is enough to investigate.
- **`404` "not found" is worth a `WARN`**: because the query filters by owner too, a `404` can mean "deleted" or "someone else's collection". Probing another user's collection ids shows up here.
- **No logging for**: successful reads (`GET /collections`, `GET /collections/:id`), validation rejections (`400`), guard rejections (`401` — already logged by `AuthGuard` as `Access denied on ...`). Failures surface through the `400/401/404` responses and the warnings above.

## Reading the logs in practice

**Scenario: a user says "I deleted a collection, but it's still there"**

```
LOG  Collection deleted (id: 3f2a9c1e-...)
```

→ The delete succeeded. If the collection still shows in the app, the client probably re-fetched a cached list, or the frontend recreated it. There is no server-side restore — deleted rows are gone.

**Scenario: repeated `Collection update blocked` warnings for one id**

```
WARN  Collection update blocked: collection not found (id: 3f2a9c1e-...)   × 5
```

→ Either a stale client is trying to edit a deleted collection, or someone is probing ids that aren't theirs (the response is the same `404` either way).

## Conventions for future code

1. Use scoped loggers: `new Logger(ClassName.name)` — enables filtering by class.
2. `WARN` = a security event or a failure worth investigating; `LOG` = lifecycle milestone; `DEBUG` = low-noise events useful when tracing.
3. Never log raw tokens, password hashes, or full request bodies.
4. Never log on the happy path of read endpoints.
5. Keep ids, not names or emails, in logs.
