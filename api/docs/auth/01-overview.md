# 01 — Architecture Overview

## Components

```mermaid
flowchart TB
    subgraph Client
        Browser[Browser]
    end

    subgraph API[NestJS API]
        Ctrl[AuthController<br/>/auth/*]
        AuthSvc[AuthService]
        TokSvc[TokenService]
        RefSvc[RefreshTokenService]
        UsersSvc[UsersService]
        Guard[AuthGuard]
        Throttle[ThrottlerGuard<br/>global rate limit]
    end

    subgraph Storage[PostgreSQL]
        Users[(tbl_user)]
        Sessions[(tbl_refresh_token)]
    end

    Browser -->|POST /auth/*| Throttle
    Throttle --> Ctrl
    Ctrl --> AuthSvc
    AuthSvc --> UsersSvc --> Users
    AuthSvc --> TokSvc
    AuthSvc --> RefSvc --> Sessions
    Browser -->|Bearer token| Guard
    Guard --> TokSvc
```

| Component | Responsibility |
| --- | --- |
| `AuthController` | HTTP layer for `/auth/*`, applies per-endpoint rate limits, guards `/me`, `/sessions` |
| `AuthService` | Orchestrates register / login / refresh / logout / sessions |
| `TokenService` | Signs and verifies JWTs, hashes refresh tokens, computes expiry |
| `RefreshTokenService` | DB access for session rows (`tbl_refresh_token`) |
| `UsersService` | DB access for `tbl_user`, strips password from user objects |
| `AuthGuard` | Validates the `Bearer` access token on protected routes |
| `ThrottlerGuard` | Global rate limiting; stricter per-endpoint limits on auth routes |

## Data model

```mermaid
erDiagram
    USER ||--o{ REFRESH_TOKEN : "owns"
    USER {
        uuid id PK
        varchar name
        varchar email "unique"
        varchar password "bcrypt hash"
        varchar avatar "dicebear URL, auto-generated"
        timestamp created_at
        timestamp deleted_at "null = active"
    }
    REFRESH_TOKEN {
        uuid id PK "= JWT jti"
        uuid user_id FK
        varchar token_hash "bcrypt hash of refresh token"
        timestamp expires_at
        timestamp revoked_at "null = active"
        timestamp created_at
    }
```

Key invariants:

- The refresh token's JWT `jti` claim **equals the session row `id`** — the server can look up a session from a token.
- The raw refresh token is **never stored**. Only its bcrypt hash is kept, so a DB leak cannot be replayed to forge sessions.
- `revoked_at` is set, never deleted — revocation history is preserved for reuse detection.
- Deleting a user cascades to their session rows (`ON DELETE CASCADE`).
- Accounts are **soft deleted** (`deleted_at` set, row kept); deleted users are invisible to login and lookups. See the [users docs](../users/01-overview.md).

## Token lifecycle

```mermaid
stateDiagram-v2
    [*] --> Issued: login / register
    Issued --> Active: stored as session row
    Active --> Rotated: refresh endpoint used
    Rotated --> Issued: new pair issued, old revoked
    Active --> Expired: expires_at passed
    Active --> Revoked: logout / manual revoke
    Revoked --> [*]
    Expired --> [*]

    note right of Active
        Revoked token presented again
        = reuse -> all sessions revoked
    end note
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ACCESS_SECRET` | HMAC secret for access JWTs |
| `ACCESS_EXPIRY` | Access token TTL (e.g. `15m`) |
| `REFRESH_SECRET` | HMAC secret for refresh JWTs |
| `REFRESH_EXPIRY` | Refresh token TTL (e.g. `1D`) |
| `CORS_ORIGIN` | Comma-separated allowed origins (default `http://localhost:3000`) |
| `DB_URL` | PostgreSQL connection string |