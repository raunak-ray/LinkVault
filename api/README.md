# LinkVault API

Backend for **LinkVault** — a bookmark manager. Built with [NestJS](https://nestjs.com), [Drizzle ORM](https://orm.drizzle.team), and PostgreSQL.

## What it does

- **Auth** — register, login, refresh-token rotation in an `httpOnly` cookie, session management, logout. JWT-based (`Authorization: Bearer` header).
- **Users** — update your own profile, soft-delete your account.
- **Collections** — organize bookmarks into collections. CRUD, paginated + sortable listing, and a default **General** collection created at registration.
- **Links** — the bookmarks themselves. CRUD, favourite flag, and a paginated list that supports sorting plus `search` / `isFavourite` / `collectionId` filters.

Every success response uses the same envelope, enforced by a global interceptor:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": { }
}
```

Paginated endpoints add a `meta` object (`total`, `totalPages`, `currentPage`, `hasNextPage`, `hasPreviousPage`) next to `data`. Errors go through a global exception filter with the same `success: false` flag.

Pagination (`page` / `limit`) and sorting (`sort=field:asc|desc`) are centralized as shared decorators — `@PaginationParams()` and `@SortingParams()` — used by both the collections and links list endpoints. Every request is logged by a global access-log middleware (method, path, status, duration, user) so traffic volume is always trackable.

## Documentation

Docs are written scenario-first — what happens, why, and how to debug it.

| Folder | Covers |
| --- | --- |
| [docs/auth](docs/auth/README.md) | Registration, login, tokens, sessions, security, logging |
| [docs/users](docs/users/README.md) | Profile management and account deletion |
| [docs/collections](docs/collections/README.md) | Collection CRUD, pagination, sorting, logging |
| [docs/links](docs/links/README.md) | Link CRUD, favourites, pagination/sorting/filtering, logging |

## Project structure

```
src/
├── auth/          # AuthController, AuthService, TokenService, RefreshTokenService, AuthGuard
├── users/         # profile update + soft delete, seeds the default collection on register
├── collections/   # collection CRUD with pagination and sorting
├── links/         # link CRUD, favourite flag, paginated/sortable/filterable listing
├── common/        # shared: pagination + sorting decorators, response envelope, exception filter, request-logging middleware
└── db/            # schema, migrations, DB provider
```

## Project setup

```bash
$ npm install
```

Copy `.env.example`-style configuration into `.env` (or extend the existing one). Required variables:

| Variable | Purpose |
| --- | --- |
| `DB_URL` | PostgreSQL connection string |
| `ACCESS_SECRET` / `ACCESS_EXPIRY` | Access JWT secret and TTL (e.g. `15m`) |
| `REFRESH_SECRET` / `REFRESH_EXPIRY` | Refresh JWT secret and TTL (e.g. `1D`) |
| `PORT` | API port (default `5050`) |
| `CORS_ORIGIN` | Comma-separated allowed origins |

Apply database migrations:

```bash
$ npm run db:migrate
```

## Compile and run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# lint
$ npm run lint
```

## License

MIT
