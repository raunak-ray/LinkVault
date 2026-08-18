# 03 — Pagination

Pagination is a shared, cross-cutting feature. Its files live together in `src/common/pagination/`:

| File | Purpose |
| --- | --- |
| `pagination.dto.ts` | `PaginationDto` — validates the `page` and `limit` query params |
| `pagination.util.ts` | `Pagination()` — converts `page` / `limit` into `skip` / `limit` for SQL |
| `paginated-response.interface.ts` | `PaginatedResponse<T>` / `PaginatedMeta` — the shape a service returns and the interceptor unwraps |

Currently only `GET /collections` uses it, but any future list endpoint can reuse it as-is.

## Query parameters

| Param | Type | Default | Rules |
| --- | --- | --- | --- |
| `page` | integer | `1` | Must be a positive number if provided |
| `limit` | integer | `20` | Must be a positive number if provided |

Invalid values (e.g. `page=0`, `page=abc`, `limit=-5`) are rejected by the global validation pipe with `400`.

## How it works

1. `PaginationDto` validates and transforms the query params (`@Type(() => Number)` converts the string `"2"` from the URL into the number `2`).
2. `Pagination(page, limit)` applies the defaults and computes `skip = (page - 1) * limit`.
3. The service runs two queries in parallel: the page (`LIMIT ... OFFSET ...`) and the total count.
4. The service returns a `PaginatedResponse<T>`: `{ data: T[], meta: PaginatedMeta }`.
5. The global `TransformInterceptor` detects that shape (an array under `data` plus a `meta` object) and spreads it into the standard envelope as `data` + `meta`.

## Response shape

A `GET /collections?page=2&limit=5` with 12 collections in total:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Collections fetched successfully",
  "data": [ ],
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

## Adding pagination to a new endpoint

1. Import `PaginationDto` and bind it with `@Query()`.
2. In the service: `const { skip, limit, page } = Pagination(input.page, input.limit);`
3. Query with `.limit(limit).offset(skip)` and a parallel `count()`.
4. Return `{ data, meta }` — typed as `PaginatedResponse<YourType>`.
5. The interceptor does the rest; the controller just returns the service result.
