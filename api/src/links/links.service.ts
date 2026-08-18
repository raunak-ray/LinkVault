import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { DbProvider } from 'src/db/db.provider';
import { Link } from 'src/db/schema';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

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
    return link;
  }

  async findAll(userId: string) {
    const links = await this.dbProvider.db
      .select()
      .from(Link)
      .where(eq(Link.user_id, userId));

    return links;
  }

  async findById(userId: string, id: string) {
    const link = await this.dbProvider.db
      .select()
      .from(Link)
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .limit(1);

    return link;
  }

  async update(id: string, userId: string, input: UpdateLinkDto) {
    const values: Record<string, string> = {};
    if (input.title) values.title = input.title;
    if (input.url) values.url = input.url;
    if (input.collectionId) values.collection_id = input.collectionId;

    if (Object.keys(values).length === 0) {
      this.logger.log(`No values to update for link ${id}`);
      throw new BadRequestException(`No values to update for link ${id}`);
    }

    const [link] = await this.dbProvider.db
      .update(Link)
      .set({
        ...values,
        updated_at: new Date(),
      })
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .returning();

    this.logger.log(`Updated link ${id} for user ${userId}`);
    return link;
  }

  async delete(userId: string, id: string) {
    const [link] = await this.dbProvider.db
      .delete(Link)
      .where(and(eq(Link.id, id), eq(Link.user_id, userId)))
      .returning();

    if (!link) {
      this.logger.log(`Link ${id} not found for user ${userId}`);
      throw new NotFoundException(`Link ${id} not found`);
    }

    this.logger.log(`Deleted link ${id} for user ${userId}`);
  }
}
