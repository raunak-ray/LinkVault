# 03 — Token Refresh & Rotation

## How rotation works

Every call to `POST /auth/refresh` (rate limited: **30 requests / minute**) consumes the presented refresh token and issues a **new pair**. The old refresh token is revoked in the database; the client receives a new cookie.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant A as AuthService
    participant T as TokenService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    C->>A: POST /auth/refresh + refreshToken cookie
    alt no cookie
        A-->>C: 401 Unauthorized
    end
    A->>T: verifyRefreshToken(token)
    T-->>A: payload { sub, email, jti }
    alt signature invalid / expired JWT
        A-->>C: 401 Unauthorized
    else jti missing
        A-->>C: 401 Unauthorized
    end
    A->>R: findById(jti)
    R->>DB: SELECT session WHERE id = jti
    DB-->>R: session | null
    alt session not in DB
        A-->>C: 401 Unauthorized
    end
    A->>A: bcrypt.compare(token, session.token_hash)
    alt hash mismatch
        A-->>C: 401 Unauthorized
    end
    alt session.revoked_at set  <-- REUSE DETECTED
        A->>R: revokeAllForUser(user_id)
        A->>A: clear refresh cookie
        A-->>C: 401 Unauthorized
    else session expired
        A->>R: revoke(session.id)
        A-->>C: 401 Unauthorized
    else session valid
        A->>R: revoke(session.id)
        R->>DB: UPDATE revoked_at = now()
        A->>T: issueTokenPair(sub, email, new jti)
        T-->>A: accessToken + refreshToken + refreshExpiry
        A->>A: set new refresh cookie (maxAge = TTL)
        A->>R: create(new session row)
        R->>DB: INSERT
        A-->>C: 200 { accessToken, refreshExpiry }
    end
```

## Reuse detection (the important scenario)

If a revoked refresh token is ever presented again — a sign the token was **stolen** (the legitimate client has already rotated past it) — the server treats it as a credential compromise and kills **every active session** of that user.

```mermaid
sequenceDiagram
    autonumber
    participant Mallory as Attacker (stale token)
    participant A as AuthService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    Mallory->>A: POST /auth/refresh + old token
    A->>R: findById(X)
    R->>DB: SELECT session WHERE id = X
    DB-->>R: session X with revoked_at set
    A->>R: revokeAllForUser(user)
    R->>DB: UPDATE all active sessions -> revoked
    A->>A: clear refresh cookie
    A-->>Mallory: 401 Unauthorized

    Note right of A: Refresh token reuse detected<br/>All user sessions revoked
```

**Why revoke everything?** The stolen token and the legitimate client's current token are indistinguishable — an attacker could be sitting in the middle of the rotation. Revoking all sessions forces a full re-login and invalidates the attacker in one shot.

## Client expectations

1. Keep the `refreshToken` cookie — it is `httpOnly`, the client never reads it.
2. On `401` from the refresh endpoint: session is gone (revoked / reused / expired). The client must **drop local state and redirect to login**.
3. After refresh, the old cookie is replaced in the same response (`Set-Cookie`); the client does nothing special.
4. `refreshExpiry` in the response tells the client how long the new session lasts.