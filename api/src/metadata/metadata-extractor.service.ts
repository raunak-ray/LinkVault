import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

import { ExtractedMetadata } from './interfaces/extracted-metadata.interface';

@Injectable()
export class MetadataExtractorService {
  /**
   * Extracts only the fields stored in the link metadata table:
   * description, favicon and og_image. Every field has multiple
   * fallbacks because sites differ wildly in what they declare.
   */
  extract(html: string, sourceUrl: string): ExtractedMetadata {
    const $ = cheerio.load(html);

    return {
      description: this.extractDescription($),
      favicon: this.extractFavicon($, sourceUrl),
      og_image: this.extractImage($, sourceUrl),
    };
  }

  private extractDescription($: cheerio.CheerioAPI): string | null {
    const fromMeta = this.firstNotEmpty(
      $('meta[name="description"]').attr('content'),
      $('meta[property="og:description"]').attr('content'),
      $('meta[name="twitter:description"]').attr('content'),
      $('meta[itemprop="description"]').attr('content'),
    );

    if (fromMeta) return fromMeta;

    // Schema.org JSON-LD fallback (Article, WebPage, Product, ...)
    const jsonLd = this.extractFromJsonLd($, ['description']);
    const jsonLdDescription = jsonLd.description;

    if (typeof jsonLdDescription === 'string') {
      return this.firstNotEmpty(jsonLdDescription);
    }

    return null;
  }

  private extractFavicon(
    $: cheerio.CheerioAPI,
    sourceUrl: string,
  ): string | null {
    const declared = this.firstNotEmpty(
      $('link[rel="icon"]').attr('href'),
      $('link[rel="shortcut icon"]').attr('href'),
      $('link[rel="apple-touch-icon"]').attr('href'),
      $('link[rel="apple-touch-icon-precomposed"]').attr('href'),
      $('link[rel="mask-icon"]').attr('href'),
      $('meta[itemprop="image"]').attr('content'),
    );

    if (declared) return this.absoluteUrl(declared, sourceUrl);

    // Conventional location when the page declares nothing
    return this.absoluteUrl('/favicon.ico', sourceUrl);
  }

  private extractImage(
    $: cheerio.CheerioAPI,
    sourceUrl: string,
  ): string | null {
    const fromMeta = this.firstNotEmpty(
      $('meta[property="og:image"]').attr('content'),
      $('meta[property="og:image:url"]').attr('content'),
      $('meta[property="og:image:secure_url"]').attr('content'),
      $('meta[name="twitter:image"]').attr('content'),
      $('meta[name="twitter:image:src"]').attr('content'),
      $('meta[itemprop="image"]').attr('content'),
      $('link[rel="image_src"]').attr('href'),
    );

    if (fromMeta) return this.absoluteUrl(fromMeta, sourceUrl);

    // Schema.org JSON-LD fallback (primaryImageOfPage, image, thumbnailUrl)
    const jsonLd = this.extractFromJsonLd($, [
      'primaryImageOfPage',
      'image',
      'thumbnailUrl',
    ]);

    const image =
      jsonLd.primaryImageOfPage ?? jsonLd.image ?? jsonLd.thumbnailUrl ?? null;

    if (typeof image === 'string') {
      return this.absoluteUrl(image, sourceUrl);
    }

    // JSON-LD image can be an object like { "@type": "ImageObject", "url": "..." }
    if (image && typeof image === 'object' && !Array.isArray(image)) {
      const url = (image as Record<string, unknown>).url;
      if (typeof url === 'string') {
        return this.absoluteUrl(url, sourceUrl);
      }
    }

    return null;
  }

  private extractFromJsonLd(
    $: cheerio.CheerioAPI,
    keys: string[],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    $('script[type="application/ld+json"]').each((_, element) => {
      if (Object.keys(result).length === keys.length) return;

      try {
        const parsed: unknown = JSON.parse($(element).text());
        const nodes: unknown[] = Array.isArray(parsed) ? parsed : [parsed];

        for (const node of nodes) {
          if (!node || typeof node !== 'object') continue;

          const record = node as Record<string, unknown>;

          for (const key of keys) {
            if (result[key] === undefined && record[key] !== undefined) {
              result[key] = record[key];
            }
          }
        }
      } catch {
        // Malformed JSON-LD is common; ignore and try the next script tag
      }
    });

    return result;
  }

  private clean(value: string): string | null {
    const collapsed = value.replace(/\s+/g, ' ').trim();
    return collapsed || null;
  }

  private firstNotEmpty(...values: Array<string | undefined | null>) {
    for (const value of values) {
      const cleaned = value ? this.clean(value) : null;
      if (cleaned) return cleaned;
    }
    return null;
  }

  private absoluteUrl(value: string | null, baseUrl: string): string | null {
    if (!value) return null;

    try {
      return new URL(value, baseUrl).toString();
    } catch {
      return null;
    }
  }
}
