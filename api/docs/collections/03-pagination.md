# 03 — Pagination & Sorting

Pagination and sorting are shared, cross-cutting features. Their files live in `src/common/`:

| File | Purpose |
| --- | --- |
| `pagination/pagination.decorator.ts` | `@PaginationParams()` — reads and validates `page` / `limit`, computes `offset` |
| `pagination/pagination.interface.ts` | `Pagination` — the `{ page, limit, offset }` object a service receives |
| `pagination/pagination-response.interface.ts` | `PaginationResponse<T>` / `PaginationMeta` — the shape a service returns and the interceptor unwraps |
| `sorting/sorting.decorator.ts` | `@SortingParams(fields)` — parses `sort=field:asc|desc` and whitelists fields |
| `sorting/sorting.interface.ts` | `Sorting` — the `{ field, order }` objects a service receives |

`GET /collections` uses them, and so does `GET /links` (with extra filters — see the [links docs](../links/03-pagination-sorting-filtering.md)). Any future list endpoint can reuse them as-is by adding the two decorators to its controller.

## Query parameters

| Param | Type | Default | Rules |
| --- | --- | --- | --- |
| `page` | integer | `1` | Positive integer if provided |
| `limit` | integer | `20` | Positive integer if provided; capped at `100` |
| `sort` | string | `createdAt:desc` | `field:asc` or `field:desc`, comma-separated |

Invalid values (e.g. `page=0`, `page=abc`, `limit=-5`) are rejected by the pagination decorator with `400`.

## How it works

1. `@PaginationParams()` reads `page` / `limit` from the query string, applies defaults (`page=1`, `limit=20`), caps `limit` at `100`, validates, and returns `{ page, limit, offset }` where `offset = (page - 1) * limit`.
2. `@SortingParams(['createdAt', 'name'])` reads `sort`, splits it into `{ field, order }` pairs, and rejects any field not in its whitelist with `400`.
3. The service maps each sort field to a real column via `sortingFields` (`src/collections/constants/index.ts`):

   | Sort field | Column |
   | --- | --- |
   | `createdAt` | `tbl_collection.created_at` |
   | `name` | `tbl_collection.name` |

   Without a `sort` param it orders by `created_at DESC` (newest first).
4. The service runs two queries in parallel: the page (`ORDER BY ... LIMIT ... OFFSET ...`) and the total count.
5. The service returns a `PaginationResponse<T>`: `{ data: T[], meta: PaginationMeta }`.
6. The global `TransformInterceptor` detects that shape (an array under `data` plus a `meta` object) and spreads it into the standard envelope as `data` + `meta`.

## Response shape

A `GET /collections?page=2&limit=5&sort=createdAt:desc` with 12 collections in total:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Collections fetched successfully",
  "data": [
    {
      "id": "3f2a9c1e-...",
      "name": "Work",
      "icon": "Briefcase",
      "color": "#0EA5E9",
      "createdAt": "2026-08-19T10:00:00.000Z",
      "updatedAt": "2026-08-19T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 12,
    "totalPages": 3,
    "currentPage": 2,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

| `meta` field | Meaning |
| --- | --- |
| `total` | Total rows that match the filter (ignores page/limit) |
| `totalPages` | `Math.ceil(total / limit)` — always at least 1 |
| `currentPage` | The page actually used (after defaults) |
| `hasNextPage` | `true` when more rows exist beyond this page |
| `hasPreviousPage` | `true` when `currentPage > 1` |

## Edge cases

- **Page beyond the last one** (e.g. `page=99` with 12 rows): returns `200` with an empty `data` array, `currentPage: 99`, `hasNextPage: false`. It is **not** an error.
- **No rows at all**: `data: []`, `total: 0`, `totalPages: 0`, both `has*Page` flags `false`.
- **`totalPages` of 0**: `Math.ceil(0 / limit)` is `0`. Clients should treat `0` as "no pages" and not request `page=1` blindly.
- **Multiple sort keys**: `sort=name:asc,createdAt:desc` applies `name` first, then `createdAt` (left to right).

## Adding pagination/sorting to a new endpoint

1. In the controller: add `@PaginationParams()` and `@SortingParams(['fieldA', 'fieldB'])` parameters alongside `@CurrentUser('sub')`.
2. If the endpoint has its own query DTO, whitelist `page` / `limit` / `sort` in it so the global validation pipe does not reject them (that is what `LinkQueryDto` does).
3. In the service: type the result as `PaginationResponse<YourType>` and map sort fields to columns in a `sortingFields` constant.
4. Query with `.orderBy(...).limit(limit).offset(offset)` and a parallel `count()`.
5. Return `{ data, meta }` — the interceptor does the rest.