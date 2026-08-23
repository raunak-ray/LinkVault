# 03 — Observability

Same philosophy as auth, users, collections, and links: **log what you would search for later** — failures and lifecycle milestones. The dashboard is a read-only aggregation, so it produces minimal logs.

## Log map

All logs come from `DashboardService` (scoped logger `DashboardService`).

| Level | Event | Where | Example |
| --- | --- | --- | --- |
| `LOG` | Dashboard data fetched | `DashboardService.getDashboardData` | `Dashboard data fetched for user ece2c162-...` |

## Why these and not others

- **No logging for individual query failures** — they surface as `500` through the global exception filter (which already logs them)
- **No `404` for empty dashboard** — an empty dashboard is a valid state (new user), not a failure
- **Single `LOG` per request** — enough to confirm the feature is being used and trace slow requests when correlated with the global access log (`HTTP` middleware)

## Reading the logs in practice

**Scenario: "how many users are checking their dashboard?"**

```
LOG  Dashboard data fetched for user ece2c162-...
LOG  Dashboard data fetched for user 9817d3fa-...
```

→ Count unique user ids in a time window. Correlate with `HTTP` access log lines for `GET /dashboard 200` to get total requests including unauthenticated attempts (which hit `401` before reaching the service).

## Conventions for future code

1. Use scoped loggers: `new Logger(ClassName.name)` — enables filtering by class.
2. `LOG` = lifecycle milestone; `WARN` = security event or failure worth investigating; `DEBUG` = high-frequency events.
3. Never log raw tokens, password hashes, or full request bodies.
3. Read-only endpoints: one `LOG` per successful request is sufficient; individual query failures are handled by the global exception filter.