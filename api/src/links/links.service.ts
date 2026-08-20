import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { DbProvider } from 'src/db/db.provider';
import { Collection, Link } from 'src/db/schema';
import { MarkFavouriteDto } from './dto/mark-favourite.dto';
import { Pagination } from 'src/common/pagination/pagination.interface';
import { PaginationResponse } from 'src/common/pagination/pagination-response.interface';
import { Sorting } from 'src/common/sorting/sorting.interface';
import { LinkSortingFields } from './constants';
import { LinkQueryDto } from './dto/link-query.dto';
import { LinkResponse } from './interface/link.interface';

@Injectable()
export class LinksService {
  private readonly logger = new Logger(LinksService.name);

  constructor(private readonly dbProvider: DbProvider) {}

  async create(userId: string, input: CreateLinkDto) {
    const [link] = await this.dbProvider.db
      .insert(Link)
      .values({
        title: input.title,
        url: input.url,
        user_id: userId,
        collection_id: input.collectionId,
      })
      .returning();

    this.logger.log(`Created link ${link.id} for user ${userId}`);

    return this.toLinkResponse(link, await this.getCollection(userId, link));
  }

  async findAll(
    userId: string,
    { page, limit, offset }: Pagination,
    sortingInput: Sorting[] | null,
    queryInput: LinkQueryDto,
  ): Promise<PaginationResponse<LinkResponse>> {
    const conditions = [eq(Link.user_id, userId)];

    if (queryInput.collectionId) {
      conditions.push(eq(Link.collection_id, queryInput.collectionId));
    }

    if (queryInput.search) {
      conditions.push(
        or(
          ilike(Link.title, `%${queryInput.search}%`),
          ilike(Link.url, `%${queryInput.search}%`),
        )!,
      );
    }

    if (queryInput.isFavourite !== undefined) {
      conditions.push(eq(Link.is_favourite, queryInput.isFavourite));
    }

    const where = and(...conditions);

    const sortOrders = sortingInput?.map((sort) => {
      const sortingField =
        LinkSortingFields[sort.field as keyof typeof LinkSortingFields];
      const sortingOrder =
        sort.order === 'asc' ? asc(sortingField) : desc(sortingField);
      return sortingOrder;
    });

    const [links, [{ total }]] = await Promise.all([
      this.dbProvider.db
        .select({
          id: Link.id,
          title: Link.title,
          url: Link.url,
          isFavourite: Link.is_favourite,
          collection: {
            id: Collection.id,
            name: Collection.name,
          },
          createdAt: Link.created_at,
          updatedAt: Link.updated_at,
        })
        .from(Link)
        .where(where)
        .innerJoin(
          Collection,
          and(
            eq(Link.collection_id, Collection.id),
            eq(Collection.user_id, userId),
          ),
        )
        .orderBy(...(sortOrders ?? [desc(Link.created_at)]))
        .limit(limit)
        .offset(offset),

      this.dbProvider.db.select({ total: count() }).from(Link).where(where),
    ]);

    return {
      data: links,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: offset + limit < total,
        hasPreviousPage: offset > 0,
      },
    };
  }

  async findById(
    userId: string,
    id: string,
  ): Promise<LinkResponse | undefined> {
    const [link] = await this.dbProvider.db
      .select({
        id: Link.id,
        title: Link.title,
        url: Link.url,
        isFavourite: Link.is_favourite,
        collection: {
          id: Collection.id,
          name: Collection.name,
        },
        createdAt: Link.created_at,
        updatedAt: Link.updated_at,
      })
      .from(Link)
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .innerJoin(
        Collection,
        and(
          eq(Link.collection_id, Collection.id),
          eq(Collection.user_id, userId),
        ),
      )
      .limit(1);

    return link;
  }

  async update(userId: string, id: string, input: UpdateLinkDto) {
    const values: Record<string, unknown> = {};
    if (input.title !== undefined) values.title = input.title;
    if (input.url !== undefined) values.url = input.url;
    if (input.collectionId !== undefined)
      values.collection_id = input.collectionId;

    if (Object.keys(values).length === 0) {
      this.logger.warn(`No values to update for link ${id}`);
      throw new BadRequestException(`No values to update`);
    }

    const [link] = await this.dbProvider.db
      .update(Link)
      .set({
        ...values,
        updated_at: new Date(),
      })
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .returning();

    if (!link) {
      this.logger.warn(`Link update blocked: link not found (id: ${id})`);
      throw new NotFoundException(`Link ${id} not found`);
    }

    this.logger.log(`Updated link ${id} for user ${userId}`);

    return this.toLinkResponse(link, await this.getCollection(userId, link));
  }

  async delete(userId: string, id: string) {
    const [link] = await this.dbProvider.db
      .delete(Link)
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .returning();

    if (!link) {
      this.logger.warn(`Link ${id} not found for user ${userId}`);
      throw new NotFoundException(`Link ${id} not found`);
    }

    this.logger.log(`Deleted link ${id} for user ${userId}`);
  }

  async markFavourite(userId: string, id: string, input: MarkFavouriteDto) {
    const [link] = await this.dbProvider.db
      .update(Link)
      .set({
        is_favourite: input.isFavourite,
        updated_at: new Date(),
      })
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .returning();

    if (!link) {
      this.logger.warn(`Link ${id} not found for user ${userId}`);
      throw new NotFoundException(`Link ${id} not found`);
    }

    this.logger.log(
      `Marked link ${id} favourite=${input.isFavourite} for user ${userId}`,
    );

    return this.toLinkResponse(link, await this.getCollection(userId, link));
  }

  private async getCollection(
    userId: string,
    link: Pick<typeof Link.$inferSelect, 'collection_id'>,
  ) {
    const [collection] = await this.dbProvider.db
      .select({ id: Collection.id, name: Collection.name })
      .from(Collection)
      .where(
        and(
          eq(Collection.id, link.collection_id),
          eq(Collection.user_id, userId),
        ),
      );

    return collection;
  }

  private toLinkResponse(
    link: typeof Link.$inferSelect,
    collection: { id: string; name: string } | undefined,
  ): LinkResponse {
    return {
      id: link.id,
      title: link.title,
      url: link.url,
      isFavourite: link.is_favourite,
      collection: {
        id: collection?.id ?? link.collection_id,
        name: collection?.name ?? link.collection_id,
      },
      createdAt: link.created_at,
      updatedAt: link.updated_at,
    };
  }
}
