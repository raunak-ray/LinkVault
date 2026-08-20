# 03 — Pagination, Sorting & Filtering

`GET /links` combines three shared features in one endpoint:

1. **Pagination** — `page` / `limit`, via the shared `@PaginationParams()` decorator.
2. **Sorting** — `sort`, via the shared `@SortingParams()` decorator.
3. **Filtering** — `search`, `isFavourite`, `collectionId`, via `LinkQueryDto`.

All of these are **optional** — `GET /links` with no query params returns the first page (limit 20) of the caller's links, newest first.

## Query parameters

| Param | Type | Default | Rules |
| --- | --- | --- | --- |
| `page` | integer | `1` | Positive integer if provided |
| `limit` | integer | `20` | Positive integer if provided; capped at `100` |
| `sort` | string | `createdAt:desc` | `field:asc` or `field:desc`, comma-separated |
| `search` | string | — | Substring match on link **title** (`LIKE '%term%'`, case-sensitive) |
| `isFavourite` | boolean | — | `true` / `false` — filter favourite links only |
| `collectionId` | uuid | — | Exact match — links in one collection only |

> **How the pieces fit together:** `page`, `limit`, and `sort` are read by the shared decorators; the resource-specific `LinkQueryDto` whitelists `search`, `isFavourite`, and `collectionId` **plus** `page` / `limit` / `sort` so the global validation pipe (`forbidNonWhitelisted`) does not reject them. This is the same pattern the collections list uses.

## Pagination

`@PaginationParams()` in `src/common/pagination/pagination.decorator.ts`:

1. Reads `page` / `limit` from the query string.
2. Applies defaults (`page=1`, `limit=20`) and caps `limit` at `100`.
3. Validates (non-positive or non-integer values throw `400`).
4. Returns `{ page, limit, offset }`, where `offset = (page - 1) * limit`.

Invalid values (e.g. `page=0`, `page=abc`, `limit=-5`) are rejected with `400`.

## Sorting

`@SortingParams()` in `src/common/sorting/sorting.decorator.ts`:

- Reads `sort` and parses `field:order` pairs: `sort=createdAt:desc` or `sort=createdAt:desc,title:asc` for multiple keys.
- **Whitelists** fields — the decorator is called with the allowed fields per endpoint. For links: `@SortingParams(['createdAt', 'title'])`. Anything else throws `400 Invalid sort parameter: <field>`.
- Unknown order values (`sort=title:sideways`) also throw `400`.

Each field maps to a column via `LinkSortingFields` (`src/links/constants/index.ts`):

| Sort field | Column |
| --- | --- |
| `createdAt` | `tbl_links.created_at` |
| `title` | `tbl_links.title` |

Without a `sort` param the query defaults to `created_at DESC` (newest first). Sorting is applied **after** filtering and before pagination.

## Filtering

All filters are combined with `AND` and always start from `user_id = <caller>` — a user can only ever list their own links.

| Filter | SQL | Example |
| --- | --- | --- |
| `search` | `title LIKE '%term%'` (substring match) | `?search=blog` |
| `isFavourite` | `is_favourite = <bool>` | `?isFavourite=true` |
| `collectionId` | `collection_id = <uuid>` | `?collectionId=3f2a9c1e-...` |

`isFavourite` accepts the strings `"true"` / `"false"`; anything else is rejected by validation.

## Response shape

A `GET /links?page=1&limit=5&isFavourite=true&sort=createdAt:desc` with 12 favourite links in total:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Links retrieved successfully",
  "data": [
    {
      "id": "8f2b1c3e-...",
      "title": "Example blog",
      "url": "https://example.com/blog",
      "isFavourite": true,
      "collection": { "id": "3f2a9c1e-...", "name": "Work" },
      "createdAt": "2026-08-19T10:00:00.000Z",
      "updatedAt": "2026-08-19T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 12,
    "totalPages": 3,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

| `meta` field | Meaning |
| --- | --- |
| `total` | Total rows matching the filters (ignores page/limit) |
| `totalPages` | `Math.ceil(total / limit)` — `0` when there are no rows |
| `currentPage` | The page actually used (after defaults) |
| `hasNextPage` | `true` when more rows exist beyond this page |
| `hasPreviousPage` | `true` when `currentPage > 1` |

## Combined example

The full filter chain — "favourite links in my Work collection, newest first, page 2":

```
GET /links?page=2&limit=10&sort=createdAt:desc&isFavourite=true&collectionId=3f2a9c1e-...
```

The service builds one `WHERE` clause (`user_id = sub AND collection_id = ... AND is_favourite = true`), runs the page query and the `count()` in parallel, and returns `{ data, meta }` — the global `TransformInterceptor` detects that shape and spreads it into the envelope.

## Edge cases

- **Page beyond the last one** (e.g. `page=99` with 12 rows): returns `200` with an empty `data` array, `currentPage: 99`, `hasNextPage: false`. It is **not** an error.
- **No rows at all**: `data: []`, `total: 0`, `totalPages: 0`, both `has*Page` flags `false`.
- **`search` matches nothing**: same as no rows — `data: []`, not an error.
- **Empty `sort`**: falls back to `createdAt:desc`.