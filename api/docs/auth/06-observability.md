# 06 — Observability

The logging philosophy is: **log what you would search for later** — failures, security events, and lifecycle milestones. No per-request noise, no "user clicked X" logs.

## Log map

| Level | Event | Where | Example |
| --- | --- | --- | --- |
| `LOG` | User registered | `AuthService.registerUser` | `User registered (id: ece2c162-...)` |
| `LOG` | User logged in | `AuthService.loginUser` | `User logged in (id: ece2c162-...)` |
| `LOG` | Session revoked manually | `AuthService.revokeSession` | `Session revoked (id: ..., user: ...)` |
| `WARN` | Registration blocked (email taken) | `AuthService.registerUser` | `Registration blocked: email already registered (x@y.dev)` |
| `WARN` | Failed login | `AuthService.loginUser` | `Failed login attempt (x@y.dev)` |
| `WARN` | **Refresh token reuse → all sessions revoked** | `AuthService.refreshTokens` | `Refresh token reuse detected for user ...; revoking all sessions` |
| `WARN` | Expired refresh token presented | `AuthService.refreshTokens` | `Refresh token expired for user ...; session revoked` |
| `WARN` | Logout with invalid/expired token | `AuthService.logout` | `Logout with invalid or expired refresh token` |
| `WARN` | Rejected access token on protected route | `AuthGuard` | `Access denied on GET /auth/me: invalid or expired token` |
| `DEBUG` | Token rotation happened (per-session) | `AuthService.refreshTokens` | `Refresh token rotated for user ... (session ...)` |
| `ERROR` | Postgres pool errors (idle client crash) | `DbProvider` | `Database pool error: ...` |

## Why these and not others

- **PII discipline**: user **ids** are logged on success; emails appear only in **failed-attempt** logs (the attacker-chosen value, needed for investigation).
- **No logging for**: `/me`, session listing, password hashing, cookie writes. They succeed silently; failures surface through `401/404` responses and the warnings above.
- **Rate-limit hits are not logged** — bots will flood the log otherwise. They are visible as `429` responses in access logs.

## Reading the logs in practice

**Scenario: a user says "I got logged out"**

```
WARN  Refresh token reuse detected for user 9817d3fa-...; revoking all sessions
```

→ The token was replayed. Either the user double-clicked a refresh racing against itself (same cookie used twice — rare with rotation) or the cookie was stolen. All sessions were killed as the security response; the user must re-login.

**Scenario: "my account is locked"**

```
WARN  Failed login attempt (x@y.dev)     × 10 (within a minute)
```

→ Rate limiting kicked in (`429`). Either a brute-force attempt or a stuck client retrying with a wrong password.

**Scenario: silent 401s from the frontend on protected routes**

```
WARN  Access denied on GET /auth/sessions: invalid or expired token
```

→ The access token expired (15m) and the client refreshed too late, or the refresh cookie was cleared. Point the frontend at the refresh-before-expiry contract.

## Conventions for future code

1. Use scoped loggers: `new Logger(ClassName.name)` — enables filtering by class.
2. `WARN` = a security event or a failure worth investigating; `LOG` = lifecycle milestone; `DEBUG` = high-frequency events (rotations) that are useful when tracing.
3. Never log raw tokens, password hashes, or full request bodies.
4. Never log on the happy path of read endpoints (`me`, `sessions`).