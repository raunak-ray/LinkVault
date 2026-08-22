import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { METADATA_QUEUE } from './constants';
import { MetadataProducerService } from './metadata-producer.service';
import { MetadataProcessor } from './metadata.processor';
import { MetadataService } from './metadata.service';
import { MetadataExtractorService } from './metadata-extractor.service';
import { MetadataFetcherService } from './metadata-fetcher.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: METADATA_QUEUE,
    }),
  ],
  providers: [
    MetadataService,
    MetadataProducerService,
    MetadataProcessor,
    MetadataExtractorService,
    MetadataFetcherService,
  ],
  exports: [MetadataService, MetadataProducerService],
})
export class MetadataModule {}
