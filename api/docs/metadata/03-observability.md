# 03 — Observability

## Log sources

| Log prefix | Emits | Where |
| --- | --- | --- |
| `MetadataProducerService` | every enqueue (link id + url) | `LinksService.create` / `update` path |
| `MetadataProcessor` | worker lifecycle: active / completed / failed / error / stalled | worker events |
| `MetadataService` | every DB write: saved, recorded failure | processor path |
| `MetadataFetcherService` | fetch timeouts | processor path |

## Worker event logs

`MetadataProcessor` hooks BullMQ worker events via `@OnWorkerEvent`. Every line includes the **job id, attempt counter, link id, and url** — enough to follow one extraction across the whole pipeline:

```text
[MetadataProducerService] Enqueued metadata extraction for link 5f0095c4 (https://github.com/nestjs/nest)
[MetadataProcessor]      Job 19 active (attempt 1/3): link 5f0095c4 https://github.com/nestjs/nest
[MetadataService]        Saved metadata for link 5f0095c4
[MetadataProcessor]      Job 19 completed: link 5f0095c4
```

A failing job shows every retry, then the final DB write:

```text
[MetadataProcessor] Job 22 failed (attempt 1/3): link 66150dce https://dead-domain-zzz.example — fetch failed
[MetadataProcessor] Job 22 active  (attempt 2/3): link 66150dce …
[MetadataProcessor] Job 22 failed (attempt 2/3): link 66150dce … — fetch failed
[MetadataProcessor] Job 22 active  (attempt 3/3): link 66150dce …
[MetadataService]    Recorded metadata failure for link 66150dce: fetch failed
[MetadataProcessor] Job 22 completed: link 66150dce
```

> The last line says **completed** because the failure was *handled*: after the final attempt the processor records the failure and swallows the error so the job does not retry forever. The `Recorded metadata failure` line right above is the real outcome. `stalled` and worker `error` events are logged too (warn/error level).

## Debugging playbook

| Symptom | Check |
| --- | --- |
| `metadata.status` stuck on `pending` | Is Redis up (`docker compose up -d`)? Is the API process running the worker (same process in this codebase — no separate worker to start)? Grep for `Enqueued metadata extraction` then `Job … active`. |
| `status: failed` in the response | Query `last_error` in `tbl_link_metadata` — `fetch failed` (DNS/network), `HTTP 403 …` (site blocks bots), `Non-HTML response` (PDF/JSON target), `Metadata fetch timeout` (slow site). |
| Fields `null` while `completed` | The site declares none of the tags — every fallback was exhausted. Expected for minimal pages. |
| Job retried but you expected it to fail fast | Only network/HTTP/timeout errors retry. Non-HTML and invalid URLs fail on attempt 1 by design. |
| Old jobs from before a deploy failing | Jobs carry their payload at enqueue time; jobs enqueued by an older code version may lack `linkId`. Flush the `metadata` queue in Redis once (`redis-cli DEL bull:metadata:meta`, or clear via Bull board) after breaking queue-payload changes. |

## Global request logging

Queue processing happens outside HTTP, so the global request-logging middleware never sees it — the worker/queue logs above are the only trace. HTTP entries (`POST /links`, `PATCH /links/:id`) still appear in the normal access log at the moment the job is *enqueued*.
