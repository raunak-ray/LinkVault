import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import { METADATA_QUEUE, METADATA_WORKER_CONCURRENCY } from './constants';
import { MetadataJobData } from './interfaces/metadata-job.interface';
import {
  MetadataFetcherService,
  NonHtmlResponseError,
} from './metadata-fetcher.service';
import { MetadataExtractorService } from './metadata-extractor.service';
import { MetadataService } from './metadata.service';

@Injectable()
@Processor(
  { name: METADATA_QUEUE },
  { concurrency: METADATA_WORKER_CONCURRENCY },
)
export class MetadataProcessor extends WorkerHost {
  private readonly logger = new Logger(MetadataProcessor.name);

  constructor(
    private readonly fetcher: MetadataFetcherService,
    private readonly extractor: MetadataExtractorService,
    private readonly metadataService: MetadataService,
  ) {
    super();
  }

  async process(job: Job<MetadataJobData>): Promise<void> {
    const { linkId, url } = job.data;
    const maxAttempts = job.opts.attempts ?? 1;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      // Not retriable — no point burning the remaining attempts
      await this.metadataService.saveFailure(linkId, `Invalid URL: ${url}`);
      return;
    }

    try {
      // Run the page fetch and the favicon-of-last-resort resolution
      // in parallel; the fallback is only used when the page itself
      // declares no usable favicon.
      const [html, fallbackFavicon] = await Promise.all([
        this.fetcher.fetchHtml(parsedUrl.href),
        Promise.resolve(this.fetcher.fallbackFavicon(parsedUrl.href)),
      ]);

      const metadata = this.extractor.extract(html, parsedUrl.href);

      if (!metadata.favicon && fallbackFavicon) {
        metadata.favicon = fallbackFavicon;
      }

      await this.metadataService.saveSuccess(linkId, metadata);
    } catch (error) {
      const message =
        error instanceof NonHtmlResponseError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unknown metadata extraction error';

      const isLastAttempt = job.attemptsMade + 1 >= maxAttempts;

      if (isLastAttempt || error instanceof NonHtmlResponseError) {
        await this.metadataService.saveFailure(linkId, message);
        return;
      }

      throw error;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job<MetadataJobData>) {
    this.logger.log(
      `Job ${job.id} active (attempt ${job.attemptsMade + 1}/${job.opts.attempts}): link ${job.data.linkId} ${job.data.url}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<MetadataJobData>) {
    this.logger.log(`Job ${job.id} completed: link ${job.data.linkId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<MetadataJobData>, error: Error) {
    this.logger.error(
      `Job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}): link ${job.data.linkId} ${job.data.url} — ${error.message}`,
    );
  }

  @OnWorkerEvent('error')
  onError(error: Error) {
    this.logger.error(`Worker error: ${error.message}`, error.stack);
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job<MetadataJobData>) {
    this.logger.warn(`Job ${job.id} stalled: link ${job.data.linkId}`);
  }
}
