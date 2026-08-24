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
  COLLECTION_LIST_CACHE_KEY,
  COLLECTION_LIST_PREFIX,
  INDIVIDUAL_COLLECTION_CACHE_KEY,
} from './collection.cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { DASHBOARD_CACHE_KEY } from 'src/dashboard/dashboard.cache';

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

    await Promise.all([
      this.deleteKeysByPrefix(userId),

      this.cacheManager.del(DASHBOARD_CACHE_KEY(userId)),
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

    const cachedData =
      await this.cacheManager.get<CollectionResponse>(cacheKey);

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
    await this.cacheManager.set<CollectionResponse>(
      cacheKey,
      data,
      COLLECTION_CACHE_TTL,
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

    const cachedData =
      await this.cacheManager.get<PaginationResponse<CollectionResponse>>(
        cacheKey,
      );

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

    await this.cacheManager.set<PaginationResponse<CollectionResponse>>(
      cacheKey,
      data,
      COLLECTION_CACHE_TTL,
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
      this.cacheManager.del(cacheKey),

      this.deleteKeysByPrefix(userId),

      this.cacheManager.del(DASHBOARD_CACHE_KEY(userId)),
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
      this.cacheManager.del(cacheKey),

      this.deleteKeysByPrefix(userId),

      this.cacheManager.del(DASHBOARD_CACHE_KEY(userId)),
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

  private async deleteKeysByPrefix(userId: string) {
    const prefix = `${COLLECTION_LIST_PREFIX}:${userId}:`;

    const keyv = this.cacheManager.stores[0];

    if (!keyv.iterator) {
      this.logger.warn('Keyv store does not support iterator');
      return;
    }

    const keysToDelete: string[] = [];

    const iterator = keyv.iterator(undefined) as AsyncGenerator<
      [string | undefined, unknown],
      void
    >;

    for await (const entry of iterator) {
      const key = entry[0];

      this.logger.debug(`Iterator key: ${String(key)}`);

      if (typeof key === 'string' && key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    if (keysToDelete.length > 0) {
      await keyv.delete(keysToDelete);
    }

    this.logger.debug(
      `Deleted ${keysToDelete.length} collection list cache keys`,
    );
  }
}
