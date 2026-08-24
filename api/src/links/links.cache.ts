import { Pagination } from 'src/common/pagination/pagination.interface';
import { Sorting } from 'src/common/sorting/sorting.interface';
import { LinkQueryDto } from './dto/link-query.dto';

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
  const queryString = JSON.stringify({
    isFavourite: query.isFavourite,
    collectionId: query.collectionId,
    search: query?.search,
  });
  return `${LINK_LIST_CACHE_KEY_PREFIX}:${userId}:${JSON.stringify({ page: pagination.page, limit: pagination.limit, sorting, query: queryString })}`;
}
