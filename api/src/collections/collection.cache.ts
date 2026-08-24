import { Pagination } from 'src/common/pagination/pagination.interface';
import { CollectionQueryDto } from './dto/collection-query.dto';
import { Sorting } from 'src/common/sorting/sorting.interface';

function serializeValue(v: unknown): string {
  if (v === undefined || v === null) return 'nil';
  if (typeof v === 'object') return JSON.stringify(v);
  return JSON.stringify(v); // JSON.stringify handles primitives safely
}

function toStableString(obj: Record<string, unknown>): string {
  return Object.keys(obj)
    .sort()
    .map((k) => `${k}:${serializeValue(obj[k])}`)
    .join('|');
}

export const COLLECTION_CACHE_TTL = 5 * 60 * 1000;
export const COLLECTION_LIST_CACHE_TTL = 5 * 60 * 1000;

export const COLLECTION_LIST_PREFIX = 'collection:list';

export function INDIVIDUAL_COLLECTION_CACHE_KEY(
  userId: string,
  id: string,
): string {
  return `collection:${userId}:${id}`;
}

export function COLLECTION_LIST_CACHE_KEY(
  userId: string,
  pagination: Pagination,
  sorting: Sorting[] | null,
  query: CollectionQueryDto,
): string {
  const sortKey = sorting?.[0]
    ? `${sorting[0].field}:${sorting[0].order}`
    : 'createdAt:desc';

  const queryParts: Record<string, unknown> = {
    q: query.search ?? '',
  };

  return `${COLLECTION_LIST_PREFIX}:${userId}:p:${pagination.page}:l:${pagination.limit}:s:${sortKey}:${toStableString(queryParts)}`;
}
