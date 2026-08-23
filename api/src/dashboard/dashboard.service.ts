import { Injectable } from '@nestjs/common';
import { DbProvider } from 'src/db/db.provider';
import { DashboardResponse } from './interface/dashboard-response';
import { Collection, Link, LinkMetadata } from 'src/db/schema';
import { and, count, eq, desc } from 'drizzle-orm';
import { RECENT_COLLECTION_LIMIT, RECENT_LINKS_LIMIT } from './constant';

@Injectable()
export class DashboardService {
  constructor(private readonly dbProvider: DbProvider) {}

  async getDashboardData(sub: string): Promise<DashboardResponse> {
    const [
      [{ totalLinks }],
      [{ totalCollections }],
      [{ totalFavouriteLinks }],
      recentLinksRaw,
      recentCollectionsRaw,
    ] = await Promise.all([
      this.dbProvider.db
        .select({ totalLinks: count() })
        .from(Link)
        .where(eq(Link.user_id, sub)),
      this.dbProvider.db
        .select({ totalCollections: count() })
        .from(Collection)
        .where(eq(Collection.user_id, sub)),
      this.dbProvider.db
        .select({ totalFavouriteLinks: count() })
        .from(Link)
        .where(and(eq(Link.user_id, sub), eq(Link.is_favourite, true))),

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
          metadata: {
            status: LinkMetadata.status,
            description: LinkMetadata.description,
            favicon: LinkMetadata.favicon,
            ogImage: LinkMetadata.og_image,
          },
          createdAt: Link.created_at,
          updatedAt: Link.updated_at,
        })
        .from(Link)
        .where(eq(Link.user_id, sub))
        .innerJoin(Collection, eq(Link.collection_id, Collection.id))
        .innerJoin(LinkMetadata, eq(Link.id, LinkMetadata.link_id))
        .orderBy(desc(Link.updated_at))
        .limit(RECENT_LINKS_LIMIT),

      this.dbProvider.db
        .select({
          id: Collection.id,
          name: Collection.name,
          icon: Collection.icon,
          color: Collection.color,
          createdAt: Collection.created_at,
          updatedAt: Collection.updated_at,
        })
        .from(Collection)
        .where(eq(Collection.user_id, sub))
        .orderBy(desc(Collection.updated_at))
        .limit(RECENT_COLLECTION_LIMIT),
    ]);

    const recentLinks = recentLinksRaw.map((link) => ({
      ...link,
      metadata: {
        status: link.metadata.status,
        description: link.metadata.description,
        favicon: link.metadata.favicon,
        ogImage: link.metadata.ogImage,
      },
    }));

    return {
      totalLinks,
      totalCollections,
      totalFavouriteLinks,
      recentLinks,
      recentCollections: recentCollectionsRaw,
    };
  }
}