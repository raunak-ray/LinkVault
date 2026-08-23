# 01 — Architecture Overview

## Components

```mermaid
flowchart TB
    subgraph Client
        Browser[Browser]
    end

    subgraph API[NestJS API]
        Ctrl[DashboardController<br/>/dashboard]
        Svc[DashboardService]
        Guard[AuthGuard<br/>from AuthModule]
        Throttle[ThrottlerGuard<br/>global rate limit]
    end

    subgraph Storage[PostgreSQL]
        Links[(tbl_links)]
        Collections[(tbl_collection)]
        Metadata[(tbl_link_metadata)]
        Users[(tbl_user)]
    end

    Browser -->|Bearer token| Throttle
    Throttle --> Guard
    Guard --> Ctrl
    Ctrl --> Svc
    Svc --> Links
    Svc --> Collections
    Svc --> Metadata
    Links -->|user_id FK| Users
    Collections -->|user_id FK| Users
    Metadata -->|link_id FK| Links
```

| Component | Responsibility |
| --- | --- |
| `DashboardController` | HTTP layer for `GET /dashboard`; applies `AuthGuard`; declares response message |
| `DashboardService` | All DB access for dashboard; aggregates stats and recent activity in parallel |
| `AuthGuard` | Reused from the auth module — validates the `Bearer` access token (see [auth overview](../auth/01-overview.md)) |

## Data model

The dashboard aggregates data from three tables:

```mermaid
erDiagram
    USER ||--o{ LINK : "owns"
    USER ||--o{ COLLECTION : "owns"
    LINK ||--|| LINK_METADATA : "has"
    USER {
        uuid id PK
    }
    LINK {
        uuid id PK
        uuid user_id FK
        uuid collection_id FK
        varchar url
        varchar title
        boolean is_favourite
        timestamp created_at
        timestamp updated_at
    }
    COLLECTION {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar icon
        varchar color
        timestamp created_at
        timestamp updated_at
    }
    LINK_METADATA {
        uuid id PK
        uuid link_id FK "unique"
        enum status "pending/completed/failed"
        text description
        text favicon
        text og_image
        timestamp fetched_at
        timestamp created_at
        timestamp updated_at
    }
```

Key invariants:

- Every query includes `user_id = sub` — a user never sees another user's data
- `innerJoin` between `tbl_links` and `tbl_link_metadata` — every link has exactly one metadata row (created at link creation)
- Aggregations run in parallel (`Promise.all`) for performance

## Endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/dashboard` | Bearer token | Get aggregated dashboard data |

## Environment variables

None specific to this module.