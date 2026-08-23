import { Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DbProvider } from 'src/db/db.provider';
import { LinkMetadata } from 'src/db/schema';

import { ExtractedMetadata } from './interfaces/extracted-metadata.interface';

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name);

  constructor(private readonly dbProvider: DbProvider) {}

  async saveSuccess(
    linkId: string,
    metadata: ExtractedMetadata,
  ): Promise<void> {
    await this.dbProvider.db
      .update(LinkMetadata)
      .set({
        description: metadata.description,
        favicon: metadata.favicon,
        og_image: metadata.og_image,
        status: 'completed',
        last_error: null,
        fetched_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(LinkMetadata.link_id, linkId));

    this.logger.log(`Saved metadata for link ${linkId}`);
  }

  async saveFailure(linkId: string, error: string): Promise<void> {
    await this.dbProvider.db
      .update(LinkMetadata)
      .set({
        status: 'failed',
        last_error: error,
        fetched_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(LinkMetadata.link_id, linkId));

    this.logger.warn(`Recorded metadata failure for link ${linkId}: ${error}`);
  }

  async resetToPending(linkId: string): Promise<void> {
    await this.dbProvider.db
      .update(LinkMetadata)
      .set({
        description: null,
        favicon: null,
        og_image: null,
        status: 'pending',
        last_error: null,
        fetched_at: null,
        updated_at: new Date(),
      })
      .where(eq(LinkMetadata.link_id, linkId));
  }
}
