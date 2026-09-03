import { Injectable, Logger } from '@nestjs/common';
import { and, count, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { DbProvider } from 'src/db/db.provider';
import { Collection, Link, LinkMetadata } from 'src/db/schema';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(private readonly dbProvider: DbProvider) {}

  async globalSearch(userId: string, query: string, limit = 6) {
    const term = `%${query}%`;
    if (!query?.trim()) {
      return { links: [], collections: [] };
    }

    const [links, collections] = await Promise.all([
      this.dbProvider.db
        .select({
          id: Link.id,
          title: Link.title,
          url: Link.url,
          isFavourite: Link.is_favourite,
          collection: { id: Collection.id, name: Collection.name },
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
        .innerJoin(Collection, and(eq(Link.collection_id, Collection.id), eq(Collection.user_id, userId)))
        .innerJoin(LinkMetadata, eq(Link.id, LinkMetadata.link_id))
        .where(and(eq(Link.user_id, userId), or(ilike(Link.title, term), ilike(Link.url, term), ilike(LinkMetadata.description, term))!))
        .orderBy(desc(Link.updated_at))
        .limit(limit),

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
        .where(and(eq(Collection.user_id, userId), ilike(Collection.name, term)))
        .orderBy(desc(Collection.updated_at))
        .limit(limit),
    ]);

    // Enrich collections with linkCount preview similarly light
    let enrichedCollections = collections.map((c) => ({ ...c, linkCount: 0, previewLinks: [] as any[] }));
    if (collections.length) {
      const ids = collections.map((c) => c.id);
      try {
        const counts = await this.dbProvider.db
          .select({ collectionId: Link.collection_id, total: count() })
          .from(Link)
          .where(and(eq(Link.user_id, userId), inArray(Link.collection_id, ids)))
          .groupBy(Link.collection_id);
        const map = new Map<string, number>();
        for (const r of counts as any[]) map.set(r.collectionId, Number(r.total));
        enrichedCollections = enrichedCollections.map((c) => ({ ...c, linkCount: map.get(c.id) ?? 0 }));
      } catch {}
    }

    return { links, collections: enrichedCollections };
  }
}
