import { Pagination } from 'src/common/pagination/pagination.interface';
import { CollectionQueryDto } from './dto/collection-query.dto';
import { Sorting } from 'src/common/sorting/sorting.interface';

export const COLLECTION_CACHE_TTL = 5 * 60 * 1000;

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
  return `collection:list:${userId}:${JSON.stringify({ page: pagination.page, limit: pagination.limit, sorting, search: query.search })}`;
}
