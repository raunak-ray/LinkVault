import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import {
  METADATA_JOB,
  METADATA_JOB_OPTIONS,
  METADATA_QUEUE,
} from './constants';
import { MetadataJobData } from './interfaces/metadata-job.interface';

@Injectable()
export class MetadataProducerService {
  private readonly logger = new Logger(MetadataProducerService.name);

  constructor(
    @InjectQueue(METADATA_QUEUE) private readonly queue: Queue<MetadataJobData>,
  ) {}

  async enqueueExtraction(job: MetadataJobData): Promise<void> {
    await this.queue.add(METADATA_JOB, job, METADATA_JOB_OPTIONS);

    this.logger.log(
      `Enqueued metadata extraction for link ${job.linkId} (${job.url})`,
    );
  }
}
