import { Pagination } from 'src/common/pagination/pagination.interface';
import { Sorting } from 'src/common/sorting/sorting.interface';
import { LinkQueryDto } from './dto/link-query.dto';

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

export const LINK_CACHE_TTL = 15 * 60 * 1000;
export const LINK_LIST_CACHE_TTL = 5 * 60 * 1000;

export const LINK_LIST_CACHE_KEY_PREFIX = 'link:list';

export function INDIVIDUAL_LINK_CACHE_KEY(
  userId: string,
  linkId: string,
): string {
  return `link:${userId}:${linkId}`;
}

export function LINK_LIST_CACHE_KEY(
  userId: string,
  pagination: Pagination,
  sorting: Sorting[] | null,
  query: LinkQueryDto,
): string {
  const sortKey = sorting?.[0]
    ? `${sorting[0].field}:${sorting[0].order}`
    : 'createdAt:desc';

  const queryParts: Record<string, unknown> = {
    fav: query.isFavourite ?? 'all',
    coll: query.collectionId ?? 'all',
    q: query.search ?? '',
  };

  return `${LINK_LIST_CACHE_KEY_PREFIX}:${userId}:p:${pagination.page}:l:${pagination.limit}:s:${sortKey}:${toStableString(queryParts)}`;
}
