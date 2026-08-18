import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DbProvider } from 'src/db/db.provider';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from 'src/db/schema';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/utils/pagination';
import { count } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

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
    paginationInput: PaginationDto,
  ): Promise<PaginatedResponse<typeof Collection.$inferSelect>> {
    const { skip, limit, page } = Pagination(
      paginationInput.page,
      paginationInput.limit,
    );

    const [collections, [{ total }]] = await Promise.all([
      this.dbProvider.db
        .select()
        .from(Collection)
        .where(eq(Collection.user_id, userId))
        .limit(limit)
        .offset(skip),

      this.dbProvider.db
        .select({ total: count() })
        .from(Collection)
        .where(eq(Collection.user_id, userId)),
    ]);

    return {
      data: collections,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: total > skip + limit,
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
      throw new NotFoundException('Collection not found');
    }

    return updatedCollection;
  }

  async delete(userId: string, id: string) {
    const [deletedCollection] = await this.dbProvider.db
      .delete(Collection)
      .where(and(eq(Collection.id, id), eq(Collection.user_id, userId)))
      .returning();

    this.logger.log(`Deleted collection ${id} for user ${userId}`);

    if (!deletedCollection) {
      throw new NotFoundException('Collection not found');
    }
  }
}
