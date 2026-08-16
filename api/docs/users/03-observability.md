# 03 — Observability

Same philosophy as the auth system: **log what you would search for later** — failures, security events, and lifecycle milestones. No per-request noise.

## Log map

All logs come from `UsersService` (scoped logger `UsersService`).

| Level | Event | Where | Example |
| --- | --- | --- | --- |
| `LOG` | Profile updated | `UsersService.update` | `Profile updated (id: ece2c162-...)` |
| `LOG` | Account soft-deleted | `UsersService.softDelete` | `Account deleted (id: ece2c162-...)` |
| `WARN` | Profile update on missing/deleted user | `UsersService.update` | `Profile update blocked: user not found (id: ece2c162-...)` |
| `WARN` | Delete on missing/already-deleted user | `UsersService.softDelete` | `Account delete blocked: user not found or already deleted (id: ece2c162-...)` |
| `DEBUG` | No-op profile update (empty body) | `UsersService.update` | `Profile update no-op: no fields provided (id: ece2c162-...)` |

## Why these and not others

- **PII discipline**: only user **ids** are logged — consistent with the auth module. The users module never receives an email it needs to log (the caller is identified by token, not email).
- **No logging for**: successful reads, validation rejections (`400` from the global pipe), guard rejections (`401` — already logged by `AuthGuard` as `Access denied on ...`). Failures surface through the `401/404/400` responses and the warnings above.
- **Idempotent deletes are visible**: a `204` for an unknown user is silently fine for the client, but the `WARN` makes it traceable (e.g. a stale access token probing a deleted account, or a double-delete).
- **No-op updates are `DEBUG`**: they are not failures, but useful when tracing "the client says it updated, but nothing changed".

## Reading the logs in practice

**Scenario: a user says "I deleted my account, but it still logs me in"**

```
LOG  Account deleted (id: 9817d3fa-...)
```

→ The delete itself succeeded. The login the user sees is from the **access token grace period** (≤ 15 min) or an old client session that hasn't called refresh yet. Refreshing fails with `401` because all sessions were revoked in the same request.

**Scenario: repeated `Account delete blocked` warnings for one id**

```
WARN  Account delete blocked: user not found or already deleted (id: 9817d3fa-...)   × 3
```

→ A stale access token (from a deleted account) is being replayed against `DELETE /users/me`. Harmless (idempotent `204`), but worth knowing about — usually a stuck frontend retry.

**Scenario: "the profile page saves, but nothing changes"**

```
DEBUG  Profile update no-op: no fields provided (id: 9817d3fa-...)
```

→ The frontend sent an empty `PATCH` body (e.g. only sending changed fields and none changed). The API returned the current profile unchanged. If the frontend expected the avatar to update too — it can't: `avatar` is not editable.

## Conventions for future code

1. Use scoped loggers: `new Logger(ClassName.name)` — enables filtering by class.
2. `WARN` = a security event or a failure worth investigating; `LOG` = lifecycle milestone; `DEBUG` = low-noise events useful when tracing.
3. Never log raw tokens, password hashes, or full request bodies.
4. Never log on the happy path of read endpoints.
5. Keep ids, not emails, on the success path — emails only appear in failed-attempt logs (see the [auth observability doc](../auth/06-observability.md)).