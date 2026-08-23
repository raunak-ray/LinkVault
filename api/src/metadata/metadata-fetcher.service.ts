import { Injectable, Logger } from '@nestjs/common';

import { METADATA_FETCH_TIMEOUT_MS, METADATA_USER_AGENT } from './constants';

export class NonHtmlResponseError extends Error {
  constructor(readonly contentType: string) {
    super(`Non-HTML response: ${contentType}`);
    this.name = 'NonHtmlResponseError';
  }
}

@Injectable()
export class MetadataFetcherService {
  private readonly logger = new Logger(MetadataFetcherService.name);

  async fetchHtml(url: string): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      METADATA_FETCH_TIMEOUT_MS,
    );

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': METADATA_USER_AGENT,
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('text/html')) {
        throw new NonHtmlResponseError(contentType);
      }

      return await response.text();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn(
          `Fetch timed out after ${METADATA_FETCH_TIMEOUT_MS}ms: ${url}`,
        );
        throw new Error(`Metadata fetch timeout: ${url}`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Favicon of last resort for sites that declare none and have
   * nothing at /favicon.ico. No network call needed, just a
   * well-known favicon proxy URL.
   */
  fallbackFavicon(sourceUrl: string): string | null {
    try {
      return `https://icons.duckduckgo.com/ip3/${new URL(sourceUrl).hostname}.ico`;
    } catch {
      return null;
    }
  }
}
