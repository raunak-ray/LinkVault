# 04 — Session Management

A **session** = one active row in `tbl_refresh_token`. Each login/register creates one; each refresh rotates to a new one. This document covers inspecting and killing sessions.

## List sessions (`GET /auth/sessions`)

Protected — requires a valid Bearer access token. Returns the caller's **active** (non-revoked, non-expired-in-DB) sessions.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant G as AuthGuard
    participant A as AuthService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    C->>G: GET /auth/sessions + Bearer token
    G->>G: verify access token -> sub
    G->>A: getSessions(sub)
    A->>R: findActiveByUserId(sub)
    R->>DB: SELECT * WHERE user_id = ? AND revoked_at IS NULL
    DB-->>R: sessions[]
    A-->>C: 200 [{ id, createdAt, expiresAt }]
```

Response shape (per session):

```json
{
  "id": "2fac10aa-...",
  "createdAt": "2026-08-15T08:47:43.541Z",
  "expiresAt": "2026-08-16T08:47:43.000Z"
}
```

`id` is the session's `jti` — the same value a client can use to revoke it.

## Revoke a session (`DELETE /auth/sessions/:id`)

Kills one session. Ownership is enforced server-side — a user can only revoke **their own** sessions.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant G as AuthGuard
    participant A as AuthService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    C->>G: DELETE /auth/sessions/:id + Bearer token
    G->>A: revokeSession(id, sub)
    A->>R: findById(id)
    R->>DB: SELECT session WHERE id = ?
    DB-->>R: session | null
    alt session not found OR belongs to another user
        A-->>C: 404 Not Found
    else owner matches
        A->>R: revoke(id)
        R->>DB: UPDATE revoked_at = now()
        A-->>C: 200 { success: true }
    end
```

**Behavior notes**

- Revoking the session the current client is using logs the user out on their next refresh (the cookie token will be rejected as revoked).
- The revoke is logged at `info` with the session and user id — useful for audit.

## Logout (`POST /auth/logout`)

Best-effort: revokes the session tied to the presented cookie, then clears the cookie regardless of outcome.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant A as AuthService
    participant T as TokenService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    C->>A: POST /auth/logout + refreshToken cookie
    alt cookie present
        A->>T: verifyRefreshToken(token)
        alt valid JWT with jti
            A->>R: revoke(jti)
            R->>DB: UPDATE revoked_at = now()
        else invalid / expired
            A-->>A: warn: logout with invalid refresh token
        end
    end
    A->>A: clear refresh cookie
    A-->>C: 200 { success: true }
```

**Behavior notes**

- Logout never fails: even a tampered/expired cookie yields `200 { success: true }` with the cookie cleared.
- A logout with an invalid token is logged as a warning — usually harmless (expired cookie), occasionally a signal of tampering.