# 02 — Registration & Login

## Register (`POST /auth/register`)

Rate limited: **5 requests / minute**.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant A as AuthService
    participant U as UsersService
    participant T as TokenService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    C->>A: register(name, email, password)
    A->>U: findByEmail(email)
    U->>DB: SELECT user WHERE email = ?
    DB-->>U: null
    alt email already registered
        DB-->>U: user
        A-->>C: 409 Conflict
    end
    A->>A: bcrypt.hash(password, salt 10)
    A->>U: create(user)
    U->>DB: INSERT INTO tbl_user
    DB-->>U: user (id, name, email)
    A->>T: issueTokenPair(sub, email, jti)
    T-->>A: accessToken + refreshToken + refreshExpiry
    A->>A: set refreshToken cookie (httpOnly)
    A->>T: hashRefreshToken(refreshToken)
    A->>R: create(id=jti, hash, expiry, userId)
    R->>DB: INSERT INTO tbl_refresh_token
    A-->>C: 201 { user, accessToken } + Set-Cookie
```

**Behavior notes**

- Email uniqueness is checked before insert; duplicates get `409 Conflict`.
- The user is logged in immediately after registration — a session is issued in the same request.
- The response never contains the refresh token — it only travels in the cookie.

## Login (`POST /auth/login`)

Rate limited: **10 requests / minute**.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant A as AuthService
    participant U as UsersService
    participant T as TokenService
    participant R as RefreshTokenService
    participant DB as PostgreSQL

    C->>A: login(email, password)
    A->>U: findByEmailWithPassword(email)
    U->>DB: SELECT user WHERE email = ?
    DB-->>U: user | null

    alt user not found
        A->>A: bcrypt.compare(password, DUMMY_HASH)
        A-->>C: 401 Unauthorized
    else user found
        A->>A: bcrypt.compare(password, stored hash)
        alt password mismatch
            A-->>C: 401 Unauthorized
        else match
            A->>T: issueTokenPair(sub, email, jti)
            T-->>A: accessToken + refreshToken + refreshExpiry
            A->>A: set refreshToken cookie
            A->>R: create(id=jti, hash, expiry, userId)
            R->>DB: INSERT INTO tbl_refresh_token
            A-->>C: 200 { user, accessToken } + Set-Cookie
        end
    end
```

**Behavior notes**

- Both failure cases return the identical `401 Invalid credentials` message — an attacker cannot distinguish "no such email" from "wrong password" by the response.
- When the email does not exist, bcrypt still runs against a fixed dummy hash so response **timing** is also indistinguishable (prevents user enumeration).
- A failed login attempt is logged as a warning with the attempted email.

## Current user (`GET /auth/me`)

Protected by `AuthGuard` — requires a valid `Authorization: Bearer <accessToken>` header.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant G as AuthGuard
    participant T as TokenService
    participant A as AuthService
    participant U as UsersService
    participant DB as PostgreSQL

    C->>G: GET /auth/me + Bearer token
    alt missing / malformed header
        G-->>C: 401 Unauthorized
    else token invalid / expired
        G->>T: verifyAccessToken(token)
        T-->>G: throws
        G-->>C: 401 Unauthorized
    else valid
        G->>T: verifyAccessToken(token)
        T-->>G: payload { sub, email }
        G->>A: fetchMe(sub)
        A->>U: findById(sub)
        U->>DB: SELECT user WHERE id = ?
        DB-->>U: user | null
        alt user deleted
            A-->>C: 404 Not Found
        else
            A-->>C: 200 { id, name, email, createdAt }
        end
    end
```

**Behavior notes**

- The access token is the only credential here; the refresh cookie is **not** consulted.
- If the account was deleted between token issuance and this call, the API returns `404` (the token itself was valid, the user is gone).
- A rejected token is logged as a warning with the route, for monitoring brute-force scans.