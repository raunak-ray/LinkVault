import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  imports: [AuthModule, MetadataModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
