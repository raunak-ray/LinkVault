import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DbProvider } from 'src/db/db.provider';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from 'src/db/schema';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { count } from 'drizzle-orm';
import { Pagination } from 'src/common/pagination/pagination.interface';
import { PaginationResponse } from 'src/common/pagination/pagination-response.interface';
import { Sorting } from 'src/common/sorting/sorting.interface';
import { sortingFields } from './constants';
import { asc } from 'drizzle-orm';
import { CollectionResponse } from './interface/collection.interface';
import { CollectionQueryDto } from './dto/collection-query.dto';
import { ilike } from 'drizzle-orm';
import {
  COLLECTION_CACHE_TTL,
  COLLECTION_LIST_CACHE_TTL,
  COLLECTION_LIST_PREFIX,
  INDIVIDUAL_COLLECTION_CACHE_KEY,
  COLLECTION_LIST_CACHE_KEY,
} from './collection.cache';
import { DASHBOARD_CACHE_KEY } from 'src/dashboard/dashboard.cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import {
  safeCacheGet,
  safeCacheSet,
  safeCacheDel,
  deleteCacheByPrefix,
} from 'src/common/utils/cache.utils';

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(
    private readonly dbProvider: DbProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(userId: string, input: CreateCollectionDto) {
    const [collection] = await this.dbProvider.db
      .insert(Collection)
      .values({
        user_id: userId,
        ...input,
      })
      .returning();

    this.logger.log(`Collection created (id: ${collection.id})`);

    // Invalidate user's collection list and dashboard caches
    await Promise.all([
      this.deleteUserListCache(userId),
      safeCacheDel(
        this.cacheManager,
        DASHBOARD_CACHE_KEY(userId),
        this.logger,
        'dashboard',
      ),
    ]);

    return this.toCollectionResponse(collection);
  }

  async findByName(
    userId: string,
    name: string,
  ): Promise<CollectionResponse | null> {
    const [collection] = await this.dbProvider.db
      .select()
      .from(Collection)
      .where(and(eq(Collection.user_id, userId), eq(Collection.name, name)));

    if (!collection) {
      return null;
    }

    return this.toCollectionResponse(collection);
  }

  async findById(userId: string, id: string): Promise<CollectionResponse> {
    const cacheKey = INDIVIDUAL_COLLECTION_CACHE_KEY(userId, id);

    const cachedData = await safeCacheGet<CollectionResponse>(
      this.cacheManager,
      cacheKey,
      this.logger,
      'collections:single',
    );

    if (cachedData) {
      return cachedData;
    }

    const [collection] = await this.dbProvider.db
      .select()
      .from(Collection)
      .where(and(eq(Collection.id, id), eq(Collection.user_id, userId)));

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const data = this.toCollectionResponse(collection);
    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      data,
      COLLECTION_CACHE_TTL,
      this.logger,
      'collections:single',
    );

    return data;
  }

  async findAll(
    userId: string,
    { page, limit, offset }: Pagination,
    sortingInput?: Sorting[] | null,
    queryInput?: CollectionQueryDto,
  ): Promise<PaginationResponse<CollectionResponse>> {
    const cacheKey = COLLECTION_LIST_CACHE_KEY(
      userId,
      { page, limit, offset },
      sortingInput ?? null,
      queryInput ?? {},
    );

    const cachedData = await safeCacheGet<
      PaginationResponse<CollectionResponse>
    >(this.cacheManager, cacheKey, this.logger, 'collections:list');

    if (cachedData) {
      return cachedData;
    }

    const conditions = [eq(Collection.user_id, userId)];

    if (queryInput?.search) {
      conditions.push(ilike(Collection.name, `%${queryInput.search}%`));
    }

    const where = and(...conditions);

    const sortOrders = sortingInput?.map((sort) => {
      const sortField = sortingFields[sort.field as keyof typeof sortingFields];
      const sortOrder = sort.order === 'asc' ? asc(sortField) : desc(sortField);

      return sortOrder;
    });

    const [collections, [{ total }]] = await Promise.all([
      this.dbProvider.db
        .select()
        .from(Collection)
        .where(where)
        .orderBy(...(sortOrders ?? [desc(Collection.created_at)]))
        .limit(limit)
        .offset(offset),

      this.dbProvider.db
        .select({ total: count() })
        .from(Collection)
        .where(where),
    ]);

    const data = {
      data: collections.map((collection) =>
        this.toCollectionResponse(collection),
      ),
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: total > offset + limit,
        hasPreviousPage: page > 1,
      },
    };

    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      data,
      COLLECTION_LIST_CACHE_TTL,
      this.logger,
      'collections:list',
    );

    return data;
  }

  async update(userId: string, id: string, input: UpdateCollectionDto) {
    const [updatedCollection] = await this.dbProvider.db
      .update(Collection)
      .set({
        ...input,
        updated_at: new Date(),
      })
      .where(and(eq(Collection.id, id), eq(Collection.user_id, userId)))
      .returning();

    if (!updatedCollection) {
      this.logger.warn(
        `Collection update blocked: collection not found (id: ${id})`,
      );
      throw new NotFoundException('Collection not found');
    }

    this.logger.log(`Collection updated (id: ${id})`);

    const cacheKey = INDIVIDUAL_COLLECTION_CACHE_KEY(userId, id);

    await Promise.all([
      safeCacheDel(
        this.cacheManager,
        cacheKey,
        this.logger,
        'collections:single',
      ),
      this.deleteUserListCache(userId),
      safeCacheDel(
        this.cacheManager,
        DASHBOARD_CACHE_KEY(userId),
        this.logger,
        'dashboard',
      ),
    ]);

    return this.toCollectionResponse(updatedCollection);
  }

  async delete(userId: string, id: string) {
    const [deletedCollection] = await this.dbProvider.db
      .delete(Collection)
      .where(and(eq(Collection.id, id), eq(Collection.user_id, userId)))
      .returning();

    if (!deletedCollection) {
      this.logger.warn(
        `Collection delete blocked: collection not found (id: ${id})`,
      );
      throw new NotFoundException('Collection not found');
    }

    const cacheKey = INDIVIDUAL_COLLECTION_CACHE_KEY(userId, id);

    await Promise.all([
      safeCacheDel(
        this.cacheManager,
        cacheKey,
        this.logger,
        'collections:single',
      ),
      this.deleteUserListCache(userId),
      safeCacheDel(
        this.cacheManager,
        DASHBOARD_CACHE_KEY(userId),
        this.logger,
        'dashboard',
      ),
    ]);

    this.logger.log(`Collection deleted (id: ${id})`);
  }

  private toCollectionResponse(
    collection: typeof Collection.$inferSelect,
  ): CollectionResponse {
    return {
      id: collection.id,
      name: collection.name,
      icon: collection.icon,
      color: collection.color,
      createdAt: collection.created_at,
      updatedAt: collection.updated_at,
    };
  }

  private async deleteUserListCache(userId: string): Promise<void> {
    const deleted = await deleteCacheByPrefix(
      this.cacheManager,
      `${COLLECTION_LIST_PREFIX}:${userId}:`,
      this.logger,
      'collections:list:invalidate',
    );
    if (deleted > 0) {
      this.logger.debug(
        `Invalidated ${deleted} collection list cache entries for user ${userId}`,
      );
    }
  }
}
