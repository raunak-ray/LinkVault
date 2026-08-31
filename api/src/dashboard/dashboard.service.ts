import { Inject, Injectable, Logger } from '@nestjs/common';
import { DbProvider } from 'src/db/db.provider';
import { DashboardResponse } from './interface/dashboard-response';
import { Collection, Link, LinkMetadata } from 'src/db/schema';
import { and, count, eq, desc } from 'drizzle-orm';
import { RECENT_COLLECTION_LIMIT, RECENT_LINKS_LIMIT } from './constant';
import { DASHBOARD_CACHE_KEY, DASHBOARD_CACHE_TTL } from './dashboard.cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { safeCacheGet, safeCacheSet } from 'src/common/utils/cache.utils';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly dbProvider: DbProvider,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getDashboardData(sub: string): Promise<DashboardResponse> {
    const cacheKey = DASHBOARD_CACHE_KEY(sub);

    const cachedData = await safeCacheGet<DashboardResponse>(
      this.cacheManager,
      cacheKey,
      this.logger,
      'dashboard',
    );

    if (cachedData) {
      return cachedData;
    }

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

    const recentCollections = recentCollectionsRaw.map((c) => ({
      ...c,
      linkCount: 0,
      previewLinks: [] as never[],
    }));

    const data = {
      totalLinks,
      totalCollections,
      totalFavouriteLinks,
      recentLinks,
      recentCollections,
    };

    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      data,
      DASHBOARD_CACHE_TTL,
      this.logger,
      'dashboard',
    );

    return data;
  }
}
