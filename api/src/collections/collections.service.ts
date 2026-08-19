import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(private readonly dbProvider: DbProvider) {}

  async create(userId: string, input: CreateCollectionDto) {
    const [collection] = await this.dbProvider.db
      .insert(Collection)
      .values({
        user_id: userId,
        ...input,
      })
      .returning();

    this.logger.log(`Collection created (id: ${collection.id})`);

    return collection;
  }

  async findByName(userId: string, name: string) {
    const [collection] = await this.dbProvider.db
      .select()
      .from(Collection)
      .where(and(eq(Collection.user_id, userId), eq(Collection.name, name)));

    return collection;
  }

  async findById(userId: string, id: string) {
    const [collection] = await this.dbProvider.db
      .select()
      .from(Collection)
      .where(and(eq(Collection.id, id), eq(Collection.user_id, userId)));

    return collection;
  }

  async findAll(
    userId: string,
    { page, limit, offset }: Pagination,
    sortingInput?: Sorting[] | null,
  ): Promise<PaginationResponse<typeof Collection.$inferSelect>> {
    const where = eq(Collection.user_id, userId);

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

    return {
      data: collections,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: total > offset + limit,
        hasPreviousPage: page > 1,
      },
    };
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

    return updatedCollection;
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

    this.logger.log(`Collection deleted (id: ${id})`);
  }
}
