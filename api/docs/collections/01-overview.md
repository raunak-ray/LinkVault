# 01 — Architecture Overview

## Components

```mermaid
flowchart TB
    subgraph Client
        Browser[Browser]
    end

    subgraph API[NestJS API]
        Ctrl[CollectionsController<br/>/collections/*]
        Svc[CollectionsService]
        Guard[AuthGuard<br/>from AuthModule]
        Throttle[ThrottlerGuard<br/>global rate limit]
    end

    subgraph Storage[PostgreSQL]
        Collections[(tbl_collection)]
        Users[(tbl_user)]
    end

    Browser -->|Bearer token| Throttle
    Throttle --> Guard
    Guard --> Ctrl
    Ctrl --> Svc
    Svc --> Collections
    Collections -->|user_id FK| Users
```

| Component | Responsibility |
| --- | --- |
| `CollectionsController` | HTTP layer for `/collections/*`; applies `AuthGuard` to every route; declares the response message per endpoint |
| `CollectionsService` | All DB access for `tbl_collection`; owns create / list / get / update / delete |
| `AuthGuard` | Reused from the auth module — validates the `Bearer` access token (see [auth overview](../auth/01-overview.md)) |
| `Pagination` util | Shared helper (`src/common/pagination/pagination.util.ts`) that turns `page` / `limit` into `skip` / `limit` for SQL |
| `PaginationDto` | Shared query DTO (`src/common/pagination/pagination.dto.ts`) — validates `page` / `limit` query params |
| `TransformInterceptor` | Global — unwraps paginated service results into `data` + `meta` in the response envelope |

> **Module wiring note:** `CollectionsModule` imports `AuthModule` to reuse `AuthGuard`. `CollectionsService` is provided only here.

## Data model

```mermaid
erDiagram
    USER ||--o{ COLLECTION : "owns"
    USER {
        uuid id PK
        varchar name
        varchar email "unique"
        varchar password "bcrypt hash"
        varchar avatar "dicebear URL, auto-generated"
        timestamp created_at
        timestamp deleted_at "null = active"
    }
    COLLECTION {
        uuid id PK
        uuid user_id FK "owner"
        varchar name "unique per user"
        varchar icon "e.g. Layers"
        varchar color "e.g. #6366F1"
        timestamp created_at
        timestamp updated_at
    }
```

Key invariants:

- `(name, user_id)` is **unique** (`uq_collection_name_user`) — a user cannot have two collections with the same name. A duplicate insert fails with `400` via the DB-error mapper (`A collection with this name already exists`).
- Every collection row points at an owner with `user_id` — there are no global or shared collections.
- `idx_collection_user_id` keeps "all collections of one user" queries fast.
- Collections are **hard deleted**: `DELETE` removes the row. There is no soft-delete flag.
- Nothing in this table is ever read without a `user_id` filter — every query includes the owner, so one user can never see or change another user's collections.

## Endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/collections` | Bearer token | List own collections, paginated |
| `GET` | `/collections/:id` | Bearer token | Get one own collection |
| `POST` | `/collections` | Bearer token | Create a collection |
| `PATCH` | `/collections/:id` | Bearer token | Update one own collection |
| `DELETE` | `/collections/:id` | Bearer token | Delete one own collection |

## Environment variables

None specific to this module. The default collection values are hardcoded in `src/collections/constants/index.ts` (`name: 'General'`, `icon: 'Layers'`, `color: '#6366F1'`).
